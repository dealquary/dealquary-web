import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl;

  // Only redirect to dealquary.app in production
  // Skip localhost, Vercel preview URLs, and development
  const isProduction = host === "dealquary.app";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const isVercelPreview = host.includes("vercel.app");

  // Redirect to canonical domain only in production from wrong domains
  if (!isProduction && !isLocalhost && !isVercelPreview && process.env.NODE_ENV === "production") {
    url.hostname = "dealquary.app";
    url.protocol = "https:";
    return NextResponse.redirect(url, 307); // 307 Temporary - prevents aggressive caching
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
