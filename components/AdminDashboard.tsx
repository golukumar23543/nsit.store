import React, { useMemo, useState } from 'react';
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
    const totalOrders = products.reduce((acc, p) => acc + (p.orderCount || 0), 0);
    const avgRating = products.length > 0 
      ? (products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length).toFixed(1)
      : '0.0';
    const totalRevenue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.orderCount || 0)), 0);
    
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
    document.getElementById('asset-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setProductForm({ name: '', price: 0, desc: '', cat: 'all', img: '', usd: '$0', orderCount: 0, rating: 5.0 });
  };

  const recentOrders = [
    { id: '#1284', customer: 'Golu Kumar', status: 'Delivered', amount: '₹14,999' },
    { id: '#1285', customer: 'Anjali Sharma', status: 'Pending', amount: '₹2,499' },
    { id: '#1286', customer: 'Rahul Verma', status: 'Confirmed', amount: '₹5,999' },
    { id: '#1287', customer: 'Sita Ram', status: 'Delivered', amount: '₹899' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-brand-navy/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full h-full max-w-6xl sm:h-[90vh] bg-white sm:rounded-[32px] shadow-2xl overflow-hidden flex">
        {/* Sidebar */}
        <div className={`absolute sm:relative inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white p-6 flex flex-col transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-terracotta rounded-lg flex items-center justify-center font-bold text-sm text-white">NS</div>
              <span className="font-bold tracking-tight text-xl">NSIP Admin</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="sm:hidden text-slate-400 hover:text-white"><i className="fas fa-times"></i></button>
          </div>
          <nav className="space-y-2 flex-grow">
            {['overview', 'orders', 'inventory'].map((id) => (
              <button key={id} onClick={() => { setActiveTab(id as any); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === id ? 'bg-brand-navyLight text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
                <i className={`fas fa-${id === 'overview' ? 'chart-pie' : id === 'orders' ? 'shopping-cart' : 'box'} text-sm`}></i>
                <span className="text-sm font-semibold capitalize">{id}</span>
              </button>
            ))}
          </nav>
          <button onClick={onClose} className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors"><i className="fas fa-sign-out-alt"></i><span className="text-sm font-semibold">Exit Panel</span></button>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col overflow-hidden bg-slate-50 w-full">
          <header className="px-4 md:px-8 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="sm:hidden w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg text-slate-600"><i className="fas fa-bars"></i></button>
              <div><h2 className="text-lg md:text-2xl font-bold text-slate-900 capitalize leading-tight">{activeTab}</h2></div>
            </div>
            <img src={`https://ui-avatars.com/api/?name=Admin&background=0b1e33&color=fff`} className="w-9 h-9 md:w-10 md:h-10 rounded-full" />
          </header>

          <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-8">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Total Orders', val: stats.totalOrders, icon: 'fa-shopping-basket', color: 'blue' },
                    { label: 'Revenue (₹)', val: stats.totalRevenue, icon: 'fa-wallet', color: 'brand-terracotta' },
                    { label: 'User Rating', val: stats.avgRating, icon: 'fa-star', color: 'purple' },
                    { label: 'Active SKUs', val: stats.totalProducts, icon: 'fa-box', color: 'orange' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                      <div className={`w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center mb-4 text-${stat.color === 'brand-terracotta' ? 'brand-terracotta' : stat.color + '-600'}`}><i className={`fas ${stat.icon}`}></i></div>
                      <p className="text-slate-500 text-[10px] font-medium">{stat.label}</p>
                      <h4 className="text-base md:text-2xl font-black text-slate-900">{stat.val}</h4>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Fulfillment Distribution</h3>
                  <div className="flex flex-wrap gap-8 justify-center items-center">
                    {[
                      { label: 'Delivered', val: stats.delivered, color: 'bg-emerald-500' },
                      { label: 'Confirmed', val: stats.confirmed, color: 'bg-blue-500' },
                      { label: 'Pending', val: stats.pending, color: 'bg-orange-500' }
                    ].map(d => (
                      <div key={d.label} className="flex flex-col items-center">
                        <div className={`w-20 h-20 rounded-full border-4 ${d.color.replace('bg-', 'border-')}/20 flex items-center justify-center font-black text-slate-800`}>{d.val}</div>
                        <span className="text-[10px] font-black uppercase mt-2 text-slate-400">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-10">
                <div id="asset-form" className={`bg-white p-6 rounded-[32px] shadow-sm border ${editingProductId ? 'border-brand-terracotta' : 'border-slate-100'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">{editingProductId ? 'Edit Asset' : 'New Asset'}</h3>
                    {editingProductId && <button onClick={cancelEdit} className="text-xs font-bold text-slate-400 uppercase">Cancel</button>}
                  </div>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="bg-slate-50 border rounded-xl px-4 py-3 text-sm" placeholder="Asset Name" />
                    <input required type="number" value={productForm.price || ''} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="bg-slate-50 border rounded-xl px-4 py-3 text-sm" placeholder="Price (₹)" />
                    <select value={productForm.cat} onChange={e => setProductForm({...productForm, cat: e.target.value as Category})} className="bg-slate-50 border rounded-xl px-4 py-3 text-sm">
                      <option value="all">Uncategorized</option><option value="clothing">Lifestyle</option><option value="electronics">Tech</option><option value="books">Library</option>
                    </select>
                    <input required value={productForm.img} onChange={e => setProductForm({...productForm, img: e.target.value})} className="bg-slate-50 border rounded-xl px-4 py-3 text-sm" placeholder="Image URL" />
                    <textarea required value={productForm.desc} onChange={e => setProductForm({...productForm, desc: e.target.value})} className="md:col-span-2 bg-slate-50 border rounded-xl px-4 py-3 text-sm h-24" placeholder="Description" />
                    <button type="submit" className={`md:col-span-2 py-4 text-white font-black rounded-2xl uppercase tracking-widest text-xs ${editingProductId ? 'bg-brand-terracotta' : 'bg-brand-navy'}`}>{editingProductId ? 'Update' : 'Deploy'}</button>
                  </form>
                </div>

                <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400"><tr><th className="px-8 py-4">Asset</th><th className="px-8 py-4">Price</th><th className="px-8 py-4 text-center">Actions</th></tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {products.map(p => (
                          <tr key={p.id} className="text-sm">
                            <td className="px-8 py-4 font-bold text-slate-900">{p.name}</td>
                            <td className="px-8 py-4 font-black">₹{p.price}</td>
                            <td className="px-8 py-4 flex justify-center gap-2">
                              <button onClick={() => startEdit(p)} className="p-2 text-blue-500"><i className="far fa-edit"></i></button>
                              <button onClick={() => onRemoveProduct(p.id)} className="p-2 text-red-500"><i className="far fa-trash-alt"></i></button>
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
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
                <div className="space-y-4">
                  {recentOrders.map(o => (
                    <div key={o.id} className="flex justify-between items-center p-4 border rounded-2xl">
                      <div><div className="font-bold text-slate-900">{o.customer}</div><div className="text-xs text-slate-400">{o.id}</div></div>
                      <div className="text-right font-black text-slate-900">{o.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;