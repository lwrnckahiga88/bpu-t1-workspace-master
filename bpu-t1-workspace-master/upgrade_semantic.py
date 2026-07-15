import sys

with open('/home/ubuntu/bpu-t1-workspace/runtime/index.html', 'r') as f:
    content = f.read()

# Update Title and Logo
content = content.replace(
    '<title>BPU-T1 Federated Healthcare Runtime Demo v5.0</title>',
    '<title>World Runtime Semantic OS (WRS-OS) Demo v6.0</title>'
)
content = content.replace(
    '<h1>BPU-T1 Federated Runtime v5.0</h1>',
    '<h1>World Runtime Semantic OS v6.0</h1>'
)

# Add Semantic Tab to Nav
semantic_nav = '<button class="nav-tab" data-tab="semantic-os">Semantic State Machine</button>'
content = content.replace('</nav>', semantic_nav + '\n</nav>')

# Prepare Semantic OS Tab Content
semantic_tab = """
<div id="semantic-os" class="tab-content">
    <div class="grid-2">
        <div class="card">
            <div class="section-header"><h3 class="section-title">Belief Confidence (Bayesian)</h3></div>
            <div style="height: 250px;"><canvas id="beliefDistributionChart"></canvas></div>
            <div class="demo-controls" style="margin-top:1rem;">
                <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:0.5rem;">Preserving tension between hypotheses (Contradiction as Data)</p>
                <div class="flex-row">
                    <button class="button success" id="trigger-fever-event">Trigger 'Fever' Event</button>
                    <button class="button danger" id="trigger-negative-lab">Trigger Negative Lab</button>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="section-header"><h3 class="section-title">Temporal Decay Function</h3></div>
            <div style="height: 250px;"><canvas id="beliefDecayChart"></canvas></div>
            <div class="demo-controls" style="margin-top:1rem;">
                <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:0.5rem;">Native theory of staleness: B(t+1) = B(t) * e^(-λt)</p>
                <button class="button secondary" id="simulate-time-passage">Simulate +24h Passage</button>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="section-header"><h3 class="section-title">Meaning Reconstruction Engine</h3></div>
        <div class="grid-2">
            <div class="output-box" id="semantic-state-log" style="height:150px;">
                <p style="color:var(--text-muted);">Waiting for semantic events...</p>
            </div>
            <div class="output-box" id="meaning-context-view" style="height:150px;">
                <p style="color:var(--text-muted);">Context-aware meaning will appear here.</p>
            </div>
        </div>
    </div>
</div>
"""
content = content.replace('<!-- END MAIN CONTENT -->', semantic_tab + '\n<!-- END MAIN CONTENT -->')

# Add Semantic Logic
semantic_logic = """
  // --- Semantic OS Logic ---
  let beliefData = [0.33, 0.33, 0.34]; // Malaria, Typhoid, Other
  let decayDays = [0, 1, 2, 3, 4, 5, 6];
  let decayValues = [1, 0.74, 0.55, 0.41, 0.30, 0.22, 0.16];
  let currentDay = 0;

  function initSemanticCharts() {
    const beliefCtx = document.getElementById('beliefDistributionChart')?.getContext('2d');
    if (beliefCtx) {
        window.beliefChart = new Chart(beliefCtx, {
            type: 'bar',
            data: {
                labels: ['Malaria', 'Typhoid', 'Other'],
                datasets: [{
                    label: 'Confidence',
                    data: beliefData,
                    backgroundColor: ['#0ea5e9', '#8b5cf6', '#64748b']
                }]
            },
            options: { maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 1 } } }
        });
    }

    const decayCtx = document.getElementById('beliefDecayChart')?.getContext('2d');
    if (decayCtx) {
        window.decayChart = new Chart(decayCtx, {
            type: 'line',
            data: {
                labels: decayDays,
                datasets: [{
                    label: 'Authority',
                    data: decayValues,
                    borderColor: '#22c55e',
                    fill: false
                }]
            },
            options: { maintainAspectRatio: false }
        });
    }
  }

  function semanticLog(msg, color = 'var(--runtime)') {
    const log = document.getElementById('semantic-state-log');
    if (log) {
        const div = document.createElement('div');
        div.style.color = color;
        div.style.fontSize = '0.75rem';
        div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        log.prepend(div);
    }
  }

  function updateMeaning(term, context) {
    const view = document.getElementById('meaning-context-view');
    if (view) {
        view.innerHTML = `
            <p style="font-weight:bold; color:var(--primary);">Term: "${term}"</p>
            <p style="font-size:0.75rem; color:var(--text-secondary);">Reconstructed Meaning: ${context}</p>
            <p style="font-size:0.65rem; color:var(--text-muted);">State S(t) neighborhood active.</p>
        `;
    }
  }

  document.getElementById('trigger-fever-event')?.addEventListener('click', () => {
    semanticLog("Event: Patient P004 states 'Severe Fever'", 'var(--primary)');
    beliefData = [0.45, 0.45, 0.10];
    window.beliefChart.data.datasets[0].data = beliefData;
    window.beliefChart.update();
    updateMeaning("Fever", "High-priority clinical hypothesis. Context: Active distribution between Malaria/Typhoid.");
    broadcastEvent({ type: 'semantic.belief.updated', patient: 'P004', distribution: beliefData });
  });

  document.getElementById('trigger-negative-lab')?.addEventListener('click', () => {
    semanticLog("Event: HL7 Lab Result -> Parasites NOT DETECTED", 'var(--danger)');
    beliefData = [0.10, 0.80, 0.10];
    window.beliefChart.data.datasets[0].data = beliefData;
    window.beliefChart.update();
    updateMeaning("Fever", "Shifted meaning. Context: Parasites absent. Typhoid probability dominant in current state S(t).");
    broadcastEvent({ type: 'semantic.belief.updated', patient: 'P004', distribution: beliefData });
  });

  document.getElementById('simulate-time-passage')?.addEventListener('click', () => {
    currentDay++;
    semanticLog(`Time Passage: +24h. Applying decay B(t+${currentDay})`, 'var(--warning)');
    beliefData = beliefData.map(v => v * 0.74);
    window.beliefChart.data.datasets[0].data = beliefData;
    window.beliefChart.update();
    updateMeaning("Current State", `Stale data detected. Authority decayed to ${(Math.pow(0.74, currentDay)*100).toFixed(1)}%.`);
  });
"""
content = content.replace('boot();', 'initSemanticCharts();\n  ' + semantic_logic + '\n  boot();')

with open('/home/ubuntu/bpu-t1-workspace/runtime/index.html', 'w') as f:
    f.write(content)
