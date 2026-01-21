const CONFIG = {
    targetPressure: 80, 
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
    startTime: Date.now(),
    
    triggerLeak: () => {
        sim.leakActive = true;
        log("⚠️ CRITICAL ALERT: PIPE RUPTURE DETECTED IN SECTOR 2", "warning");
        document.querySelector('.zone-2').style.borderColor = "#ef4444";
    },
    
    rainEvent: () => {
        log("🌧️ WEATHER UPDATE: HEAVY RAINFALL. RESERVOIR LEVELS RISING.", "info");
        document.querySelector('.wave').style.top = "10%"; // Rise level
        setTimeout(() => document.querySelector('.wave').style.top = "40%", 5000); // Drain back
    },
    
    stabilize: () => {
        sim.leakActive = false;
        sim.pressure = 50;
        document.querySelector('.zone-2').style.borderColor = "#0ea5e9";
        log("✅ SYSTEM STABILIZED. MAINTENANCE TEAM STANDING DOWN.", "success");
    }
};

// DOM Elements
const ui = {
    pressureVal: document.getElementById('pressure-val'),
    flowVal: document.getElementById('flow-val'),
    alertVal: document.getElementById('alert-val'),
    log: document.getElementById('console-log'),
    fullLog: document.getElementById('full-log'), // For logs view
    uptime: document.getElementById('uptime-counter'),
    clock: document.getElementById('world-clock'),
    pageTitle: document.getElementById('page-title'),
    
    // Toggles
    btnMain: document.getElementById('btn-pump-main'),
    btnAux: document.getElementById('btn-pump-aux'),
    btnValve: document.getElementById('btn-valve-emergency')
};

// NAVIGATION LOGIC
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view-section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all
        navItems.forEach(n => n.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));
        
        // Add active to clicked
        item.classList.add('active');
        const viewId = item.getAttribute('data-view');
        document.getElementById(`view-${viewId}`).classList.add('active');
        
        // Update Title
        ui.pageTitle.innerText = `MAIN_GRID // ${viewId.toUpperCase()}`;
    });
});

// LOGGER
function log(msg, type="info") {
    const time = new Date().toLocaleTimeString();
    const entry = `> [${time}] ${msg}`;
    
    const p = document.createElement('p');
    p.innerText = entry;
    if(type === 'warning') p.style.color = '#ef4444';
    if(type === 'success') p.style.color = '#10b981';
    
    // Separate instance for main log vs full log to avoid node moving
    ui.log.appendChild(p.cloneNode(true));
    ui.log.scrollTop = ui.log.scrollHeight;

    if(ui.fullLog) {
        ui.fullLog.appendChild(p.cloneNode(true));
        ui.fullLog.scrollTop = ui.fullLog.scrollHeight;
    }
}

// CHART SETUP
const ctx = document.getElementById('mainChart').getContext('2d');

// Gradient
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(14, 165, 233, 0.5)');   
gradient.addColorStop(1, 'rgba(14, 165, 233, 0.0)');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(20).fill(''),
        datasets: [{
            label: 'System Pressure',
            data: Array(20).fill(40),
            borderColor: '#0ea5e9',
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4, // Smooth curves
            pointRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { 
                min: 0, max: 120, 
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#64748b' }
            },
            x: { display: false }
        },
        animation: false // Performance
    }
});

// PHYSICS LOOP
function physicsTick() {
    // 1. Target Pressure Calculation
    let target = 20; 
    if (sim.pumps.main) target += 60;
    if (sim.pumps.aux) target += 30;
    
    // Inertia
    if (sim.pressure < target) sim.pressure += CONFIG.pumpSpoolRate;
    if (sim.pressure > target) sim.pressure -= CONFIG.pumpSpoolRate;
    
    // Leaks & Valve
    if (sim.leakActive) sim.pressure -= CONFIG.leakDecay;
    if (sim.emergencyValve) sim.pressure = Math.max(0, sim.pressure - 5);

    // Jitter
    sim.pressure += (Math.random() - 0.5) * 0.5;
    
    // Flow logic
    sim.flow = sim.pressure * 2.5 + (Math.random() * 5);
    
    updateUI();
}

function updateUI() {
    ui.pressureVal.innerText = sim.pressure.toFixed(1);
    ui.flowVal.innerText = sim.flow.toFixed(1);
    
    // Alerts
    let activeAlerts = 0;
    if (sim.leakActive) activeAlerts++;
    if (sim.pressure > 110) activeAlerts++;
    ui.alertVal.innerText = activeAlerts;
    
    // Chart Update
    const data = chart.data.datasets[0].data;
    data.shift();
    data.push(sim.pressure);
    chart.update();

    // Clock & Uptime
    ui.clock.innerText = new Date().toUTCString().split(' ')[4] + ' UTC';
    const elapsed = Math.floor((Date.now() - sim.startTime) / 1000);
    const h = Math.floor(elapsed / 3600).toString().padStart(2,'0');
    const m = Math.floor((elapsed % 3600) / 60).toString().padStart(2,'0');
    const s = (elapsed % 60).toString().padStart(2,'0');
    ui.uptime.innerText = `UPTIME: ${h}:${m}:${s}`;
}

// EVENT LISTENERS
ui.btnMain.addEventListener('change', (e) => {
    sim.pumps.main = e.target.checked;
    log(`PUMP-101 [MAIN] ${e.target.checked ? 'STARTED' : 'STOPPED'}`);
});
ui.btnAux.addEventListener('change', (e) => {
    sim.pumps.aux = e.target.checked;
    log(`PUMP-102 [AUX] ${e.target.checked ? 'STARTED' : 'STOPPED'}`);
});
ui.btnValve.addEventListener('change', (e) => {
    sim.emergencyValve = e.target.checked;
    log(`VALVE-EMERGENCY ${e.target.checked ? 'OPENED' : 'CLOSED'}`, e.target.checked ? 'warning' : 'info');
});

// START
setInterval(physicsTick, 100);
log("SYSTEM ONLINE. SENSORS ACTIVE.", "success");
