import { trpc } from "@/lib/trpc";

export default function BillingLedger() {
  const { data: transactions = [], isLoading: txLoading } = trpc.billing.transactions.useQuery();
  const { data: summary, isLoading: summaryLoading } = trpc.billing.summary.useQuery();

  const isLoading = txLoading || summaryLoading;

  if (isLoading) {
    return (
      <div className="terminal-card">
        <p className="text-muted-foreground">Loading billing ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cost Summary */}
      <div className="terminal-card">
        <div className="bracket text-2xl mb-4">[</div>
        <h3 className="text-lg font-bold text-neon-cyan mb-4">COST SUMMARY</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">TOTAL CHARGES</p>
            <p className="text-2xl font-bold text-neon-green">${summary?.grandTotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">TRANSACTIONS</p>
            <p className="text-2xl font-bold text-neon-magenta">{summary?.totalTransactions}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">AVERAGE COST</p>
            <p className="text-2xl font-bold text-neon-cyan">
              ${((summary?.grandTotal || 0) / (summary?.totalTransactions || 1)).toFixed(4)}
            </p>
          </div>
        </div>

        {/* Per-Plugin Breakdown */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">PER-PLUGIN BREAKDOWN</p>
          <div className="space-y-2">
            {Object.entries(summary?.byPlugin || {}).map(([plugin, cost]: any) => (
              <div key={plugin} className="flex justify-between items-center text-sm">
                <span className="text-neon-cyan">{plugin}</span>
                <span className="text-neon-green font-mono">${cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bracket text-2xl">]</div>
      </div>

      {/* Transaction History */}
      <div className="terminal-card">
        <div className="bracket text-2xl mb-4">[</div>
        <h3 className="text-lg font-bold text-neon-cyan mb-4">TRANSACTION HISTORY</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b [border-color:rgba(0,255,255,0.3)]">
                <th className="px-4 py-2 text-left text-neon-cyan font-bold">TXN ID</th>
                <th className="px-4 py-2 text-left text-neon-cyan font-bold">PLUGIN</th>
                <th className="px-4 py-2 text-left text-neon-cyan font-bold">METHOD</th>
                <th className="px-4 py-2 text-left text-neon-cyan font-bold">COST</th>
                <th className="px-4 py-2 text-left text-neon-cyan font-bold">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="border-b [border-color:rgba(0,255,255,0.1)] hover:bg-[background-color:rgba(0,255,255,0.05)]">
                  <td className="px-4 py-2 text-sm font-mono text-neon-cyan">{tx.id}</td>
                  <td className="px-4 py-2 text-sm text-muted-foreground">{tx.pluginName}</td>
                  <td className="px-4 py-2 text-sm text-neon-magenta">{tx.method}</td>
                  <td className="px-4 py-2 text-sm text-neon-green">${tx.cost.toFixed(4)}</td>
                  <td className="px-4 py-2 text-sm text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bracket text-2xl mt-4">]</div>
      </div>
    </div>
  );
}
