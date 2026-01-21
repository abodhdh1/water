const CONFIG = {
    targetPressure: 80, // PSI
    maxPressure: 120,
    pumpSpoolRate: 0.5,
    leakDecay: 2.0
};

// Simulation State
const sim = {
    pressure: 40,
    flow: 100,
    pumps: { main: false, aux: false },
    emergencyValve: false,
    leakActive: false,
    
    // Actions
    triggerLeak: () => {
        sim.leakActive = true;
        log("⚠️ CRITICAL ALERT: PIPE RUPTURE DETECTED IN SECTOR 2");
        document.querySelector('.kpi-card:nth-child(3)').classList.add('animate-pulse'); // Add pulsing to alert card
    },
    
    rainEvent: () => {
        log("🌧️ WEATHER UPDATE: HEAVY RAINFALL. RESERVOIR LEVELS RISING.");
        // Logic to increase mock tank level (visual only)
    },
    
    stabilize: () => {
        sim.leakActive = false;
        sim.pressure = 50;
        log("✅ SYSTEM STABILIZED. MAINTENANCE TEAM STANDING DOWN.");
    }
};

// DOM Elements
const ui = {
    pressureVal: document.getElementById('pressure-val'),
    flowVal: document.getElementById('flow-val'),
    alertVal: document.getElementById('alert-val'),
    log: document.getElementById('console-log'),
    
    // Toggles
    btnMain: document.getElementById('btn-pump-main'),
    btnAux: document.getElementById('btn-pump-aux'),
    btnValve: document.getElementById('btn-valve-emergency')
};

// Logger
function log(msg) {
    const p = document.createElement('p');
    p.innerText = `> ${new Date().toLocaleTimeString()} ${msg}`;
    console.log(msg)
    ui.log.appendChild(p);
    ui.log.scrollTop = ui.log.scrollHeight;
}

// Chart.js Setup
const ctx = document.getElementById('mainChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(20).fill(''),
        datasets: [{
            label: 'System Pressure (PSI)',
            data: Array(20).fill(40),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { min: 0, max: 120, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { display: false }
        },
        animation: { duration: 0 } 
    }
});

// Physics Loop
function physicsTick() {
    // 1. Calculate Target based on Pumps
    let target = 20; // Base static pressure
    if (sim.pumps.main) target += 60;
    if (sim.pumps.aux) target += 30;
    
    // 2. Apply Spool Up/Down (Inertia)
    if (sim.pressure < target) sim.pressure += CONFIG.pumpSpoolRate;
    if (sim.pressure > target) sim.pressure -= CONFIG.pumpSpoolRate;
    
    // 3. Apply Leaks
    if (sim.leakActive) sim.pressure -= CONFIG.leakDecay;
    if (sim.emergencyValve) sim.pressure = Math.max(0, sim.pressure - 5); // DUMP valve

    // 4. Noise/Jitter
    sim.pressure += (Math.random() - 0.5) * 0.5;
    
    // 5. Flow follows pressure roughly
    sim.flow = sim.pressure * 2.5 + (Math.random() * 5);
    
    updateUI();
}

function updateUI() {
    ui.pressureVal.innerText = sim.pressure.toFixed(1);
    ui.flowVal.innerText = sim.flow.toFixed(1);
    
    // Update Alerts
    const alerts = [];
    if (sim.leakActive) alerts.push("LEAK");
    if (sim.pressure > 110) alerts.push("OVER-PRESSURE");
    if (sim.pressure < 10 && sim.pumps.main) alerts.push("CAVITATION");
    
    ui.alertVal.innerText = alerts.length;
    
    // Update Chart
    const data = chart.data.datasets[0].data;
    data.shift();
    data.push(sim.pressure);
    chart.update();
}

// Event Listeners
ui.btnMain.addEventListener('change', (e) => {
    sim.pumps.main = e.target.checked;
    log(`PUMP-101 STATE CHANGED: ${e.target.checked ? 'STARTED' : 'STOPPED'}`);
});

ui.btnAux.addEventListener('change', (e) => {
    sim.pumps.aux = e.target.checked;
    log(`PUMP-102 STATE CHANGED: ${e.target.checked ? 'STARTED' : 'STOPPED'}`);
});

ui.btnValve.addEventListener('change', (e) => {
    sim.emergencyValve = e.target.checked;
    if(e.target.checked) log("⚠️ EMERGENCY DUMP VALVE OPENED");
    else log("VALVE CLOSED");
});

// Start Simulation
setInterval(physicsTick, 100); // 10Hz physics
log("System ready. All sensors online.");
