# World Runtime Semantic OS (WRS-OS) Workspace

Welcome to the official workspace for the **World Runtime Semantic OS (WRS-OS)**. This system represents a fundamental shift in healthcare architecture, moving beyond traditional data storage to a **State-Aware Belief System**.

## The Semantic Breakthrough

WRS-OS is built on three core architectural innovations:

1.  **Contradiction as Data**: We preserve the tension between competing hypotheses (e.g., Malaria AND Typhoid) using decay weights, mirroring real clinical reasoning.
2.  **Time as Load-Bearing Structure**: Native belief decay $B(t+1) = B(t) \cdot e^{-\lambda t}$ ensures that the system understands data staleness automatically.
3.  **Liquid Meaning**: Meaning is reconstructed at query time based on the current runtime state $S(t)$.
4.  **StudioOS Insight Graph (SIG)**: A live operational intelligence graph that transforms events into evolving semantic structures and actionable interventions.

## Repository Structure

-   **`/runtime`**: The core WRS-OS Semantic Runtime Demo (v6.0) and Interactive Visualization.
-   **`/adapters`**: Certified adapters (Monitoring, Partograph, OpenMRS, etc.) that feed the Semantic EventBus.
-   **`/scripts`**: Deployment, simulation, and automation scripts.

## Getting Started

### 1. Clone the Workspace
```bash
git clone https://github.com/lwrnckahiga88/bpu-t1-workspace.git
cd bpu-t1-workspace
```

### 2. Run the Semantic Demo
Open `runtime/index.html` to experience the **Semantic State Machine** in action, featuring the "Kenya Clinical Scenario" simulation.

### 3. Deploy
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## Documentation
See `DOCUMENTATION.md` for a deep dive into the Ontological Commitment and the Bayesian Update Engine.
