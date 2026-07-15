import { Plugin } from "./types";

export class PluginRegistry {
  private plugins: Plugin[] = [];

  constructor() {
    // Initialize with mock data from the whitepaper
    this.plugins = [
      {
        id: "sha-plugin",
        name: "SHA Adapter",
        status: "online",
        health: 98,
        costPerCall: 0.10, // KSh
        currency: "KSh",
        lastCheck: new Date(),
      },
      {
        id: "mpesa-plugin",
        name: "M-Pesa Adapter",
        status: "online",
        health: 95,
        costPerCall: 0.50, // KSh
        currency: "KSh",
        lastCheck: new Date(),
      },
      {
        id: "openmrs-plugin",
        name: "OpenMRS Adapter",
        status: "online",
        health: 92,
        costPerCall: 0.20, // KSh
        currency: "KSh",
        lastCheck: new Date(),
      },
      {
        id: "lab-plugin",
        name: "Lab Adapter",
        status: "online",
        health: 90,
        costPerCall: 0.30, // KSh
        currency: "KSh",
        lastCheck: new Date(),
      },
      {
        id: "insurance-plugin",
        name: "Insurance Adapter",
        status: "online",
        health: 93,
        costPerCall: 0.40, // KSh
        currency: "KSh",
        lastCheck: new Date(),
      },
      {
        id: "identity-plugin",
        name: "Identity Adapter",
        status: "online",
        health: 96,
        costPerCall: 0.05, // KSh
        currency: "KSh",
        lastCheck: new Date(),
      },
      {
        // The only entry in this list backed by a real adapter — see
        // adapters/bpu-adapter-wrs-clinic. health/status below are updated
        // from an actual /api/health round-trip in runtimeCore, not mock data.
        id: "wrs-clinic-plugin",
        name: "WRS Clinic Adapter",
        status: "offline",
        health: 0,
        costPerCall: 0,
        currency: "KSh",
        lastCheck: new Date(),
      },
    ];
  }

  listPlugins(): Plugin[] {
    return this.plugins;
  }

  getPluginById(id: string): Plugin | undefined {
    return this.plugins.find((p) => p.id === id);
  }

  // Simulate health check for all plugins
  getOverallHealth(): { status: string; health: number; uptime: number; totalRequests: number; totalErrors: number } {
    const totalHealth = this.plugins.reduce((sum, p) => sum + p.health, 0);
    const averageHealth = totalHealth / this.plugins.length;
    return {
      status: averageHealth > 90 ? "operational" : "degraded",
      health: parseFloat(averageHealth.toFixed(2)),
      uptime: 99.65, // Placeholder
      totalRequests: 12847, // Placeholder
      totalErrors: 64, // Placeholder
    };
  }

  // Method to update plugin status/health (for future use)
  updatePluginStatus(id: string, status: Plugin["status"], health: number) {
    const plugin = this.getPluginById(id);
    if (plugin) {
      plugin.status = status;
      plugin.health = health;
      plugin.lastCheck = new Date();
    }
  }
}
