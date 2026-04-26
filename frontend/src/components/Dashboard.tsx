
const Dashboard = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Overview</h2>
          <p className="text-slate-400 mt-1">Here's what's happening with your store today.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/20 active:scale-95">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', positive: true },
          { label: 'Active Users', value: '2,338', change: '+15.2%', positive: true },
          { label: 'Total Orders', value: '1,245', change: '+5.4%', positive: true },
          { label: 'API Requests', value: '89.2k', change: '-2.3%', positive: false },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className={`text-sm font-medium ${stat.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl">
           <h3 className="text-xl font-bold text-white mb-6">Revenue Analytics</h3>
           <div className="h-64 flex items-end gap-2">
             {[40, 70, 45, 90, 65, 85, 100, 60, 45, 75, 50, 80].map((height, i) => (
               <div key={i} className="flex-1 bg-slate-700 rounded-t-sm group relative cursor-pointer">
                 <div 
                   className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-500 group-hover:from-indigo-400 group-hover:to-indigo-300 shadow-lg shadow-indigo-500/20"
                   style={{ height: `${height}%` }}
                 ></div>
               </div>
             ))}
           </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer group border border-transparent hover:border-slate-600">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Order #{1000 + i}</p>
                    <p className="text-xs text-slate-400 mt-0.5">2 mins ago</p>
                  </div>
                </div>
                <span className="text-emerald-400 font-semibold text-sm bg-emerald-500/10 px-2 py-1 rounded-md">$129.00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
