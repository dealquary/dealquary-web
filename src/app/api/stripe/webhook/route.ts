import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
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
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
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
          console.error("User not found for customer:", customerId);
          break;
        }

        // Mark user as Pro
        await prisma.user.update({
          where: { id: user.id },
          data: { isPro: true },
        });

        // Create subscription record if subscription ID is available
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const sub: any = subscription;

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

        console.log(`User ${user.email} upgraded to Pro`);
        break;
      }

      case "customer.subscription.updated": {
        const sub: any = event.data.object;
        const customerId = sub.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          console.error("User not found for customer:", customerId);
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

        console.log(`Subscription updated for ${user.email}: ${sub.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription: any = event.data.object;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          console.error("User not found for customer:", customerId);
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

        console.log(`Subscription canceled for ${user.email}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
