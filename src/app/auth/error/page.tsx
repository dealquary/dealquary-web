"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Map NextAuth error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    Default: "Unable to sign in.",
    OAuthSignin: "Error in constructing an authorization URL.",
    OAuthCallback: "Error in handling the response from the OAuth provider.",
    OAuthCreateAccount: "Could not create OAuth provider user in the database.",
    EmailCreateAccount: "Could not create email provider user in the database.",
    Callback: "Error in the OAuth callback handler route.",
    OAuthAccountNotLinked: "Email on the account is already linked, but not with this OAuth account.",
    EmailSignin: "The email could not be sent.",
    CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  console.error("[auth][error-page]", {
    error,
    errorMessage,
    allParams: Object.fromEntries(searchParams.entries()),
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Card glow="pink">
        <div className="p-8 max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-400/30">
            <svg
              className="w-8 h-8 text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Authentication Error
          </h1>

          <p className="text-white/60 text-center mb-6">
            {errorMessage}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-400/20 rounded-lg">
              <p className="text-xs font-mono text-red-300">
                Error code: {error}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/" className="block">
              <Button variant="primary" className="w-full">
                Back to Home
              </Button>
            </Link>

            <Link href="/api/auth/signin" className="block">
              <Button variant="secondary" className="w-full">
                Try Again
              </Button>
            </Link>
          </div>

          <p className="text-xs text-white/40 text-center mt-6">
            If this problem persists, please contact support.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900"><div className="text-white">Loading...</div></div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
