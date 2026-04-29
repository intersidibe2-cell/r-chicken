import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LayoutDashboard, ShoppingCart, ChefHat, Package,
  BarChart3, LogOut, Menu, X, TrendingUp, Users,
  Clock, CheckCircle, Truck, RefreshCw, DollarSign,
  Plus, Minus, Printer, CreditCard, MessageCircle,
  Phone, Search, Filter, ChevronDown, AlertCircle,
  Globe, Smartphone, Store, Send, Edit2, Trash2,
  ArrowUp, ArrowDown, Check
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase, ADMIN_EMAIL } from '../../supabase';
import { menuData } from '../../data/menu';
import { useToast } from '../../components/Toast';

const RESTAURANT_PHONE = '22383806129';

// ============================================================
// CONSTANTS
// ============================================================
const STATUS_LIST = ['en attente', 'en cours', 'prêt', 'livré'];
const STATUS_CONFIG = {
  'en attente': { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400', icon: Clock },
  'en cours':   { label: 'En cours',   color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400', icon: ChefHat },
  'prêt':       { label: 'Prêt',       color: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-400',   icon: Package },
  'livré':      { label: 'Livré',      color: 'bg-green-100 text-green-700 border-green-200',    dot: 'bg-green-400',  icon: Truck },
};
const SOURCE_CONFIG = {
  'site':     { label: 'Site web',  icon: Globe,        color: 'bg-blue-100 text-blue-700' },
  'whatsapp': { label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-100 text-green-700' },
  'caisse':   { label: 'Sur place', icon: Store,        color: 'bg-purple-100 text-purple-700' },
};
const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'orders',      label: 'Commandes',        icon: ShoppingCart },
  { id: 'kitchen',     label: 'Cuisine',          icon: ChefHat },
  { id: 'cashier',     label: 'Caisse POS',       icon: CreditCard },
  { id: 'menu',        label: 'Gestion Menu',     icon: Package },
  { id: 'accounting',  label: 'Comptabilité',     icon: BarChart3 },
];

// ============================================================
// GUARD
// ============================================================
function useAdminGuard() {
  const isAdmin = localStorage.getItem('rchicken_admin') === ADMIN_EMAIL;
  useEffect(() => { if (!isAdmin) window.location.href = '/admin/login'; }, [isAdmin]);
  return isAdmin;
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ active, setActive, open, setOpen }) {
  const handleLogout = () => {
    localStorage.removeItem('rchicken_admin');
    localStorage.removeItem('rchicken_admin_time');
    window.location.href = '/admin/login';
  };
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E4002B] rounded-xl flex items-center justify-center text-xl font-black">R</div>
            <div>
              <h1 className="font-black text-white leading-none">R-CHICKEN</h1>
              <p className="text-xs text-gray-400">Admin Pro v3.0</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all font-medium ${active === item.id ? 'bg-[#E4002B] text-white shadow-lg' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm">
            <Globe className="w-4 h-4" /> Voir le site
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all text-sm">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['en attente'];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  );
}

// ============================================================
// SOURCE BADGE
// ============================================================
function SourceBadge({ source }) {
  const cfg = SOURCE_CONFIG[source] || SOURCE_CONFIG['site'];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ setActive }) {
  const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, clients: 0 });
  const [chartData, setChartData] = useState([]);
  const [sourceData, setSourceData] = useState({ site: 0, whatsapp: 0, caisse: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: all } = await supabase.from('commandes').select('*').order('created_at', { ascending: false });
    if (!all) { setLoading(false); return; }

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayOrders = all.filter(o => new Date(o.created_at) >= today);
    const phones = new Set(all.map(o => o.client_phone).filter(Boolean));

    setStats({
      total: all.reduce((s, o) => s + (o.total || 0), 0),
      today: todayOrders.reduce((s, o) => s + (o.total || 0), 0),
      pending: all.filter(o => o.status === 'en attente').length,
      clients: phones.size,
    });

    // Chart: 7 derniers jours
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const dayOrders = all.filter(o => { const t = new Date(o.created_at); return t >= d && t < next; });
      days.push({
        day: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
        ca: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
        nb: dayOrders.length,
      });
    }
    setChartData(days);

    // Sources
    const waSaved = JSON.parse(localStorage.getItem('rchicken_whatsapp_orders') || '[]');
    setSourceData({
      site: all.filter(o => !o.source || o.source === 'site').length,
      whatsapp: all.filter(o => o.source === 'whatsapp').length + waSaved.length,
      caisse: all.filter(o => o.source === 'caisse').length,
    });

    setRecentOrders(all.slice(0, 8));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const total = sourceData.site + sourceData.whatsapp + sourceData.caisse || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm">Restaurant Golf · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">
          <RefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'CA Total', value: `${stats.total.toLocaleString('fr-FR')} F`, icon: TrendingUp, bg: 'bg-[#E4002B]', trend: '+12%' },
            { label: "CA Aujourd'hui", value: `${stats.today.toLocaleString('fr-FR')} F`, icon: DollarSign, bg: 'bg-green-500', trend: '+5%' },
            { label: 'En attente', value: stats.pending, icon: Clock, bg: 'bg-amber-500', alert: stats.pending > 0 },
            { label: 'Clients uniques', value: stats.clients, icon: Users, bg: 'bg-blue-500' },
          ].map((kpi, i) => (
            <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${kpi.alert ? 'ring-2 ring-amber-400' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                  <kpi.icon className="w-5 h-5 text-white" />
                </div>
                {kpi.trend && <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">{kpi.trend}</span>}
                {kpi.alert && <span className="flex h-2 w-2"><span className="animate-ping absolute h-2 w-2 rounded-full bg-amber-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-amber-500"></span></span>}
              </div>
              <p className="text-2xl font-black text-gray-900">{typeof kpi.value === 'number' ? kpi.value : kpi.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Ventes — 7 derniers jours</h2>
            <span className="text-xs text-gray-400">Chiffre d'affaires (F)</span>
          </div>
          {loading ? <div className="h-48 bg-gray-100 rounded-xl animate-pulse" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v === 0 ? '0' : `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`${v.toLocaleString('fr-FR')} F`, 'CA']} />
                <Bar dataKey="ca" fill="#E4002B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sources */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Sources commandes</h2>
          <div className="space-y-4">
            {[
              { key: 'site',     label: 'Site web',   icon: Globe,         color: 'bg-blue-500',   count: sourceData.site },
              { key: 'whatsapp', label: 'WhatsApp',    icon: MessageCircle, color: 'bg-green-500',  count: sourceData.whatsapp },
              { key: 'caisse',   label: 'Sur place',  icon: Store,         color: 'bg-purple-500', count: sourceData.caisse },
            ].map(s => {
              const pct = Math.round((s.count / total) * 100);
              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 ${s.color} rounded-lg flex items-center justify-center`}>
                        <s.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{s.label}</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">{s.count} <span className="text-gray-400 font-normal text-xs">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => setActive('orders')} className="w-full mt-6 bg-[#E4002B] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#C4001F] transition-colors">
            Voir toutes les commandes
          </button>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-gray-900">Commandes récentes</h2>
          <button onClick={() => setActive('orders')} className="text-sm text-[#E4002B] font-medium hover:underline">Voir tout</button>
        </div>
        <div className="divide-y">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-16 mx-5 my-3 bg-gray-100 rounded-xl animate-pulse" />)
          ) : recentOrders.length === 0 ? (
            <p className="p-8 text-center text-gray-400">Aucune commande pour le moment</p>
          ) : recentOrders.map(order => (
            <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black text-gray-500">
                {(order.client_name || 'C').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{order.client_name || 'Client anonyme'}</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} · {(Array.isArray(order.items) ? order.items : []).length} article(s)</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-[#E4002B] text-sm">{(order.total || 0).toLocaleString('fr-FR')} F</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ORDERS — 3 ONGLETS
// ============================================================
function OrdersAdmin() {
  const [tab, setTab] = useState('site');
  const [orders, setOrders] = useState([]);
  const [waOrders, setWaOrders] = useState(() => JSON.parse(localStorage.getItem('rchicken_whatsapp_orders') || '[]'));
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showWaForm, setShowWaForm] = useState(false);
  const [waForm, setWaForm] = useState({ name: '', phone: '', items: '', notes: '', total: '' });
  const { addToast } = useToast();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('commandes').select('*').order('created_at', { ascending: false }).limit(200);
    const { data } = await q;
    setOrders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  // Realtime
  useEffect(() => {
    const ch = supabase.channel('orders_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'commandes' }, loadOrders)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [loadOrders]);

  const updateStatus = async (id, status, isWa = false) => {
    if (isWa) {
      const updated = waOrders.map(o => o.id === id ? { ...o, status } : o);
      setWaOrders(updated);
      localStorage.setItem('rchicken_whatsapp_orders', JSON.stringify(updated));
      addToast('Statut mis à jour', 'success');
      return;
    }
    const { error } = await supabase.from('commandes').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) { setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)); addToast('Statut mis à jour', 'success'); }
  };

  const saveWaOrder = () => {
    if (!waForm.phone && !waForm.name) return addToast('Nom ou téléphone requis', 'error');
    const o = {
      id: 'WA-' + Date.now().toString().slice(-6),
      client_name: waForm.name || 'Client WhatsApp',
      client_phone: waForm.phone,
      items_text: waForm.items,
      notes: waForm.notes,
      total: parseFloat(waForm.total) || 0,
      status: 'en attente',
      source: 'whatsapp',
      created_at: new Date().toISOString(),
    };
    const updated = [o, ...waOrders];
    setWaOrders(updated);
    localStorage.setItem('rchicken_whatsapp_orders', JSON.stringify(updated));
    setWaForm({ name: '', phone: '', items: '', notes: '', total: '' });
    setShowWaForm(false);
    addToast('Commande WhatsApp ajoutée', 'success');
  };

  const deleteWaOrder = (id) => {
    const updated = waOrders.filter(o => o.id !== id);
    setWaOrders(updated);
    localStorage.setItem('rchicken_whatsapp_orders', JSON.stringify(updated));
    addToast('Commande supprimée', 'success');
  };

  const sendWhatsAppUpdate = (order, status) => {
    const msg = encodeURIComponent(`Bonjour ${order.client_name || ''} 👋\n\nVotre commande *${order.id}* est maintenant : *${STATUS_CONFIG[status]?.label || status}*\n\nMerci de votre confiance ! 🍗 R-CHICKEN`);
    window.open(`https://wa.me/${order.client_phone}?text=${msg}`, '_blank');
  };

  const siteOrders = orders.filter(o => !o.source || o.source === 'site');
  const caisseOrders = orders.filter(o => o.source === 'caisse');
  const filteredSite = filter === 'all' ? siteOrders : siteOrders.filter(o => o.status === filter);
  const filteredWa = filter === 'all' ? waOrders : waOrders.filter(o => o.status === filter);

  const tabCounts = {
    site: siteOrders.length,
    whatsapp: waOrders.length,
    caisse: caisseOrders.length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Commandes</h1>
          <p className="text-gray-500 text-sm">Toutes les commandes en temps réel</p>
        </div>
        <button onClick={loadOrders} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-gray-600 hover:bg-gray-50 text-sm">
          <RefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-1.5">
        {[
          { id: 'site',     label: 'Site web',  icon: Globe,        color: 'text-blue-600' },
          { id: 'whatsapp', label: 'WhatsApp',   icon: MessageCircle, color: 'text-green-600' },
          { id: 'caisse',   label: 'Sur place',  icon: Store,        color: 'text-purple-600' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.id ? 'bg-[#E4002B] text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
            <t.icon className="w-4 h-4" />
            <span>{t.label}</span>
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${tab === t.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{tabCounts[t.id]}</span>
          </button>
        ))}
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...STATUS_LIST].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === s ? 'bg-[#E4002B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s === 'all' ? 'Toutes' : STATUS_CONFIG[s]?.label}
          </button>
        ))}
      </div>

      {/* SITE TAB */}
      {tab === 'site' && (
        loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />)}</div>
        : filteredSite.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucune commande</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSite.map(order => <OrderCard key={order.id} order={order} onStatusChange={(id, s) => updateStatus(id, s)} />)}
          </div>
        )
      )}

      {/* WHATSAPP TAB */}
      {tab === 'whatsapp' && (
        <div className="space-y-4">
          <button onClick={() => setShowWaForm(!showWaForm)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-colors">
            <Plus className="w-5 h-5" />
            Saisir une commande WhatsApp
          </button>

          {showWaForm && (
            <div className="bg-white rounded-2xl border border-green-200 p-5 space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-green-500" /> Nouvelle commande WhatsApp</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={waForm.name} onChange={e => setWaForm({...waForm, name: e.target.value})} placeholder="Nom du client" className="px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-green-400" />
                <input value={waForm.phone} onChange={e => setWaForm({...waForm, phone: e.target.value})} placeholder="Téléphone (ex: 22370123456)" className="px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-green-400" />
              </div>
              <textarea value={waForm.items} onChange={e => setWaForm({...waForm, items: e.target.value})}
                placeholder="Articles commandés (ex: 2x KFC 6 Pcs, 1x Box Solo, 1x Fanta...)" rows={3}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-green-400 resize-none" />
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={waForm.total} onChange={e => setWaForm({...waForm, total: e.target.value})} type="number" placeholder="Total (F CFA)" className="px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-green-400" />
                <input value={waForm.notes} onChange={e => setWaForm({...waForm, notes: e.target.value})} placeholder="Notes (adresse, instructions...)" className="px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-green-400" />
              </div>
              <div className="flex gap-3">
                <button onClick={saveWaOrder} className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-bold hover:bg-green-600">Enregistrer</button>
                <button onClick={() => setShowWaForm(false)} className="px-6 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold hover:bg-gray-200">Annuler</button>
              </div>
            </div>
          )}

          {filteredWa.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">Aucune commande WhatsApp</p>
            </div>
          ) : filteredWa.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-gray-900">{order.client_name}</p>
                    <SourceBadge source="whatsapp" />
                  </div>
                  <p className="text-sm text-gray-500">{order.client_phone} · {new Date(order.created_at).toLocaleString('fr-FR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl text-[#E4002B]">{(order.total || 0).toLocaleString('fr-FR')} F</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {order.items_text && (
                <div className="bg-gray-50 rounded-xl p-3 mb-3 text-sm text-gray-700 whitespace-pre-line">{order.items_text}</div>
              )}
              {order.notes && <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 mb-3 text-sm text-amber-700">📝 {order.notes}</div>}

              <div className="flex flex-wrap gap-2">
                {STATUS_LIST.map(s => (
                  <button key={s} onClick={() => updateStatus(order.id, s, true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${order.status === s ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#E4002B] text-white hover:bg-[#C4001F]'}`}
                    disabled={order.status === s}>
                    {STATUS_CONFIG[s]?.label}
                  </button>
                ))}
                {order.client_phone && (
                  <button onClick={() => sendWhatsAppUpdate(order, order.status)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500 text-white hover:bg-green-600">
                    <Send className="w-3 h-3" /> Envoyer update
                  </button>
                )}
                <button onClick={() => deleteWaOrder(order.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200">
                  <Trash2 className="w-3 h-3" /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CAISSE TAB */}
      {tab === 'caisse' && (
        loading ? <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />)}</div>
        : caisseOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <Store className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucune commande sur place</p>
          </div>
        ) : caisseOrders.map(order => <OrderCard key={order.id} order={order} onStatusChange={(id, s) => updateStatus(id, s)} />)
      )}
    </div>
  );
}

// ============================================================
// ORDER CARD
// ============================================================
function OrderCard({ order, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(order.items) ? order.items : [];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-gray-500">
          {(order.client_name || 'C').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-900 text-sm">{order.client_name || 'Client anonyme'}</p>
            <SourceBadge source={order.source || 'site'} />
          </div>
          <p className="text-xs text-gray-400 truncate">{order.id.substring(0, 20)}... · {new Date(order.created_at).toLocaleString('fr-FR')}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-black text-[#E4002B]">{(order.total || 0).toLocaleString('fr-FR')} F</p>
          <StatusBadge status={order.status} />
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-3">
          {/* Client info */}
          <div className="grid sm:grid-cols-3 gap-2 text-sm">
            {order.client_phone && <div className="flex items-center gap-1.5 text-gray-600"><Phone className="w-4 h-4" />{order.client_phone}</div>}
            {order.client_address && order.client_address !== 'À emporter' && <div className="flex items-center gap-1.5 text-gray-600 col-span-2">📍 {order.client_address}</div>}
            <div className="flex items-center gap-1.5 text-gray-600">💳 {order.payment_method || 'cash'}</div>
            <div className="flex items-center gap-1.5 text-gray-600">{order.delivery_method === 'pickup' ? '🏪 À emporter' : '🚚 Livraison'}</div>
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    <span className="font-black text-[#E4002B] mr-2">{item.quantity}x</span>
                    {item.name}
                    {item.selectedSize && <span className="text-gray-400 ml-1">({item.selectedSize})</span>}
                    {item.selectedAddons?.length > 0 && <span className="text-green-600 ml-1">+{item.selectedAddons.join(', ')}</span>}
                  </span>
                  <span className="font-bold">{((item.price || 0) * item.quantity).toLocaleString('fr-FR')}F</span>
                </div>
              ))}
              <div className="border-t pt-1.5 flex justify-between font-black">
                <span>Total</span>
                <span className="text-[#E4002B]">{(order.total || 0).toLocaleString('fr-FR')} F</span>
              </div>
            </div>
          )}

          {order.notes && <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 text-sm text-amber-700">📝 {order.notes}</div>}

          {/* Status buttons */}
          <div className="flex flex-wrap gap-2">
            {STATUS_LIST.map(s => (
              <button key={s} onClick={() => onStatusChange(order.id, s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${order.status === s ? 'ring-2 ring-[#E4002B] bg-red-50 text-[#E4002B] cursor-default' : 'bg-gray-100 text-gray-600 hover:bg-[#E4002B] hover:text-white'}`}>
                {STATUS_CONFIG[s]?.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// KITCHEN
// ============================================================
function KitchenAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const load = useCallback(async () => {
    const { data } = await supabase.from('commandes').select('*').in('status', ['en attente', 'en cours']).order('created_at', { ascending: true });
    setOrders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const ch = supabase.channel('kitchen_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'commandes' }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [load]);

  const updateStatus = async (id, status) => {
    await supabase.from('commandes').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    addToast(status === 'en cours' ? 'Préparation commencée !' : 'Commande prête !', 'success');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Écran Cuisine</h1>
          <p className="text-gray-500 text-sm">{orders.length} commande(s) · Mise à jour automatique</p>
        </div>
        <div className="flex items-center gap-2 text-green-500 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Temps réel
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">{[1,2].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-bold text-gray-500">Cuisine libre !</p>
          <p className="text-gray-400 mt-1">Les nouvelles commandes apparaîtront automatiquement</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map(order => {
            const items = Array.isArray(order.items) ? order.items : [];
            const isPending = order.status === 'en attente';
            const elapsed = Math.floor((Date.now() - new Date(order.created_at)) / 60000);
            return (
              <div key={order.id} className={`rounded-2xl border-2 p-5 ${isPending ? 'border-amber-400 bg-amber-50' : 'border-orange-400 bg-orange-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-black text-lg text-gray-900">{order.client_name || 'Sur place'}</p>
                    <p className="text-sm text-gray-500">{order.delivery_method === 'pickup' ? '🏪 À emporter' : '🚚 Livraison'} · {elapsed}min</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.status} />
                    {elapsed > 20 && <p className="text-xs text-red-500 font-bold mt-1">⚠️ En attente</p>}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                      <span className="font-black text-3xl text-[#E4002B] w-10 text-center leading-none">{item.quantity}</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        {item.selectedSize && <p className="text-sm text-[#E4002B] font-bold">{item.selectedSize}</p>}
                        {item.selectedAddons?.length > 0 && <p className="text-xs text-green-600">+ {item.selectedAddons.join(', ')}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {order.notes && <div className="bg-white border border-red-200 rounded-xl p-2 mb-3 text-sm text-red-600 font-medium">⚠️ {order.notes}</div>}

                <div className="flex gap-2">
                  {isPending && (
                    <button onClick={() => updateStatus(order.id, 'en cours')} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
                      🍳 Commencer
                    </button>
                  )}
                  <button onClick={() => updateStatus(order.id, 'prêt')} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors">
                    ✓ Prêt
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// CASHIER POS avec modal tailles/addons
// ============================================================
function CashierAdmin() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [sizeModal, setSizeModal] = useState(null); // { product }
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  const allProducts = menuData.categories.flatMap(cat =>
    cat.items.map(item => ({ ...item, categoryId: cat.id, categoryName: cat.name, categoryIcon: cat.icon }))
  );

  const filtered = allProducts.filter(p => {
    const matchCat = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const openProduct = (product) => {
    if (product.sizes?.length > 0 || product.addons?.length > 0) {
      setSizeModal(product);
      setSelectedSize(product.sizes?.[0] || null);
      setSelectedAddons([]);
    } else {
      addToCartDirect(product, null, [], product.price);
    }
  };

  const addToCartDirect = (product, size, addons, price) => {
    const label = size ? `${product.name} (${size.name})` : product.name;
    const key = `${product.id}-${size?.name || 'default'}-${addons.map(a => a.name).sort().join(',')}`;
    setCart(prev => {
      const existing = prev.find(i => i.cartKey === key);
      if (existing) return prev.map(i => i.cartKey === key ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, cartKey: key, label, price, selectedSize: size?.name, selectedAddons: addons.map(a => a.name), quantity: 1 }];
    });
    setSizeModal(null);
  };

  const confirmSizeModal = () => {
    if (!sizeModal) return;
    const addonCost = selectedAddons.reduce((s, a) => s + a.price, 0);
    const basePrice = selectedSize ? selectedSize.price : sizeModal.price;
    addToCartDirect(sizeModal, selectedSize, selectedAddons, basePrice + addonCost);
  };

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.name === addon.name) ? prev.filter(a => a.name !== addon.name) : [...prev, addon]
    );
  };

  const generateId = () => `POS-${Date.now().toString().slice(-6)}`;

  const handlePayment = async () => {
    const order = {
      id: generateId(),
      client_name: customerName || 'Client sur place',
      client_phone: customerPhone || '',
      client_address: 'Sur place',
      items: cart.map(i => ({ id: i.id, name: i.label || i.name, price: i.price, quantity: i.quantity, selectedSize: i.selectedSize, selectedAddons: i.selectedAddons })),
      total,
      delivery_fee: 0,
      delivery_method: 'pickup',
      payment_method: paymentMethod,
      status: 'livré',
      notes: 'Commande caisse',
      source: 'caisse',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('commandes').insert([order]);
    if (error) { addToast('Erreur sauvegarde', 'error'); return; }
    setLastOrder(order);
    setShowPayModal(false);
    setShowSuccessModal(true);
    setCart([]); setCustomerName(''); setCustomerPhone('');
    addToast('Commande enregistrée !', 'success');
  };

  const printReceipt = () => {
    if (!lastOrder) return;
    const win = window.open('', '_blank', 'width=350,height=600');
    win.document.write(`<html><head><style>body{font-family:monospace;font-size:13px;padding:15px;max-width:280px;margin:auto} hr{border:1px dashed #000} .row{display:flex;justify-content:space-between}</style></head><body>
      <h2 style="text-align:center;margin:0">🍗 R-CHICKEN</h2>
      <p style="text-align:center;margin:2px 0">Baco-djicoroni Golf, Bamako</p>
      <p style="text-align:center;margin:2px 0">Tél: +223 83 80 61 29</p>
      <hr/>
      <p>N°: <b>${lastOrder.id}</b></p>
      <p>Date: ${new Date(lastOrder.created_at).toLocaleString('fr-FR')}</p>
      ${lastOrder.client_name !== 'Client sur place' ? `<p>Client: ${lastOrder.client_name}</p>` : ''}
      <p>Paiement: ${lastOrder.payment_method}</p>
      <hr/>
      ${lastOrder.items.map(i => `<div class="row"><span>${i.quantity}x ${i.name}${i.selectedSize ? ` (${i.selectedSize})` : ''}</span><span>${((i.price || 0) * (i.quantity || 1)).toLocaleString()}F</span></div>`).join('')}
      <hr/>
      <div class="row" style="font-size:16px;font-weight:bold"><span>TOTAL</span><span>${(lastOrder.total || 0).toLocaleString()}F</span></div>
      <hr/>
      <p style="text-align:center">Merci de votre confiance ! 😊</p>
      <p style="text-align:center">www.r-chicken.com</p>
    </body></html>`);
    win.print();
  };

  const modalPrice = sizeModal ? (
    (selectedSize ? selectedSize.price : sizeModal.price) +
    selectedAddons.reduce((s, a) => s + a.price, 0)
  ) : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-gray-900">Caisse POS</h1>

      <div className="grid xl:grid-cols-3 gap-4">
        {/* LEFT — Products */}
        <div className="xl:col-span-2 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Rechercher un article..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E4002B]" />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex-shrink-0 ${activeCategory === 'all' ? 'bg-[#E4002B] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
              Tous
            </button>
            {menuData.categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex-shrink-0 ${activeCategory === cat.id ? 'bg-[#E4002B] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filtered.map(product => (
              <button key={`${product.id}-${product.categoryId}`} onClick={() => openProduct(product)}
                className="bg-white rounded-2xl p-3 border border-gray-100 hover:border-[#E4002B] hover:shadow-md transition-all text-left group">
                {product.image && (
                  <div className="relative mb-2">
                    <img src={product.image} alt={product.name} className="w-full h-20 object-cover rounded-xl" />
                    {(product.sizes?.length > 0 || product.addons?.length > 0) && (
                      <span className="absolute bottom-1 right-1 bg-[#E4002B] text-white text-xs font-bold px-1.5 py-0.5 rounded-lg">
                        {product.sizes?.length > 0 ? `${product.sizes.length} tailles` : 'Options'}
                      </span>
                    )}
                  </div>
                )}
                <p className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-[#E4002B]">{product.name}</p>
                <p className="text-[#E4002B] font-black text-sm mt-0.5">
                  {product.fromPrice ? 'Dès ' : ''}{(product.sizes?.[0]?.price || product.price).toLocaleString('fr-FR')} F
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Cart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3 sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">🛒 Panier</h2>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs text-red-500 hover:underline">Vider</button>
            )}
          </div>

          <div className="flex-1 space-y-2 min-h-[100px]">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Cliquez sur un article pour l'ajouter</p>
              </div>
            ) : cart.map(item => (
              <div key={item.cartKey} className="flex items-start gap-2 bg-gray-50 rounded-xl p-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.label || item.name}</p>
                  {item.selectedAddons?.length > 0 && (
                    <p className="text-xs text-green-600">+ {item.selectedAddons.join(', ')}</p>
                  )}
                  <p className="text-xs text-[#E4002B] font-bold">{item.price.toLocaleString('fr-FR')} F/u</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setCart(prev => prev.map(i => i.cartKey === item.cartKey ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))}
                    className="w-6 h-6 bg-white rounded-lg border flex items-center justify-center hover:bg-red-50">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-black">{item.quantity}</span>
                  <button onClick={() => setCart(prev => prev.map(i => i.cartKey === item.cartKey ? { ...i, quantity: i.quantity + 1 } : i))}
                    className="w-6 h-6 bg-white rounded-lg border flex items-center justify-center hover:bg-green-50">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button onClick={() => setCart(prev => prev.filter(i => i.cartKey !== item.cartKey))}
                    className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-100">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Customer */}
          <div className="space-y-2 pt-2 border-t">
            <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Nom (optionnel)" className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:border-[#E4002B]" />
            <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Téléphone (optionnel)" className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:border-[#E4002B]" />
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-xl focus:outline-none bg-white">
              <option value="cash">💵 Espèces</option>
              <option value="om">🟠 Orange Money</option>
              <option value="wave">🔵 Wave</option>
              <option value="sarali">🟡 Sarali</option>
            </select>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-gray-700">Total à payer</span>
              <span className="font-black text-2xl text-[#E4002B]">{total.toLocaleString('fr-FR')} F</span>
            </div>
            <button onClick={() => setShowPayModal(true)} disabled={cart.length === 0}
              className="w-full bg-[#E4002B] text-white py-3.5 rounded-xl font-black text-lg hover:bg-[#C4001F] disabled:opacity-40 transition-colors shadow-lg">
              Valider · {total.toLocaleString('fr-FR')} F
            </button>
          </div>
        </div>
      </div>

      {/* SIZE/ADDON MODAL */}
      {sizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setSizeModal(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-xl text-gray-900">{sizeModal.name}</h2>
              <button onClick={() => setSizeModal(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sizes */}
            {sizeModal.sizes?.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Choisir la taille</p>
                <div className="grid grid-cols-2 gap-2">
                  {sizeModal.sizes.map((size, i) => (
                    <button key={i} onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${selectedSize?.name === size.name ? 'border-[#E4002B] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <p className="font-bold text-gray-900 text-sm">{size.name}</p>
                      {size.description && <p className="text-xs text-gray-500 mt-0.5">{size.description}</p>}
                      <p className="font-black text-[#E4002B] mt-1">{size.price.toLocaleString('fr-FR')} F</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Addons */}
            {sizeModal.addons?.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Suppléments (optionnel)</p>
                <div className="space-y-2">
                  {sizeModal.addons.map((addon, i) => {
                    const isSelected = selectedAddons.find(a => a.name === addon.name);
                    return (
                      <button key={i} onClick={() => toggleAddon(addon)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-medium text-gray-900">{addon.name}</span>
                        </div>
                        <span className="font-bold text-green-600">+{addon.price.toLocaleString('fr-FR')} F</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Prix</p>
                <p className="font-black text-2xl text-[#E4002B]">{modalPrice.toLocaleString('fr-FR')} F</p>
              </div>
              <button onClick={confirmSizeModal} className="bg-[#E4002B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#C4001F] flex items-center gap-2">
                <Plus className="w-5 h-5" /> Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h2 className="font-black text-xl mb-4">Confirmer le paiement</h2>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.quantity}x {item.label || item.name}</span>
                  <span className="font-bold">{(item.price * item.quantity).toLocaleString('fr-FR')}F</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-black text-base">
                <span>TOTAL</span>
                <span className="text-[#E4002B]">{total.toLocaleString('fr-FR')} F</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Mode: <strong>{paymentMethod === 'cash' ? 'Espèces' : paymentMethod === 'om' ? 'Orange Money' : paymentMethod === 'wave' ? 'Wave' : 'Sarali'}</strong></p>
            <div className="flex gap-3">
              <button onClick={() => setShowPayModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold">Annuler</button>
              <button onClick={handlePayment} className="flex-1 bg-[#E4002B] text-white py-3 rounded-xl font-bold hover:bg-[#C4001F]">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && lastOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="font-black text-xl text-gray-900 mb-1">Commande validée !</h2>
            <p className="text-3xl font-black text-[#E4002B] mb-1">{lastOrder.id}</p>
            <p className="text-gray-500 mb-6">{lastOrder.total.toLocaleString('fr-FR')} F · {lastOrder.payment_method}</p>
            <div className="flex gap-3">
              <button onClick={printReceipt} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200">
                <Printer className="w-5 h-5" /> Ticket
              </button>
              <button onClick={() => setShowSuccessModal(false)} className="flex-1 bg-[#E4002B] text-white py-3 rounded-xl font-bold hover:bg-[#C4001F]">
                Nouvelle vente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MENU MANAGEMENT
// ============================================================
function MenuAdmin() {
  const AVAIL_KEY = 'rchicken_menu_availability';
  const [availability, setAvailability] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AVAIL_KEY) || '{}'); } catch { return {}; }
  });
  const { addToast } = useToast();

  const isAvailable = (id) => availability[id] !== false;

  const toggle = (id) => {
    const updated = { ...availability, [id]: !isAvailable(id) };
    setAvailability(updated);
    localStorage.setItem(AVAIL_KEY, JSON.stringify(updated));
    addToast(isAvailable(id) ? 'Article désactivé (Épuisé)' : 'Article activé', isAvailable(id) ? 'error' : 'success');
    window.dispatchEvent(new Event('storage'));
  };

  const available = menuData.categories.flatMap(c => c.items).filter(i => isAvailable(i.id)).length;
  const total = menuData.categories.flatMap(c => c.items).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gestion du Menu</h1>
          <p className="text-gray-500 text-sm">{available}/{total} articles disponibles</p>
        </div>
        <div className="flex gap-3">
          <span className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-bold">✅ {available} actifs</span>
          <span className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm font-bold">❌ {total - available} épuisés</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-2">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>Désactiver un article l'affiche comme <strong>"Épuisé"</strong> sur le site client. Les clients ne pourront pas le commander.</p>
      </div>

      {menuData.categories.map(cat => (
        <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 bg-gray-50 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900">{cat.icon} {cat.name}</h2>
            <span className="text-xs text-gray-400">{cat.items.filter(i => isAvailable(i.id)).length}/{cat.items.length}</span>
          </div>
          <div className="divide-y">
            {cat.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />}
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.sizes ? `${item.sizes.length} tailles · dès ` : ''}{item.price?.toLocaleString('fr-FR')} F</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isAvailable(item.id) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isAvailable(item.id) ? '● Disponible' : '● Épuisé'}
                  </span>
                  <button onClick={() => toggle(item.id)}
                    className={`w-14 h-7 rounded-full transition-all relative flex-shrink-0 ${isAvailable(item.id) ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-200 ${isAvailable(item.id) ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ACCOUNTING
// ============================================================
function AccountingAdmin() {
  const [orders, setOrders] = useState([]);
  const [manual, setManual] = useState(() => { try { return JSON.parse(localStorage.getItem('rchicken_manual_accounting') || '[]'); } catch { return []; } });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('today');
  const [form, setForm] = useState({ type: 'income', label: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('commandes').select('total, created_at, status').eq('status', 'livré');
      setOrders(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const getFiltered = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const filter = (d) => {
      const date = new Date(d);
      if (period === 'today') return date >= today;
      if (period === 'week') return date >= weekAgo;
      if (period === 'month') return date >= monthStart;
      return true;
    };
    const filteredOrders = orders.filter(o => filter(o.created_at));
    const filteredManual = manual.filter(m => filter(m.date));
    const orderIncome = filteredOrders.reduce((s, o) => s + (o.total || 0), 0);
    const manualIncome = filteredManual.filter(m => m.type === 'income').reduce((s, m) => s + (m.amount || 0), 0);
    const expenses = filteredManual.filter(m => m.type === 'expense').reduce((s, m) => s + (m.amount || 0), 0);
    return { income: orderIncome + manualIncome, expenses, orders: filteredOrders.length, profit: orderIncome + manualIncome - expenses };
  };

  const addEntry = () => {
    if (!form.label || !form.amount) return addToast('Remplissez tous les champs', 'error');
    const entry = { ...form, amount: parseFloat(form.amount), id: Date.now() };
    const updated = [entry, ...manual];
    setManual(updated);
    localStorage.setItem('rchicken_manual_accounting', JSON.stringify(updated));
    setForm({ type: 'income', label: '', amount: '', date: new Date().toISOString().split('T')[0] });
    addToast('Entrée ajoutée', 'success');
  };

  const deleteEntry = (id) => {
    const updated = manual.filter(m => m.id !== id);
    setManual(updated);
    localStorage.setItem('rchicken_manual_accounting', JSON.stringify(updated));
  };

  const { income, expenses, orders: orderCount, profit } = getFiltered();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Comptabilité</h1>
          <p className="text-gray-500 text-sm">Données réelles depuis Supabase</p>
        </div>
        <div className="flex gap-2">
          {[{k:'today',l:"Auj."},{k:'week',l:"7 jours"},{k:'month',l:"Mois"},{k:'all',l:"Tout"}].map(p => (
            <button key={p.k} onClick={() => setPeriod(p.k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${period === p.k ? 'bg-[#E4002B] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
              {p.l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenus', value: income, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: ArrowUp },
          { label: 'Dépenses', value: expenses, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: ArrowDown },
          { label: 'Bénéfice net', value: profit, color: profit >= 0 ? 'text-green-600' : 'text-red-600', bg: profit >= 0 ? 'bg-green-50' : 'bg-red-50', border: profit >= 0 ? 'border-green-100' : 'border-red-100', icon: TrendingUp },
          { label: 'Commandes livrées', value: orderCount, isCount: true, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: CheckCircle },
        ].map((kpi, i) => (
          <div key={i} className={`${kpi.bg} border ${kpi.border} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className={`text-2xl font-black ${kpi.color}`}>
              {kpi.isCount ? kpi.value : `${(kpi.value || 0).toLocaleString('fr-FR')} F`}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Add entry */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4">Ajouter une entrée</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="px-3 py-2.5 border rounded-xl text-sm focus:outline-none bg-white">
            <option value="income">💰 Recette</option>
            <option value="expense">💸 Dépense</option>
          </select>
          <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} placeholder="Description" className="px-3 py-2.5 border rounded-xl text-sm focus:outline-none lg:col-span-2" />
          <input value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} type="number" placeholder="Montant (F)" className="px-3 py-2.5 border rounded-xl text-sm focus:outline-none" />
          <button onClick={addEntry} className="bg-[#E4002B] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-[#C4001F] flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      {manual.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Historique des entrées</h2>
          </div>
          <div className="divide-y">
            {manual.slice(0, 20).map(entry => (
              <div key={entry.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{entry.label}</p>
                  <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-black text-lg ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.type === 'income' ? '+' : '-'}{(entry.amount || 0).toLocaleString('fr-FR')} F
                  </span>
                  <button onClick={() => deleteEntry(entry.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function NewAdmin() {
  const isAdmin = useAdminGuard();
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdmin) return null;

  const PAGES = {
    dashboard:  <Dashboard setActive={setActive} />,
    orders:     <OrdersAdmin />,
    kitchen:    <KitchenAdmin />,
    cashier:    <CashierAdmin />,
    menu:       <MenuAdmin />,
    accounting: <AccountingAdmin />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar active={active} setActive={setActive} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-black text-[#E4002B]">R-CHICKEN</span>
          <div className="w-10" />
        </div>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {PAGES[active]}
        </main>
      </div>
    </div>
  );
}
