import React, { useState, useEffect } from 'react';

interface DatabaseProps {
  token: string;
}

const Database: React.FC<DatabaseProps> = ({ token }) => {
  const [data, setData] = useState<any>({
    products: [],
    customers: [],
    orders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [prodRes, custRes, ordRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/products', { headers }),
        fetch('http://localhost:8080/api/v1/customers', { headers }),
        fetch('http://localhost:8080/api/v1/orders', { headers })
      ]);

      if (!prodRes.ok || !custRes.ok || !ordRes.ok) {
        throw new Error('Failed to fetch database records');
      }

      const products = await prodRes.json();
      const customers = await custRes.json();
      const orders = await ordRes.json();

      setData({ products, customers, orders });
      setLastRefreshed(new Date());
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 3 seconds for "real-time" feel
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const renderTable = (title: string, items: any[]) => {
    if (items.length === 0) {
      return (
        <div className="mt-6 mb-12 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center text-slate-500">
          No records in {title} table.
        </div>
      );
    }

    // Extract headers dynamically from the first object
    const headers = Object.keys(items[0]).filter(key => key !== 'imageUrl');

    return (
      <div className="mt-6 mb-12">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          Table: {title}
          <span className="ml-3 text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
            {items.length} rows
          </span>
        </h3>
        <div className="overflow-x-auto bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl">
          <table className="w-full text-left font-mono text-sm whitespace-nowrap">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                {headers.map(header => (
                  <th key={header} className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {items.map((item, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  {headers.map(header => {
                    let val = item[header];
                    if (typeof val === 'object' && val !== null) {
                      val = JSON.stringify(val);
                    }
                    return (
                      <td key={header} className="px-6 py-3 max-w-[200px] truncate" title={String(val)}>
                        {String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Real-Time Database View</h2>
          <p className="text-slate-400 mt-1">Live streaming of all active tenant records.</p>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          {loading && <span className="text-indigo-400 flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Syncing...</span>}
          <span className="text-slate-500 font-mono">Last synced: {lastRefreshed.toLocaleTimeString()}</span>
        </div>
      </div>

      {error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-center">
          <p>{error}</p>
        </div>
      ) : (
        <div>
          {renderTable('Products', data.products)}
          {renderTable('Customers', data.customers)}
          {renderTable('Orders', data.orders)}
        </div>
      )}
    </div>
  );
};

export default Database;
