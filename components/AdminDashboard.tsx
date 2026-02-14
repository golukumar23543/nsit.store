import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PRODUCTS } from '../constants';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = useMemo(() => {
    const totalOrders = PRODUCTS.reduce((acc, p) => acc + p.orderCount, 0);
    const avgRating = (PRODUCTS.reduce((acc, p) => acc + p.rating, 0) / PRODUCTS.length).toFixed(1);
    const totalRevenue = PRODUCTS.reduce((acc, p) => acc + (p.price * p.orderCount), 0);
    
    return {
      totalProducts: PRODUCTS.length,
      avgRating: `${avgRating} ★`,
      totalOrders,
      totalRevenue: totalRevenue.toLocaleString('en-IN'),
      confirmed: Math.floor(totalOrders * 0.45),
      pending: Math.floor(totalOrders * 0.15),
      delivered: Math.floor(totalOrders * 0.40),
    };
  }, []);

  const chartData = [
    { name: 'Confirmed', value: stats.confirmed, color: '#3b82f6' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Delivered', value: stats.delivered, color: '#10b981' },
  ];

  const salesHistory = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 700 },
    { name: 'Wed', sales: 500 },
    { name: 'Thu', sales: 900 },
    { name: 'Fri', sales: 1200 },
    { name: 'Sat', sales: 1500 },
    { name: 'Sun', sales: 1300 },
  ];

  const recentOrders = [
    { id: '#1284', customer: 'Golu Kumar', status: 'Delivered', amount: '₹14,999' },
    { id: '#1285', customer: 'Anjali Sharma', status: 'Pending', amount: '₹2,499' },
    { id: '#1286', customer: 'Rahul Verma', status: 'Confirmed', amount: '₹5,999' },
    { id: '#1287', customer: 'Sita Ram', status: 'Delivered', amount: '₹899' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center sm:p-4">
      <div 
        className="absolute inset-0 bg-brand-navy/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative w-full h-full max-w-5xl sm:h-[90vh] bg-white sm:rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex">
        {/* Sidebar - Desktop and Mobile version */}
        <div className={`
          absolute sm:relative inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white p-6 flex flex-col transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        `}>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-terracotta rounded-lg flex items-center justify-center font-bold text-sm text-white">NS</div>
              <span className="font-bold tracking-tight text-xl">NSIP Admin</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="sm:hidden text-slate-400 hover:text-white">
               <i className="fas fa-times"></i>
            </button>
          </div>
          
          <nav className="space-y-2 flex-grow">
            {[
              { id: 'overview', icon: 'fa-chart-pie', label: 'Overview' },
              { id: 'orders', icon: 'fa-shopping-cart', label: 'Orders' },
              { id: 'inventory', icon: 'fa-box', label: 'Inventory' },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-brand-navyLight text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <i className={`fas ${tab.icon} text-sm`}></i>
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            ))}
          </nav>

          <button onClick={onClose} className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-sign-out-alt"></i>
            <span className="text-sm font-semibold">Exit Panel</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col overflow-hidden bg-slate-50 w-full">
          <header className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="sm:hidden w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg text-slate-600">
                <i className="fas fa-bars"></i>
              </button>
              <div>
                <h2 className="text-lg md:text-2xl font-bold text-slate-900 capitalize leading-tight">{activeTab}</h2>
                <p className="text-slate-500 text-[10px] md:text-sm hidden xs:block">Secure Administrator Terminal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative hidden xs:block">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <i className="fas fa-bell"></i>
                </div>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-terracotta border-2 border-white rounded-full"></span>
              </div>
              <img src={`https://ui-avatars.com/api/?name=Admin&background=0b1e33&color=fff`} className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-slate-100 shadow-sm" />
            </div>
          </header>

          <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Total Orders', val: stats.totalOrders, icon: 'fa-shopping-basket', color: 'blue', trend: '+12%' },
                    { label: 'Revenue (₹)', val: stats.totalRevenue, icon: 'fa-wallet', color: 'brand-terracotta', trend: '+8%' },
                    { label: 'User Rating', val: stats.avgRating, icon: 'fa-star', color: 'purple', trend: 'Stable' },
                    { label: 'Active SKUs', val: stats.totalProducts, icon: 'fa-box', color: 'orange', trend: 'Live' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-2 md:mb-4">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-${stat.color === 'brand-terracotta' ? 'brand-terracotta' : stat.color + '-600'}`}>
                          <i className={`fas ${stat.icon}`}></i>
                        </div>
                        <span className="text-[8px] md:text-xs font-bold text-emerald-500 bg-emerald-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg">{stat.trend}</span>
                      </div>
                      <p className="text-slate-500 text-[10px] md:text-sm font-medium truncate">{stat.label}</p>
                      <h4 className="text-base md:text-2xl font-black text-slate-900 truncate">{stat.val}</h4>
                    </div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                  <div className="lg:col-span-2 bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <i className="fas fa-chart-line text-brand-navy"></i>
                      Sales Velocity
                    </h3>
                    <div className="h-[200px] md:h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesHistory}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#b75c3b" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#b75c3b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                          />
                          <Area type="monotone" dataKey="sales" stroke="#b75c3b" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center">
                    <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-6 self-start flex items-center gap-2">
                      <i className="fas fa-tasks text-brand-navy"></i>
                      Fulfillment
                    </h3>
                    <div className="h-[150px] md:h-[180px] w-full relative">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl md:text-3xl font-black text-slate-900">{Math.round((stats.delivered/stats.totalOrders)*100)}%</span>
                        <span className="text-[8px] md:text-[10px] uppercase font-bold text-slate-400">Done</span>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="value" stroke="none">
                            {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full space-y-2 mt-4">
                      {chartData.map(item => (
                        <div key={item.name} className="flex items-center justify-between text-[10px] md:text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></span>
                            <span className="text-slate-600 font-medium">{item.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm md:text-lg font-bold text-slate-900">Recent Transactions</h3>
                    <button className="text-xs font-bold text-brand-terracotta hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 uppercase text-[9px] md:text-[10px] font-bold tracking-widest">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                        {recentOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{order.id}</td>
                            <td className="px-6 py-4 text-slate-600 truncate max-w-[120px]">{order.customer}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase ${
                                order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                order.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">{order.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab !== 'overview' && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
                <i className={`fas ${activeTab === 'orders' ? 'fa-receipt' : 'fa-warehouse'} text-5xl mb-4 opacity-20`}></i>
                <p className="font-medium px-4">Management tools for {activeTab} will be available in the next release.</p>
              </div>
            )}
          </div>

          <footer className="px-8 py-3 bg-white border-t border-slate-200 text-center text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
             System Status: Operational — Console v3.1
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;