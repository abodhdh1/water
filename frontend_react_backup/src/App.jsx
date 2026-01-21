import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          SWMS
        </h1>
        <p className="text-slate-400 mt-2">Smart Water Management System</p>
      </header>
      
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors group">
          <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">Dashboard</h2>
          <p className="text-slate-500 text-sm">Real-time water usage analytics and monitoring.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-colors group">
          <h2 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">AI Insights</h2>
          <p className="text-slate-500 text-sm">Predictive models and anomaly detection.</p>
        </div>
      </main>

      <footer className="mt-12 text-slate-600 text-sm">
        <p>Waiting for backend connection...</p>
      </footer>
    </div>
  );
}

export default App;
