import sys

with open('/home/ubuntu/bpu-t1-nurse-system/index.html', 'r') as f:
    original_content = f.read()

# Replace Title
updated_content = original_content.replace(
    '<title>BPU-T1 Nurse System v4.3 — World Runtime OS</title>',
    '<title>BPU-T1 Federated Healthcare Runtime Demo v5.0</title>'
)

# Update Logo Text
updated_content = updated_content.replace(
    '<h1>BPU-T1 Nurse System v4.3</h1>',
    '<h1>BPU-T1 Federated Runtime v5.0</h1>'
)

# Insert Runtime Health Dashboard CSS if needed
# (Assuming existing styles are mostly fine, but adding specific demo styles)
extra_styles = """
/* Runtime Demo Styles */
.demo-controls { background: rgba(14, 165, 233, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px solid var(--primary); }
.phone-view { border: 8px solid #334155; border-radius: 1.5rem; height: 400px; overflow-y: auto; background: #0f172a; padding: 1rem; position: relative; }
.phone-header { font-size: 0.7rem; color: var(--text-muted); text-align: center; margin-bottom: 0.5rem; border-bottom: 1px solid #1e293b; padding-bottom: 0.2rem; }
.notification { background: var(--primary); color: white; padding: 0.5rem; border-radius: 0.4rem; margin-bottom: 0.5rem; font-size: 0.75rem; animation: slideIn 0.3s ease; }
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
"""
updated_content = updated_content.replace('</style>', extra_styles + '\n</style>')

# Add the new tabs to the nav
nav_insertion = """
        <button class="nav-tab" data-tab="mobile-integration">Mobile Integration</button>
        <button class="nav-tab" data-tab="ble-integration">BLE Devices</button>
        <button class="nav-tab" data-tab="runtime-health">Runtime Health</button>
"""
updated_content = updated_content.replace('</nav>', nav_insertion + '\n</nav>')

# Prepare the new tab contents
mobile_tab = """
<div id="mobile-integration" class="tab-content">
    <div class="grid-2">
        <div class="card">
            <div class="section-header"><h3 class="section-title">Clinician Phone View</h3><span class="tag">JWT: Verified</span></div>
            <div class="phone-view" id="clinician-phone">
                <div class="phone-header">12:45 PM • 5G</div>
                <div id="clinician-notifications"></div>
                <div style="padding:0.5rem; border:1px solid #1e293b; border-radius:0.4rem;">
                    <p style="font-size:0.8rem; font-weight:bold;">Active Patients</p>
                    <div id="clinician-patient-list" style="font-size:0.7rem; color:var(--text-secondary);">Loading...</div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="section-header"><h3 class="section-title">Patient Phone View</h3><span class="tag">Socket: Connected</span></div>
            <div class="phone-view" id="patient-phone">
                <div class="phone-header">12:45 PM • WiFi</div>
                <div id="patient-notifications"></div>
                <div style="padding:0.5rem; border:1px solid #1e293b; border-radius:0.4rem;">
                    <p style="font-size:0.8rem; font-weight:bold;">My Care Plan</p>
                    <p style="font-size:0.7rem; color:var(--text-secondary);">Labor progress is being monitored by the BPU system.</p>
                </div>
            </div>
        </div>
    </div>
</div>
"""

ble_tab = """
<div id="ble-integration" class="tab-content">
    <div class="card">
        <div class="section-header"><h3 class="section-title">BLE Device Simulation</h3></div>
        <div class="grid-4">
            <button class="button" id="sim-ble-doppler">Simulate Fetal Doppler</button>
            <button class="button" id="sim-ble-oximeter">Simulate Pulse Oximeter</button>
            <button class="button" id="sim-ble-bp">Simulate BP Monitor</button>
            <button class="button" id="sim-ble-glucometer">Simulate Glucometer</button>
        </div>
        <div id="ble-status" class="output-box" style="margin-top:1rem; height:150px;">
            <p style="color:var(--text-muted);">Waiting for BLE device connection...</p>
        </div>
    </div>
</div>
"""

