import { Transaction } from "./types";

export class BillingEngine {
  private transactions: Transaction[] = [];

  constructor() {
    // Initialize with mock data from the whitepaper
    this.transactions = [
      {
        id: "TXN001",
        pluginId: "sha-plugin",
        pluginName: "SHA Adapter",
        method: "read",
        cost: 0.10,
        currency: "KSh",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "TXN002",
        pluginId: "mpesa-plugin",
        pluginName: "M-Pesa Adapter",
        method: "write",
        cost: 0.50,
        currency: "KSh",
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: "TXN003",
        pluginId: "sha-plugin",
        pluginName: "SHA Adapter",
        method: "connect",
        cost: 0.00,
        currency: "KSh",
        timestamp: new Date(Date.now() - 1200000),
      },
      {
        id: "TXN004",
        pluginId: "openmrs-plugin",
        pluginName: "OpenMRS Adapter",
        method: "read",
        cost: 0.20,
        currency: "KSh",
        timestamp: new Date(Date.now() - 600000),
      },
    ];
  }

  recordTransaction(transaction: Omit<Transaction, "id" | "timestamp">): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: `TXN${(this.transactions.length + 1).toString().padStart(3, "0")}`,
      timestamp: new Date(),
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  getBillingSummary() {
    const byPlugin: Record<string, number> = {};
    let grandTotal = 0;
    this.transactions.forEach((tx) => {
      if (!byPlugin[tx.pluginName]) {
        byPlugin[tx.pluginName] = 0;
      }
      byPlugin[tx.pluginName] += tx.cost;
      grandTotal += tx.cost;
    });
    return {
      byPlugin,
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      totalTransactions: this.transactions.length,
    };
  }
}
