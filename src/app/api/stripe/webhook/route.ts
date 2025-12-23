import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error("Webhook signature verification failed", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;

        // Find user by Stripe customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          logger.error("User not found for customer", undefined, { customerId });
          break;
        }

        // Mark user as Pro
        await prisma.user.update({
          where: { id: user.id },
          data: { isPro: true },
        });

        // Create subscription record if subscription ID is available
        if (session.subscription) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sub = await stripe.subscriptions.retrieve(session.subscription as string) as any;

          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: sub.id },
            create: {
              userId: user.id,
              stripeSubscriptionId: sub.id,
              stripeCustomerId: customerId,
              stripePriceId: sub.items.data[0].price.id,
              status: sub.status,
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            },
            update: {
              status: sub.status,
              currentPeriodStart: new Date(sub.current_period_start * 1000),
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            },
          });
        }

        logger.info("User upgraded to Pro", { email: user.email });
        break;
      }

      case "customer.subscription.updated": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = event.data.object as any;
        const customerId = sub.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          logger.error("User not found for customer", undefined, { customerId });
          break;
        }

        // Update subscription record
        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: sub.id },
          create: {
            userId: user.id,
            stripeSubscriptionId: sub.id,
            stripeCustomerId: customerId,
            stripePriceId: sub.items.data[0].price.id,
            status: sub.status,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
          update: {
            status: sub.status,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });

        // Update isPro based on subscription status
        const isActive = sub.status === "active" || sub.status === "trialing";
        await prisma.user.update({
          where: { id: user.id },
          data: { isPro: isActive },
        });

        logger.info("Subscription updated", { email: user.email, status: sub.status });
        break;
      }

      case "customer.subscription.deleted": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          logger.error("User not found for customer", undefined, { customerId });
          break;
        }

        // Remove Pro status
        await prisma.user.update({
          where: { id: user.id },
          data: { isPro: false },
        });

        // Update subscription record
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: "canceled" },
        });

        logger.info("Subscription canceled", { email: user.email });
        break;
      }

      default:
        logger.debug("Unhandled event type", { eventType: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Webhook handler error", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
