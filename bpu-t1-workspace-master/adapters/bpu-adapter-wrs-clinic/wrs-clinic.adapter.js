/**
 * BPU-T1 WRS Clinic Adapter
 * Version: 1.0.0
 * Certification: NOT part of the World Runtime OS mock/whitepaper set.
 *
 * Every other adapter in this folder (openmrs, ble, mobilesync, analytics,
 * audit, orders, partograph) is a stub: console.log + a hardcoded success
 * object, never actually called by runtimeCore.executePluginMethod (which
 * itself just simulates a delay and returns Math.random() timings — see
 * src/core/runtimeCore.ts). This one is real: connect/read/write/health all
 * make genuine HTTP calls to a running WRS Clinic Gateway (the Express +
 * node:sqlite backend in wrs-project/backend).
 *
 * Configure the target with WRS_CLINIC_GATEWAY_URL (defaults to the
 * colocated Termux backend at localhost:4000). If the WRS Clinic PWA is
 * being accessed through a Cloudflare tunnel from a different device than
 * the Gateway itself, point this at that tunnel URL instead.
 */

const BASE_URL = (process.env.WRS_CLINIC_GATEWAY_URL || 'http://localhost:4000').replace(/\/+$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error || `WRS Clinic Gateway responded ${res.status} for ${path}`);
  }
  return body;
}

export const wrsClinicAdapter = {
  id: 'adapter-wrs-clinic',
  type: 'wrs-clinic',

  async connect() {
    const health = await request('/api/health');
    return { success: health.status === 'ok', gateway: health.gateway, timestamp: Date.now() };
  },

  // query.entity selects which WRS Clinic module to read from:
  // 'patients' | 'appointments' | 'pharmacy/medicines' | 'reports/daily' | 'marketplace'
  async read(query = {}) {
    const entity = query.entity || 'patients';
    const data = await request(`/api/${entity}`);
    return { data, status: 'ok' };
  },

  // payload = { entity, op: 'create', data: {...} } — routed through the
  // same /api/sync/:entity contract the WRS Clinic PWA itself uses, so a
  // record created via BPU-T1 lands in the identical bin-card / sync-queue
  // machinery as one created on the clinic phone.
  async write(payload = {}) {
    const { entity, data } = payload;
    if (!entity) throw new Error('write() requires payload.entity');
    const result = await request(`/api/sync/${entity}`, {
      method: 'POST',
      body: JSON.stringify({ op: 'create', payload: data })
    });
    return { success: true, eventId: result.id ?? result.movementId ?? null, result };
  },

  async health() {
    const start = Date.now();
    try {
      await request('/api/health');
      return { status: 'healthy', latency: `${Date.now() - start}ms` };
    } catch (err) {
      return { status: 'unreachable', latency: `${Date.now() - start}ms`, error: err.message };
    }
  }
};
