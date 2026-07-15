import { trpc } from "@/lib/trpc";

export default function PluginRegistry() {
  const { data: plugins = [], isLoading } = trpc.plugins.list.useQuery();

  const getStatusColor = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="terminal-card">
        <p className="text-muted-foreground">Loading plugin registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Registry Header */}
      <div className="terminal-card">
        <div className="bracket text-2xl mb-2">[</div>
        <h3 className="text-lg font-bold text-neon-cyan mb-2">REGISTERED PLUGINS</h3>
        <p className="text-sm text-muted-foreground">
          Total Plugins: {plugins.length} | Status: ALL OPERATIONAL
        </p>
        <div className="bracket text-2xl mt-4">]</div>
      </div>

      {/* Plugin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plugins.map((plugin: any) => (
          <div key={plugin.id} className="terminal-card">
            {/* Plugin Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-2xl font-bold text-neon-cyan">{plugin.name}</h4>
                <p className="text-xs text-muted-foreground font-mono mt-1">{plugin.id}</p>
              </div>
              <div className={`flex items-center gap-2 ${getStatusColor(plugin.status)}`}>
                <div className={`${getStatusBg(plugin.status)} rounded-full w-3 h-3`} />
                <span className="text-xs font-bold uppercase">{plugin.status}</span>
              </div>
            </div>

            {/* Health Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">HEALTH</span>
                <span className="text-sm font-bold text-neon-cyan">{plugin.health}%</span>
              </div>
              <div className="w-full bg-input border [border-color:rgba(0,255,255,0.3)] h-2">
                <div
                  className="h-full bg-neon-cyan"
                  style={{
                    width: `${plugin.health}%`,
                    boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                  }}
                />
              </div>
            </div>

            {/* Billing Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-muted-foreground">COST PER CALL</span>
                <p className="font-bold text-neon-magenta">
                  ${plugin.costPerCall} {plugin.currency}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">LAST CHECK</span>
                <p className="font-bold text-neon-green">
                  {plugin.lastCheck.toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Methods */}
            <div className="border-t [border-color:rgba(0,255,255,0.2)] pt-4">
              <p className="text-xs text-muted-foreground mb-2">AVAILABLE METHODS</p>
              <div className="flex gap-2 flex-wrap">
                {["read", "write", "health", "connect"].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 bg-input border [border-color:rgba(0,255,255,0.3)] text-xs font-mono text-neon-cyan"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
