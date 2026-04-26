import React, { useState, useEffect } from 'react';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
}

interface Order {
  id: string;
  customer: Customer;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface OrdersProps {
  token: string;
}

const Orders: React.FC<OrdersProps> = ({ token }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ customerId: '', totalAmount: 0, status: 'PENDING' });
  const [adding, setAdding] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, [token]);

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customerId) {
      setError('Please select a customer');
      return;
    }
    setAdding(true);
    try {
      const payload = {
        customer: { id: newOrder.customerId },
        totalAmount: newOrder.totalAmount,
        status: newOrder.status
      };
      
      const response = await fetch('http://localhost:8080/api/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to create order');
      setShowAddModal(false);
      setNewOrder({ customerId: '', totalAmount: 0, status: 'PENDING' });
      fetchOrders();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PENDING': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'PROCESSING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'CANCELLED': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Orders</h2>
          <p className="text-slate-400 mt-1">Manage and track customer orders.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          Create Order
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-xl font-bold text-white">Create New Order</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAddOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Customer</label>
                <select 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={newOrder.customerId} 
                  onChange={e => setNewOrder({...newOrder, customerId: e.target.value})}
                >
                  <option value="" disabled>Select a customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Total Amount ($)</label>
                  <input required type="number" step="0.01" min="0" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={newOrder.totalAmount} onChange={e => setNewOrder({...newOrder, totalAmount: parseFloat(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={newOrder.status} 
                    onChange={e => setNewOrder({...newOrder, status: e.target.value})}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" disabled={adding} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                  {adding ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-center">
          <p>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-12 rounded-2xl text-center shadow-xl">
          <div className="w-16 h-16 bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white">No orders found</h3>
          <p className="text-slate-400 mt-2">Start creating orders when customers make a purchase.</p>
          <button onClick={() => setShowAddModal(true)} className="mt-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
            Create New Order
          </button>
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 font-medium text-sm">Order ID</th>
                <th className="px-6 py-4 font-medium text-sm">Customer</th>
                <th className="px-6 py-4 font-medium text-sm">Date</th>
                <th className="px-6 py-4 font-medium text-sm">Status</th>
                <th className="px-6 py-4 font-medium text-sm text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-slate-300 font-mono text-sm">{order.id.split('-')[0].toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{order.customer?.firstName} {order.customer?.lastName}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-white font-medium">
                    ${order.totalAmount?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
