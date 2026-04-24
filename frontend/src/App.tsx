import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="flex h-screen bg-slate-950 font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
