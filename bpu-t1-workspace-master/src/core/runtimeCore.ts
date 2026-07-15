import { Adapter, RuntimeHealth } from "./types";
import { PluginRegistry } from "./pluginRegistry";
import { BillingEngine } from "./billingEngine";
import { wrsClinicAdapter } from "../../adapters/bpu-adapter-wrs-clinic/wrs-clinic.adapter.js";

export class RuntimeCore {
  private pluginRegistry: PluginRegistry;
  private billingEngine: BillingEngine;

  constructor(pluginRegistry: PluginRegistry, billingEngine: BillingEngine) {
    this.pluginRegistry = pluginRegistry;
    this.billingEngine = billingEngine;
  }

  async executePluginMethod(pluginId: string, method: keyof Adapter, payload: any): Promise<any> {
    const plugin = this.pluginRegistry.getPluginById(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    // wrs-clinic-plugin is the one real integration in this registry — route
    // it to the actual adapter (genuine HTTP calls to the WRS Clinic
    // Gateway) instead of the simulated branch below that every other
    // (mock) plugin goes through.
    if (pluginId === "wrs-clinic-plugin") {
      return this.executeRealWrsClinicCall(plugin, method, payload);
    }

    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real scenario, this would dynamically call the adapter method
    // For now, we simulate success and record a transaction
    const cost = plugin.costPerCall; // Assuming cost is per call for simplicity
    this.billingEngine.recordTransaction({
      pluginId: plugin.id,
      pluginName: plugin.name,
      method: method,
      cost: cost,
      currency: plugin.currency,
    });

    return {
      status: "success",
      pluginId: pluginId,
      method: method,
      payload: payload,
      result: {
        timestamp: new Date().toISOString(),
        execution_time_ms: Math.random() * 500,
        data: {
          message: `${method} operation completed successfully`,
          plugin: plugin.name,
        },
      },
    };
  }

  private async executeRealWrsClinicCall(plugin: any, method: keyof Adapter, payload: any): Promise<any> {
    const start = Date.now();
    try {
      let result;
      if (method === "connect") result = await wrsClinicAdapter.connect();
      else if (method === "read") result = await wrsClinicAdapter.read(payload);
      else if (method === "write") result = await wrsClinicAdapter.write(payload);
      else if (method === "health") result = await wrsClinicAdapter.health();
      else throw new Error(`Unknown adapter method: ${method}`);

      const healthy = method === "health" ? result.status === "healthy" : true;
      this.pluginRegistry.updatePluginStatus(plugin.id, healthy ? "online" : "degraded", healthy ? 100 : 0);

      return {
        status: "success",
        pluginId: plugin.id,
        method,
        payload,
        result: { timestamp: new Date().toISOString(), execution_time_ms: Date.now() - start, data: result },
      };
    } catch (err: any) {
      this.pluginRegistry.updatePluginStatus(plugin.id, "offline", 0);
      return {
        status: "error",
        pluginId: plugin.id,
        method,
        payload,
        error: err.message || "WRS Clinic Gateway unreachable",
      };
    }
  }

  getRuntimeHealth(): RuntimeHealth {
    // Aggregate health from various components
    const pluginHealth = this.pluginRegistry.getOverallHealth();
    // For now, we'll use the plugin health as the overall runtime health
    return {
      status: pluginHealth.status,
      health: pluginHealth.health,
      uptime: 99.65, // Placeholder
      totalRequests: 12847, // Placeholder
      totalErrors: 64, // Placeholder
    };
  }
}