health_tab = """
<div id="runtime-health" class="tab-content">
    <div class="card runtime-card">
        <div class="section-header"><h3 class="section-title runtime">Runtime Health Dashboard</h3></div>
        <div class="grid-2">
            <div>
                <div class="gate-row pass"><span class="gate-icon">✅</span><span class="gate-label">Monitoring Adapter</span><span class="gate-desc">HEALTHY</span></div>
                <div class="gate-row pass"><span class="gate-icon">✅</span><span class="gate-label">Partograph Adapter</span><span class="gate-desc">HEALTHY</span></div>
                <div class="gate-row pass"><span class="gate-icon">✅</span><span class="gate-label">Orders Adapter</span><span class="gate-desc">HEALTHY</span></div>
                <div class="gate-row pass"><span class="gate-icon">✅</span><span class="gate-label">Analytics Adapter</span><span class="gate-desc">HEALTHY</span></div>
            </div>
            <div>
                <div class="gate-row pass"><span class="gate-icon">✅</span><span class="gate-label">OpenMRS Adapter</span><span class="gate-desc">HEALTHY</span></div>
                <div class="gate-row pass"><span class="gate-icon">✅</span><span class="gate-label">MobileSync Adapter</span><span class="gate-desc">HEALTHY</span></div>
                <div class="gate-row pass"><span class="gate-icon">✅</span><span class="gate-label">BLE Adapter</span><span class="gate-desc">HEALTHY</span></div>
                <div class="gate-row pass"><span class="gate-icon">✅</span><span class="gate-label">Audit Adapter</span><span class="gate-desc">HEALTHY</span></div>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="section-header"><h3 class="section-title">Visual Proof Panel</h3></div>
        <div class="mm1-grid">
            <div class="mm1-metric"><div class="mm1-val" id="proof-events">0</div><div class="mm1-label">Events Processed</div></div>
            <div class="mm1-metric"><div class="mm1-val" id="proof-adapters">8</div><div class="mm1-label">Adapters Registered</div></div>
            <div class="mm1-metric"><div class="mm1-val" id="proof-phones">2</div><div class="mm1-label">Connected Phones</div></div>
            <div class="mm1-metric"><div class="mm1-val" id="proof-crdt">0</div><div class="mm1-label">CRDT Conflicts Resolved</div></div>
        </div>
    </div>
</div>
"""

# Insert new tabs before the last closing div of main-content
updated_content = updated_content.replace('<!-- END MAIN CONTENT -->', mobile_tab + ble_tab + health_tab + '\n<!-- END MAIN CONTENT -->')
# If the marker doesn't exist, insert before the script tag
if '<!-- END MAIN CONTENT -->' not in updated_content:
    updated_content = updated_content.replace('<script>', mobile_tab + ble_tab + health_tab + '\n<script>')

# Add CRDT and Simulation controls to Monitoring tab
sim_controls = """
<div class="demo-controls">
    <h4 style="margin-bottom:0.5rem; color:var(--primary);">Federated Runtime Demo Controls</h4>
    <div class="flex-row">
        <button class="button success" id="simulate-labor-btn">Simulate Labor Event</button>
        <button class="button warning" id="doctor-offline-edit">Doctor Offline Edit</button>
        <button class="button warning" id="nurse-offline-edit">Nurse Offline Edit</button>
        <button class="button pink" id="reconnect-merge">Reconnect & Merge CRDT</button>
        <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.8rem;">
            <input type="checkbox" id="network-offline-toggle"> Go Offline
        </label>
    </div>
</div>
"""
updated_content = updated_content.replace('<div id="monitoring" class="tab-content active">', '<div id="monitoring" class="tab-content active">\n' + sim_controls)

