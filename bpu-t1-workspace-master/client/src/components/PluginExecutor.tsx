import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function PluginExecutor() {
  const [selectedPlugin, setSelectedPlugin] = useState("sha-plugin");
  const [selectedMethod, setSelectedMethod] = useState("read");
  const [payload, setPayload] = useState("P001");
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { data: plugins = [] } = trpc.plugins.list.useQuery();
  const executeMutation = trpc.executor.execute.useMutation();

  const methods = ["read", "write", "health", "connect"] as const;

  const handleExecute = async () => {
    setError("");
    setResponse("");

    try {
      const result = await executeMutation.mutateAsync({
        pluginId: selectedPlugin,
        method: selectedMethod as any,
        payload: payload,
      });

      setResponse(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(`Execution failed: ${err}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Executor Controls */}
      <div className="terminal-card">
        <div className="bracket text-2xl mb-4">[</div>
        <h3 className="text-lg font-bold text-neon-cyan mb-6">PLUGIN EXECUTOR</h3>

        {/* Plugin Selector */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-muted-foreground mb-2">
            SELECT PLUGIN
          </label>
          <div className="flex gap-2">
            {plugins.map((plugin) => (
              <button
                key={plugin.id}
                onClick={() => setSelectedPlugin(plugin.id)}
                className={`px-4 py-2 font-mono text-sm transition-all ${
                  selectedPlugin === plugin.id
                    ? "[background-color:rgba(0,255,255,0.2)] border-2 border-neon-cyan text-neon-cyan"
                    : "border-2 [border-color:rgba(0,255,255,0.3)] text-muted-foreground hover:border-neon-cyan"
                }`}
              >
                {plugin.name}
              </button>
            ))}
          </div>
        </div>

        {/* Method Selector */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-muted-foreground mb-2">
            SELECT METHOD
          </label>
          <div className="grid grid-cols-4 gap-2">
            {methods.map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`px-3 py-2 font-mono text-sm transition-all ${
                  selectedMethod === method
                    ? "[background-color:rgba(255,0,255,0.2)] border-2 border-neon-magenta text-neon-magenta"
                    : "border-2 [border-color:rgba(255,0,255,0.3)] text-muted-foreground hover:border-neon-magenta"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Payload Input */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-muted-foreground mb-2">
            PAYLOAD (JSON)
          </label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="input-neon w-full h-24 font-mono text-sm resize-none"
            placeholder='{"key": "value"}'
          />
        </div>

        {/* Execute Button */}
        <button
          onClick={handleExecute}
          disabled={executeMutation.isPending}
          className="btn-neon w-full py-3 font-bold text-lg disabled:opacity-50"
        >
          {executeMutation.isPending ? "EXECUTING..." : "EXECUTE"}
        </button>

        <div className="bracket text-2xl mt-4">]</div>
      </div>

      {/* Response Display */}
      {response && (
        <div className="terminal-card">
          <div className="bracket text-2xl mb-4">[</div>
          <h3 className="text-lg font-bold text-neon-green mb-4">RESPONSE</h3>
          <pre className="code-block text-xs overflow-x-auto max-h-96">
            {response}
          </pre>
          <div className="bracket text-2xl mt-4">]</div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="terminal-card [border-color:rgba(255,0,0,0.5)]">
          <div className="bracket text-2xl mb-4 text-neon-red">[</div>
          <h3 className="text-lg font-bold text-neon-red mb-4">ERROR</h3>
          <p className="text-sm text-neon-red">{error}</p>
          <div className="bracket text-2xl mt-4 text-neon-red">]</div>
        </div>
      )}
    </div>
  );
}
