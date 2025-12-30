"use client";

import { useSession, signOut } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import AppBackground from "@/components/AppBackground";
import Image from "next/image";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <AppBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      </AppBackground>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  const user = session.user;
  const isPro = user?.isPro || false;

  return (
    <AppBackground>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => router.push("/")}
                className="!px-3 !py-1.5 text-sm"
              >
                ← Back to App
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Account Settings
                </h1>
                <p className="text-xs text-white/60">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Card */}
          <Card glow="cyan" className="bg-white/10">
            <div className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Profile</h2>
              <div className="flex items-center gap-4 mb-6">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <div className="text-white font-semibold">{user.name}</div>
                  <div className="text-white/60 text-sm">{user.email}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-white/70 text-sm">Plan</span>
                  <span className={`font-semibold ${isPro ? "text-amber-300" : "text-white/90"}`}>
                    {isPro ? "Pro" : "Free"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-white/70 text-sm">Member since</span>
                  <span className="text-white/90 text-sm">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card glow="none" className="bg-white/8">
            <div className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  onClick={() => router.push("/billing")}
                  className="w-full justify-between"
                >
                  <span>{isPro ? "Manage Subscription" : "Upgrade to Pro"}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
                <Button
                  variant="danger"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>

          {/* Info */}
          <div className="text-center">
            <p className="text-xs text-white/40">
              DealQuary does not store customer PII or contract documents. Calculations are private to your account.
            </p>
          </div>
        </div>
      </div>
    </AppBackground>
  );
}
