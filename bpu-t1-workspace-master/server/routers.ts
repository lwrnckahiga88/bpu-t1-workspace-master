import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { PluginRegistry } from "../src/core/pluginRegistry";
import { BillingEngine } from "../src/core/billingEngine";
import { FederationManager } from "../src/core/federationManager";
import { RuntimeCore } from "../src/core/runtimeCore";

// Initialize core modules
const pluginRegistry = new PluginRegistry();
const billingEngine = new BillingEngine();
const federationManager = new FederationManager();
const runtimeCore = new RuntimeCore(pluginRegistry, billingEngine);

export const appRouter = router({
  // System health (using runtimeCore)
  system: router({
    health: publicProcedure.query(() => {
      return runtimeCore.getRuntimeHealth();
    }),
  }),
  // Plugin Registry Procedures
  plugins: router({
    list: publicProcedure.query(() => pluginRegistry.listPlugins()),
    getById: publicProcedure.input(z.string()).query(({ input }) => {
      return pluginRegistry.getPluginById(input);
    }),
    // No direct health procedure here, as it's aggregated in runtimeCore
  }),
  // Plugin Executor Procedures
  executor: router({
    execute: publicProcedure
      .input(
        z.object({
          pluginId: z.string(),
          method: z.enum(["read", "write", "health", "connect"]),
          payload: z.any(),
        })
      )
      .mutation(async ({ input }) => {
        return runtimeCore.executePluginMethod(input.pluginId, input.method, input.payload);
      }),
  }),
  // Billing Ledger Procedures
  billing: router({
    transactions: publicProcedure.query(() => billingEngine.getTransactions()),
    summary: publicProcedure.query(() => billingEngine.getBillingSummary()),
  }),
  // Federation Manager Procedures
  federation: router({
    peers: publicProcedure.query(() => federationManager.listPeers()),
    broadcast: publicProcedure
      .input(z.object({ message: z.string() }))
      .mutation(async ({ input }) => {
        return federationManager.broadcastMessage(input.message);
      }),
  }),
});

export type AppRouter = typeof appRouter;
