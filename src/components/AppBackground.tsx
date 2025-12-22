"use client";

export default function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070A12] text-white relative overflow-hidden">
      {/* gradient wash */}
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(168,85,247,0.25),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(34,211,238,0.18),transparent_60%),radial-gradient(900px_circle_at_50%_90%,rgba(236,72,153,0.18),transparent_55%)]" />

      {/* subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* noise overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.6%22/%3E%3C/svg%3E')]" />

      <div className="relative">{children}</div>
    </div>
  );
}
