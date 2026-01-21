const API_URL = "http://localhost:8000";

// DOM Elements
const els = {
    flowValue: document.getElementById('flow-value'),
    qualityValue: document.getElementById('quality-value'),
    alertCount: document.getElementById('alert-count'),
    readingsContainer: document.getElementById('readings-container'),
    alertsContainer: document.getElementById('alerts-container'),
    statusDot: document.querySelector('.dot'),
    statusText: document.getElementById('connection-status')
};

// State
let isOnline = false;

// Helpers
const updateStatus = (online) => {
    isOnline = online;
    if (online) {
        els.statusDot.classList.add('online');
        els.statusText.textContent = "System Online";
    } else {
        els.statusDot.classList.remove('online');
        els.statusText.textContent = "Offline / Mock Mode";
    }
};

const renderReadings = (readings) => {
    els.readingsContainer.innerHTML = '';
    readings.slice(0, 5).forEach(r => {
        const div = document.createElement('div');
        div.className = 'reading-item';
        div.innerHTML = `
            <span class="reading-time">${new Date(r.timestamp || Date.now()).toLocaleTimeString()}</span>
            <span class="reading-val">${r.value} <small>${r.unit || 'L/min'}</small></span>
        `;
        els.readingsContainer.appendChild(div);
    });
    
    // Update main stat if available
    if(readings.length > 0) {
        els.flowValue.textContent = readings[0].value;
    }
};

const renderAlerts = (alerts) => {
    els.alertsContainer.innerHTML = '';
    if (alerts.length === 0) {
        els.alertsContainer.innerHTML = '<div style="text-align:center; color: #94a3b8; padding: 1rem;">No active alerts</div>';
        els.alertCount.textContent = '0';
        return;
    }
    
    els.alertCount.textContent = alerts.length;
    
    alerts.forEach(a => {
        const div = document.createElement('div');
        div.className = `alert-item ${a.severity}`;
        div.innerHTML = `
            <strong>${a.severity.toUpperCase()}</strong>: ${a.message}
        `;
        els.alertsContainer.appendChild(div);
    });
};

// Mock Data Generator
const generateMockData = () => {
    const baseFlow = 45;
    const variation = (Math.random() * 4) - 2;
    const flow = (baseFlow + variation).toFixed(1);
    
    return {
        readings: [
            { id: 1, value: flow, unit: 'L/min', timestamp: new Date() },
            { id: 2, value: 44.2, unit: 'L/min', timestamp: new Date(Date.now() - 60000) }
        ],
        alerts: Math.random() > 0.8 ? [{ severity: 'warning', message: 'Pressure fluctuation detected' }] : []
    };
};

// Main Loop
const fetchData = async () => {
    try {
        // Try fetching sensor 1 (Flow)
        const res = await fetch(`${API_URL}/sensors/1/readings/?limit=5`);
        if (!res.ok) throw new Error('API Error');
        
        const readings = await res.json();
        updateStatus(true);
        renderReadings(readings);
        
        // Fetch Alerts (Mocked for now as API might be empty)
        renderAlerts([]);
        
    } catch (err) {
        // Fallback to Mock Data
        updateStatus(false);
        const data = generateMockData();
        renderReadings(data.readings);
        renderAlerts(data.alerts);
        els.qualityValue.textContent = "7.2"; 
    }
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    fetchData(); // Initial call
    setInterval(fetchData, 3000); // Poll every 3s
});
