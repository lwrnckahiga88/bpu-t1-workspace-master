import { trpc } from "@/lib/trpc";

export default function HealthMonitor() {
  const { data: plugins = [], isLoading: pluginsLoading } = trpc.health.plugins.useQuery();
  const { data: runtimeHealth, isLoading: runtimeLoading } = trpc.health.runtime.useQuery();

  const isLoading = pluginsLoading || runtimeLoading;

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "online":
        return "text-neon-green";
      case "offline":
        return "text-neon-red";
      case "warning":
        return "text-neon-yellow";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "online":
        return "status-online";
      case "offline":
        return "status-offline";
      case "warning":
        return "status-warning";
      default:
        return "bg-gray-500";
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return "text-neon-green";
    if (health >= 85) return "text-neon-yellow";
    return "text-neon-red";
  };

  if (isLoading) {
    return (
      <div className="terminal-card">
        <p className="text-muted-foreground">Loading health monitor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Runtime Health */}
      <div className="terminal-card">
        <div className="bracket text-2xl mb-4">[</div>
        <h3 className="text-lg font-bold text-neon-cyan mb-6">RUNTIME HEALTH SUMMARY</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">STATUS</p>
            <p className={`text-lg font-bold uppercase ${getStatusColor(runtimeHealth?.status)}`}>
              {runtimeHealth?.status}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">HEALTH</p>
            <p className={`text-lg font-bold ${getHealthColor(runtimeHealth?.health || 0)}`}>
              {runtimeHealth?.health.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">UPTIME</p>
            <p className="text-lg font-bold text-neon-green">{runtimeHealth?.uptime.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">TOTAL REQUESTS</p>
            <p className="text-lg font-bold text-neon-magenta">{runtimeHealth?.totalRequests}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">ERRORS</p>
            <p className="text-lg font-bold text-neon-red">{runtimeHealth?.totalErrors}</p>
          </div>
        </div>

        {/* Overall Health Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">SYSTEM HEALTH</span>
            <span className="text-sm font-bold text-neon-cyan">{runtimeHealth?.health.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-input [border-color:rgba(0,255,255,0.3)] border h-3">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
              style={{
                width: `${runtimeHealth?.health}%`,
                boxShadow: "0 0 15px rgba(0, 255, 255, 0.6)",
              }}
            />
          </div>
        </div>

        <div className="bracket text-2xl">]</div>
      </div>

      {/* Individual Plugin Health */}
      <div className="terminal-card">
        <div className="bracket text-2xl mb-4">[</div>
        <h3 className="text-lg font-bold text-neon-cyan mb-4">PLUGIN HEALTH STATUS</h3>

        <div className="space-y-6">
          {plugins.map((plugin: any) => (
            <div key={plugin.id} className="[border-color:rgba(0,255,255,0.2)] border [padding:1rem]">
              {/* Plugin Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-neon-cyan">{plugin.name}</h4>
                <div className={`flex items-center gap-2 ${getStatusColor(plugin.status)}`}>
                  <div className={`${getStatusBg(plugin.status)} rounded-full w-3 h-3`} />
                  <span className="text-xs font-bold uppercase">{plugin.status}</span>
                </div>
              </div>

              {/* Health Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">HEALTH</span>
                  <span className={`text-sm font-bold ${getHealthColor(plugin.health)}`}>
                    {plugin.health.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-input [border-color:rgba(0,255,255,0.3)] border h-2">
                  <div
                    className={`h-full ${
                      plugin.health >= 95
                        ? "bg-neon-green"
                        : plugin.health >= 85
                          ? "bg-neon-yellow"
                          : "bg-neon-red"
                    }`}
                    style={{
                      width: `${plugin.health}%`,
                      boxShadow: `0 0 10px ${
                        plugin.health >= 95
                          ? "rgba(0, 255, 0, 0.5)"
                          : plugin.health >= 85
                            ? "rgba(255, 255, 0, 0.5)"
                            : "rgba(255, 0, 0, 0.5)"
                      }`,
                    }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">UPTIME</span>
                  <p className="font-bold text-neon-green">{plugin.uptime.toFixed(2)}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">RESPONSE TIME</span>
                  <p className="font-bold text-neon-magenta">{plugin.responseTime.toFixed(0)}ms</p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">ERROR RATE</span>
                  <p className="font-bold text-neon-yellow">{plugin.errorRate.toFixed(2)}%</p>
                </div>
              </div>

              {/* Last Update */}
              <div className="mt-3 pt-3 border-t [border-color:rgba(0,255,255,0.1)]">
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bracket text-2xl mt-4">]</div>
      </div>

      {/* System Metrics */}
      <div className="terminal-card">
        <div className="bracket text-2xl mb-4">[</div>
        <h3 className="text-lg font-bold text-neon-cyan mb-4">SYSTEM METRICS</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">ERROR RATE TREND</p>
            <div className="bg-input [border-color:rgba(0,255,255,0.3)] border [padding:0.75rem] font-mono text-xs text-neon-green">
              {plugins.map((p: any) => (
                <div key={p.id}>{p.errorRate.toFixed(2)}% {p.name}</div>
              ))}
              <div className="mt-2 text-neon-cyan">↓ Trending Down</div>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">RESPONSE TIME TREND</p>
            <div className="bg-input [border-color:rgba(0,255,255,0.3)] border [padding:0.75rem] font-mono text-xs text-neon-green">
              {plugins.map((p: any) => (
                <div key={p.id}>{p.responseTime.toFixed(0)}ms {p.name}</div>
              ))}
              <div className="mt-2 text-neon-yellow">→ Stable</div>
            </div>
          </div>
        </div>

        <div className="bracket text-2xl mt-4">]</div>
      </div>
    </div>
  );
}
