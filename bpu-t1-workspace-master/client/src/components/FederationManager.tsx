import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function FederationManager() {
  const [broadcastMessage, setBroadcastMessage] = useState("System update broadcast");
  const [broadcastResult, setBroadcastResult] = useState<string>("");

  const { data: peers = [], isLoading } = trpc.federation.peers.useQuery();
  const broadcastMutation = trpc.federation.broadcast.useMutation();

  const handleBroadcast = async () => {
    setBroadcastResult("");
    try {
      const result = await broadcastMutation.mutateAsync({
        message: broadcastMessage,
      });
      setBroadcastResult(JSON.stringify(result, null, 2));
    } catch (err) {
      setBroadcastResult(`Broadcast failed: ${err}`);
    }
  };

  if (isLoading) {
    return (
      <div className="terminal-card">
        <p className="text-muted-foreground">Loading federation data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Peer Nodes */}
      <div className="terminal-card">
        <div className="bracket text-2xl mb-4">[</div>
        <h3 className="text-lg font-bold text-neon-cyan mb-4">PEER NODES</h3>

        <div className="space-y-4">
          {peers.map((peer: any) => (
            <div key={peer.id} className="[border-color:rgba(0,255,255,0.2)] border [padding:1rem]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-neon-cyan">{peer.name}</h4>
                <span className="text-xs font-bold uppercase text-neon-green">
                  {peer.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">ADDRESS</p>
                  <p className="font-mono text-neon-magenta">{peer.address}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">LAST SYNC</p>
                  <p className="font-mono text-neon-cyan">
                    {new Date(peer.lastSync).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">EVENTS</p>
                  <p className="font-mono text-neon-green">{peer.eventCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bracket text-2xl mt-4">]</div>
      </div>

      {/* Broadcast Simulator */}
      <div className="terminal-card">
        <div className="bracket text-2xl mb-4">[</div>
        <h3 className="text-lg font-bold text-neon-cyan mb-4">BROADCAST SIMULATOR</h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-2">MESSAGE</label>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="input-neon w-full h-24 font-mono text-sm"
              placeholder="Enter broadcast message..."
            />
          </div>

          <button
            onClick={handleBroadcast}
            disabled={broadcastMutation.isPending}
            className="btn-neon w-full py-3 font-bold text-lg disabled:opacity-50"
          >
            {broadcastMutation.isPending ? "BROADCASTING..." : "BROADCAST TO PEERS"}
          </button>

          {broadcastResult && (
            <div className="code-block">
              <pre className="text-xs overflow-auto max-h-40">{broadcastResult}</pre>
            </div>
          )}
        </div>

        <div className="bracket text-2xl mt-4">]</div>
      </div>

      {/* Network Status */}
      <div className="terminal-card">
        <div className="bracket text-2xl mb-4">[</div>
        <h3 className="text-lg font-bold text-neon-cyan mb-4">NETWORK STATUS</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">TOTAL PEERS</p>
            <p className="text-2xl font-bold text-neon-green">{peers.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">ONLINE PEERS</p>
            <p className="text-2xl font-bold text-neon-cyan">
              {peers.filter((p: any) => p.status === "online").length}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">TOTAL EVENTS</p>
            <p className="text-2xl font-bold text-neon-magenta">
              {peers.reduce((sum: number, p: any) => sum + p.eventCount, 0)}
            </p>
          </div>
        </div>

        <div className="bracket text-2xl mt-4">]</div>
      </div>
    </div>
  );
}
