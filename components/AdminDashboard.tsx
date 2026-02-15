import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Product, Category } from '../types';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
  onUpdateProduct: (product: Product) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onAddProduct, onRemoveProduct, onUpdateProduct, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State for product
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    desc: '',
    cat: 'all',
    img: '',
    usd: '$0',
    orderCount: 0,
    rating: 5.0
  });

  const stats = useMemo(() => {
    const totalOrders = products.reduce((acc, p) => acc + p.orderCount, 0);
    const avgRating = products.length > 0 
      ? (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1)
      : '0.0';
    const totalRevenue = products.reduce((acc, p) => acc + (p.price * p.orderCount), 0);
    
    return {
      totalProducts: products.length,
      avgRating: `${avgRating} ★`,
      totalOrders,
      totalRevenue: totalRevenue.toLocaleString('en-IN'),
      confirmed: Math.floor(totalOrders * 0.45),
      pending: Math.floor(totalOrders * 0.15),
      delivered: Math.floor(totalOrders * 0.40),
    };
  }, [products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.img || !productForm.price) return;

    if (editingProductId) {
      const updatedProduct: Product = {
        ...productForm as Product,
        id: editingProductId,
        usd: `$${Math.round((productForm.price || 0) / 83)}`,
      };
      onUpdateProduct(updatedProduct);
      setEditingProductId(null);
    } else {
      const productToDeploy: Product = {
        ...productForm as Product,
        id: `nsip-${Date.now()}`,
        usd: `$${Math.round((productForm.price || 0) / 83)}`,
        orderCount: 0,
        rating: 5.0
      };
      onAddProduct(productToDeploy);
    }

    setProductForm({
      name: '',
      price: 0,
      desc: '',
      cat: 'all',
      img: '',
      usd: '$0',
      orderCount: 0,
      rating: 5.0
    });
  };

  const startEdit = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm(product);
    // Scroll to form for better UX on mobile
    const formEl = document.getElementById('asset-form');
    formEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      price: 0,
      desc: '',
      cat: 'all',
      img: '',
      usd: '$0',
      orderCount: 0,
      rating: 5.0
    });
  };

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
      
      <div className="relative w-full h-full max-w-6xl sm:h-[90vh] bg-white sm:rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex">
        {/* Sidebar */}
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
              <img src={`https://ui-avatars.com/api/?name=Admin&background=0b1e33&color=fff`} className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-slate-100 shadow-sm" />
            </div>
          </header>

          <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-8">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Total Orders', val: stats.totalOrders, icon: 'fa-shopping-basket', color: 'blue', trend: '+12%' },
                    { label: 'Revenue (₹)', val: stats.totalRevenue, icon: 'fa-wallet', color: 'brand-terracotta', trend: '+8%' },
                    { label: 'User Rating', val: stats.avgRating, icon: 'fa-star', color: 'purple', trend: 'Stable' },
                    { label: 'Active SKUs', val: stats.totalProducts, icon: 'fa-box', color: 'orange', trend: 'Live' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 flex items-center justify-center text-${stat.color === 'brand-terracotta' ? 'brand-terracotta' : stat.color + '-600'}`}>
                          <i className={`fas ${stat.icon}`}></i>
                        </div>
                      </div>
                      <p className="text-slate-500 text-[10px] md:text-sm font-medium">{stat.label}</p>
                      <h4 className="text-base md:text-2xl font-black text-slate-900">{stat.val}</h4>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <i className="fas fa-chart-line text-brand-navy"></i> Sales Velocity
                    </h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesHistory}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <YAxis hide />
                          <Tooltip />
                          <Area type="monotone" dataKey="sales" stroke="#b75c3b" strokeWidth={3} fillOpacity={0.1} fill="#b75c3b" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 self-start">Fulfillment</h3>
                    <div className="h-[180px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="value" stroke="none">
                            {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-10">
                {/* Product Form */}
                <div id="asset-form" className={`bg-white p-6 md:p-10 rounded-[32px] shadow-sm border transition-all duration-300 ${editingProductId ? 'border-brand-terracotta ring-1 ring-brand-terracotta/20' : 'border-slate-100'}`}>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <i className={`fas ${editingProductId ? 'fa-pen-to-square' : 'fa-plus-circle'} text-brand-terracotta`}></i>
                      {editingProductId ? 'Recalibrate Asset Data' : 'Deploy New Asset'}
                    </h3>
                    {editingProductId && (
                      <button 
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Asset Name</label>
                        <input 
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-terracotta/20 outline-none transition-all"
                          placeholder="e.g. Premium Studio Mic"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Terminal Price (₹)</label>
                        <input 
                          required
                          type="number"
                          value={productForm.price || ''}
                          onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-terracotta/20 outline-none transition-all"
                          placeholder="1499"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Asset Category</label>
                        <select 
                          value={productForm.cat}
                          onChange={(e) => setProductForm({...productForm, cat: e.target.value as Category})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-terracotta/20 outline-none transition-all"
                        >
                          <option value="all">Uncategorized</option>
                          <option value="clothing">Lifestyle</option>
                          <option value="electronics">Tech & Studio</option>
                          <option value="books">Library</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Image URL</label>
                        <input 
                          required
                          value={productForm.img}
                          onChange={(e) => setProductForm({...productForm, img: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-terracotta/20 outline-none transition-all"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Specifications / Description</label>
                        <textarea 
                          required
                          value={productForm.desc}
                          onChange={(e) => setProductForm({...productForm, desc: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-terracotta/20 outline-none transition-all h-[116px] resize-none"
                          placeholder="Detailed asset features..."
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 pt-4">
                      <button 
                        type="submit"
                        className={`w-full py-4 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs shadow-xl ${editingProductId ? 'bg-brand-terracotta shadow-brand-terracotta/20' : 'bg-brand-navy shadow-brand-navy/10'}`}
                      >
                        {editingProductId ? 'Update Inventory Asset' : 'Deploy to Marketplace'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Inventory List */}
                <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Active Assets</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: {products.length} Items</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 uppercase text-[9px] font-bold tracking-widest">
                          <th className="px-8 py-4">Preview</th>
                          <th className="px-8 py-4">Asset Name</th>
                          <th className="px-8 py-4">Category</th>
                          <th className="px-8 py-4">Sales</th>
                          <th className="px-8 py-4">Terminal Price</th>
                          <th className="px-8 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {products.map(product => (
                          <tr key={product.id} className={`hover:bg-slate-50/50 transition-colors ${editingProductId === product.id ? 'bg-brand-terracotta/5' : ''}`}>
                            <td className="px-8 py-4">
                              <img src={product.img} className="w-12 h-12 object-cover rounded-xl shadow-sm border border-slate-200" alt="" />
                            </td>
                            <td className="px-8 py-4">
                              <div className="font-bold text-slate-900">{product.name}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{product.id}</div>
                            </td>
                            <td className="px-8 py-4">
                              <span className="px-2 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-500 tracking-wider">{product.cat}</span>
                            </td>
                            <td className="px-8 py-4 font-medium text-slate-600">
                              {product.orderCount} Units
                            </td>
                            <td className="px-8 py-4 font-black text-slate-900">
                              ₹{product.price}
                            </td>
                            <td className="px-8 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => startEdit(product)}
                                  className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                  title="Edit Asset"
                                >
                                  <i className="far fa-edit"></i>
                                </button>
                                <button 
                                  onClick={() => onRemoveProduct(product.id)}
                                  className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                  title="Delete Asset"
                                >
                                  <i className="far fa-trash-alt"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900">Order Terminal</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 uppercase text-[9px] font-bold tracking-widest">
                          <th className="px-8 py-4">ID</th>
                          <th className="px-8 py-4">Customer</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {recentOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-4 font-bold text-slate-900">{order.id}</td>
                            <td className="px-8 py-4 text-slate-600">{order.customer}</td>
                            <td className="px-8 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                order.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-8 py-4 text-right font-black text-slate-900">{order.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
            )}
          </div>

          <footer className="px-8 py-3 bg-white border-t border-slate-200 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
             System Status: Operational — Console v3.1
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;