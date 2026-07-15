# BPU-T1 WRS Clinic Adapter

Connects to a **live** WRS Clinic Gateway (Express + node:sqlite backend).

Unlike the other adapters in this folder, this one is not a stub — every
method makes a real HTTP call.

## Capabilities
- **Connect**: `GET /api/health` — confirms the Gateway is actually running.
- **Read**: `GET /api/{entity}` — e.g. `patients`, `pharmacy/medicines`, `reports/daily`.
- **Write**: `POST /api/sync/{entity}` — same contract the WRS Clinic PWA
  itself uses, so records created here go through the identical bin-card /
  sync-queue path as ones created on the clinic phone.
- **Health**: real round-trip latency against `/api/health`, not a random number.

## Configuration
Set `WRS_CLINIC_GATEWAY_URL` to point at the Gateway. Defaults to
`http://localhost:4000` (correct when both apps are colocated on the same
Termux device). If the WRS Clinic PWA is being reached from a different
device via a Cloudflare tunnel, use that tunnel's URL instead.

## Certification Status
- **Verified**: No — this is a real integration, not part of the
  World Runtime OS whitepaper/mock plugin set (SHA, M-Pesa, OpenMRS, Lab,
  Insurance, Identity in `pluginRegistry.ts` are all hardcoded demo data;
  `runtimeCore.executePluginMethod` simulates every call rather than
  invoking an adapter). This adapter is wired in as a real exception to
  that — see `src/core/runtimeCore.ts`.
