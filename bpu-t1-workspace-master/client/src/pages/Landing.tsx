import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* Top Bracket */}
        <div className="text-center mb-8">
          <div className="bracket text-4xl mb-4">[</div>
        </div>

        {/* Title with Chromatic Aberration */}
        <h1 className="text-6xl md:text-8xl font-bold text-center mb-4 neon-text glitch" data-text="WORLD RUNTIME OS">
          WORLD RUNTIME OS
        </h1>

        {/* Version Badge */}
        <div className="text-2xl md:text-3xl font-bold text-center mb-8">
          <span className="text-neon-cyan">v0.3</span>
          <span className="mx-2 text-neon-magenta">/</span>
          <span className="text-neon-magenta">PLUGIN ECONOMY</span>
        </div>

        {/* Subtitle */}
        <p className="text-center text-lg md:text-xl max-w-2xl mb-8 text-muted-foreground leading-relaxed">
          A programmable infrastructure layer for national-scale interoperability.
          <br />
          <span className="text-neon-cyan">[ SYSTEM READY ]</span>
        </p>

        {/* Architecture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-12">
          {/* Plugin Economy */}
          <div className="terminal-card">
            <div className="bracket text-2xl mb-2">&gt;</div>
            <h3 className="text-lg font-bold mb-3 text-neon-cyan">PLUGIN ECONOMY</h3>
            <p className="text-sm text-muted-foreground">
              Extensible architecture with SHA, M-Pesa, and custom integrations.
            </p>
          </div>

          {/* Billing Engine */}
          <div className="terminal-card">
            <div className="bracket text-2xl mb-2">&gt;</div>
            <h3 className="text-lg font-bold mb-3 text-neon-magenta">BILLING ENGINE</h3>
            <p className="text-sm text-muted-foreground">
              Real-time cost tracking and metering for every operation.
            </p>
          </div>

          {/* Federation Ready */}
          <div className="terminal-card">
            <div className="bracket text-2xl mb-2">&gt;</div>
            <h3 className="text-lg font-bold mb-3 text-neon-green">FEDERATION READY</h3>
            <p className="text-sm text-muted-foreground">
              County-scale deployment with peer-to-peer synchronization.
            </p>
          </div>
        </div>

        {/* Bottom Bracket */}
        <div className="bracket text-4xl mb-8">]</div>

        {/* CTA Button */}
        <button
          onClick={() => setLocation("/dashboard")}
          className="btn-neon text-xl px-8 py-4 mb-8"
        >
          ENTER DASHBOARD
        </button>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 text-sm">
          <div className="status-online rounded-full w-3 h-3" />
          <span className="text-neon-green">SYSTEM OPERATIONAL</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t-2 [border-color:rgba(0,255,255,0.3)] py-4 px-4 text-center text-xs text-muted-foreground">
        <span className="bracket">[</span>
        {" "}World Runtime OS v0.3 | National Infrastructure Layer{" "}
        <span className="bracket">]</span>
      </div>
    </div>
  );
}