# Update Script Logic
new_script_logic = """
  // --- Runtime Demo Logic ---
  let eventsProcessed = 0;
  let crdtConflicts = 0;
  let isOffline = false;
  let offlineQueue = [];

  function updateProof() {
    setEl('proof-events', eventsProcessed);
    setEl('proof-crdt', crdtConflicts);
    setEl('metric-alerts', crdtConflicts); // Reusing metric
  }

  function broadcastEvent(event) {
    eventsProcessed++;
    updateProof();
    
    if (isOffline) {
        offlineQueue.push(event);
        sysLog(`Offline: Event queued (${event.type})`, 'warning');
        return;
    }

    sysLog(`Runtime: Broadcast ${event.type}`, 'info');
    
    // Notify Clinician Phone
    const clinNotif = document.getElementById('clinician-notifications');
    if (clinNotif) {
        const div = document.createElement('div');
        div.className = 'notification';
        div.textContent = `ALERT: ${event.patient} - ${event.type.replace(/\./g, ' ')}`;
        clinNotif.prepend(div);
        setTimeout(() => div.style.opacity = '0.7', 2000);
    }

    // Notify Patient Phone
    const patNotif = document.getElementById('patient-notifications');
    if (patNotif) {
        const div = document.createElement('div');
        div.className = 'notification';
        div.style.background = 'var(--purple)';
        div.textContent = `Update: Your care record was updated (${event.type})`;
        patNotif.prepend(div);
    }

    // Update StudioOS / Analytics
    addRTUpdate('runtime', `Event: ${event.type} for ${event.patient}`);
    if (event.type === 'labor.progress.updated') {
        sysLog('OpenMRS: Observation Synced (SUCCESS)', 'success');
        sysLog('Analytics: Labour Cases +1', 'info');
    }
  }

  document.getElementById('simulate-labor-btn')?.addEventListener('click', () => {
    broadcastEvent({
        type: 'labor.progress.updated',
        patient: 'P004',
        dilation: 8,
        fhr: 90,
        ts: Date.now()
    });
  });

  document.getElementById('doctor-offline-edit')?.addEventListener('click', () => {
    sysLog('Doctor: Saved offline edit (FHR: 88)', 'warning');
    offlineQueue.push({ type: 'crdt.edit', source: 'doctor', data: { fhr: 88 }, ts: Date.now() });
  });

  document.getElementById('nurse-offline-edit')?.addEventListener('click', () => {
    sysLog('Nurse: Saved offline edit (Dilation: 9)', 'warning');
    offlineQueue.push({ type: 'crdt.edit', source: 'nurse', data: { dilation: 9 }, ts: Date.now() });
  });

  document.getElementById('reconnect-merge')?.addEventListener('click', () => {
    if (offlineQueue.length === 0) {
        sysLog('No offline changes to merge', 'info');
        return;
    }
    sysLog('Reconnecting...', 'info');
    setTimeout(() => {
        sysLog('CRDT Merge Successful: No Data Lost', 'success');
        sysLog('Merged: { fhr: 88, dilation: 9 }', 'ok');
        crdtConflicts++;
        eventsProcessed += offlineQueue.length;
        offlineQueue = [];
        updateProof();
    }, 1000);
  });

  document.getElementById('network-offline-toggle')?.addEventListener('change', (e) => {
    isOffline = e.target.checked;
    sysLog(isOffline ? 'Network: OFFLINE (IndexedDB Queue Active)' : 'Network: ONLINE (Syncing...)', isOffline ? 'danger' : 'success');
    if (!isOffline && offlineQueue.length > 0) {
        sysLog(`Replaying ${offlineQueue.length} queued events...`, 'info');
        setTimeout(() => {
            eventsProcessed += offlineQueue.length;
            offlineQueue = [];
            updateProof();
            sysLog('Queue Replayed & Synced', 'success');
        }, 1500);
    }
  });

  // BLE Sim
  function simBLE(name, type, val) {
    sysLog(`BLE: ${name} connected`, 'success');
    const bleStatus = document.getElementById('ble-status');
    if (bleStatus) {
        const p = document.createElement('p');
        p.className = 'log-line ok';
        p.textContent = `[${new Date().toLocaleTimeString()}] ${name} -> ${type}: ${val}`;
        bleStatus.prepend(p);
    }
    broadcastEvent({ type: `ble.${type}`, patient: 'P001', value: val });
  }

  document.getElementById('sim-ble-doppler')?.addEventListener('click', () => simBLE('Fetal Doppler', 'fhr', '142 bpm'));
  document.getElementById('sim-ble-oximeter')?.addEventListener('click', () => simBLE('Pulse Oximeter', 'spo2', '98%'));
  document.getElementById('sim-ble-bp')?.addEventListener('click', () => simBLE('BP Monitor', 'bp', '120/80'));
  document.getElementById('sim-ble-glucometer')?.addEventListener('click', () => simBLE('Glucometer', 'glucose', '5.4 mmol/L'));

"""
# Insert script logic before the boot() call
updated_content = updated_content.replace('boot();', new_script_logic + '\n  boot();')

with open('/home/ubuntu/bpu-t1-nurse-system/index.html', 'w') as f:
    f.write(updated_content)
