import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left: Copyright */}
          <div className="text-white/60 text-sm">
            © {new Date().getFullYear()} DealQuary. All rights reserved.
          </div>

          {/* Center/Right: Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/terms"
              className="text-white/60 hover:text-cyan-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-white/60 hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:support@dealquary.com"
              className="text-white/60 hover:text-cyan-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
