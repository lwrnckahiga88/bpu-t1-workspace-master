import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import PluginRegistry from "@/components/PluginRegistry";
import PluginExecutor from "@/components/PluginExecutor";
import BillingLedger from "@/components/BillingLedger";
import FederationManager from "@/components/FederationManager";
import HealthMonitor from "@/components/HealthMonitor";

type ViewType = "registry" | "executor" | "billing" | "federation" | "health";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [activeView, setActiveView] = useState<ViewType>("registry");

  const navItems: { id: ViewType; label: string; icon: string }[] = [
    { id: "registry", label: "PLUGIN REGISTRY", icon: ">" },
    { id: "executor", label: "EXECUTOR", icon: ">" },
    { id: "billing", label: "BILLING LEDGER", icon: ">" },
    { id: "federation", label: "FEDERATION", icon: ">" },
    { id: "health", label: "HEALTH MONITOR", icon: ">" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b-2 [border-color:rgba(0,255,255,0.3)] py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="text-2xl font-bold neon-text hover:text-neon-magenta transition-colors"
          >
            WORLD RUNTIME OS v0.3
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="status-online rounded-full w-2 h-2" />
          <span className="text-xs text-neon-green">ONLINE</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-64 border-r-2 [border-color:rgba(0,255,255,0.3)] bg-card/50 overflow-y-auto">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full text-left px-4 py-3 font-mono text-sm transition-all ${
                  activeView === item.id
                    ? "[background-color:rgba(0,255,255,0.2)] border-l-4 border-neon-cyan text-neon-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-neon-cyan/10"
                }`}
              >
                <span className="bracket">{item.icon}</span> {item.label}
              </button>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 w-64 border-t-2 [border-color:rgba(0,255,255,0.3)] [padding:1rem]">
            <button
              onClick={() => setLocation("/")}
              className="w-full text-center py-2 text-xs text-muted-foreground hover:text-neon-magenta transition-colors"
            >
              [ EXIT SYSTEM ]
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* View Title */}
            <h2 className="text-4xl font-bold mb-6 neon-text">
              {navItems.find((item) => item.id === activeView)?.label}
            </h2>

            {/* View Content */}
            <div className="space-y-6">
              {activeView === "registry" && <PluginRegistry />}
              {activeView === "executor" && <PluginExecutor />}
              {activeView === "billing" && <BillingLedger />}
              {activeView === "federation" && <FederationManager />}
              {activeView === "health" && <HealthMonitor />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
