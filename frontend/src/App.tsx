import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Products from './components/Products';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Database from './components/Database';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products token={token} />;
      case 'customers':
        return <Customers token={token} />;
      case 'orders':
        return <Orders token={token} />;
      case 'database':
        return <Database token={token} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans selection:bg-indigo-500/30">
      <Sidebar activePage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
