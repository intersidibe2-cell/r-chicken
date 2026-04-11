import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
  TrendingUp, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, XCircle, Truck, Phone, FileText, Shield, Gift,
  Star, DollarSign, Box, LayoutGrid, Award, Ticket, ChefHat, Truck as DeliveryIcon,
  MapPin, Settings
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const weeklyRevenue = [
  { day: 'Lun', revenue: 85000, orders: 12 },
  { day: 'Mar', revenue: 120000, orders: 18 },
  { day: 'Mer', revenue: 95000, orders: 14 },
  { day: 'Jeu', revenue: 145000, orders: 22 },
  { day: 'Ven', revenue: 180000, orders: 28 },
  { day: 'Sam', revenue: 220000, orders: 35 },
  { day: 'Dim', revenue: 165000, orders: 24 },
];

const categorySales = [
  { name: 'Boxes', value: 35, color: '#E4002B' },
  { name: 'Poulet', value: 28, color: '#FFB81C' },
  { name: 'Sandwichs', value: 18, color: '#3B82F6' },
  { name: 'Boissons', value: 12, color: '#10B981' },
  { name: 'Desserts', value: 7, color: '#8B5CF6' },
];

const paymentStats = [
  { name: 'Orange Money', value: 45, color: '#FF6600' },
  { name: 'Moov Money', value: 25, color: '#0066CC' },
  { name: 'Espèces', value: 30, color: '#10B981' },
];

const recentOrders = [
  { id: 'CMD-001', client: 'Moussa Diallo', total: 8500, status: 'livré', method: 'Orange Money', time: '14:30' },
  { id: 'CMD-002', client: 'Fatoumata Traoré', total: 15000, status: 'en cours', method: 'Moov Money', time: '15:15' },
  { id: 'CMD-003', client: 'Ibrahim Keita', total: 6000, status: 'en attente', method: 'Espèces', time: '15:45' },
  { id: 'CMD-004', client: 'Aminata Coulibaly', total: 22000, status: 'livré', method: 'Orange Money', time: '16:00' },
  { id: 'CMD-005', client: 'Oumar Touré', total: 3500, status: 'annulé', method: 'Espèces', time: '16:20' },
];

export default function AdminDashboard() {
  const [isOpen] = useState(true);

  const stats = [
    {
      title: "Chiffre d'affaires",
      value: '1 010 000F',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Commandes',
      value: '153',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Clients actifs',
      value: '89',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Produits vendus',
      value: '412',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'livré': 'bg-green-100 text-green-700',
      'en cours': 'bg-blue-100 text-blue-700',
      'en attente': 'bg-yellow-100 text-yellow-700',
      'annulé': 'bg-red-100 text-red-700',
    };
    const icons = {
      'livré': CheckCircle,
      'en cours': Truck,
      'en attente': Clock,
      'annulé': XCircle,
    };
    const Icon = icons[status] || Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de votre restaurant</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div key={stat.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`inline-flex items-center gap-1 text-sm font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Actions Rapides */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">⚡ Actions Rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/orders" className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <Phone className="w-8 h-8 mb-2" />
              <p className="font-bold">Commande WhatsApp</p>
              <p className="text-xs text-white/70">Enregistrer commande</p>
            </Link>
            <Link to="/admin/orders" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <FileText className="w-8 h-8 mb-2" />
              <p className="font-bold">Toutes Commandes</p>
              <p className="text-xs text-white/70">Voir toutes</p>
            </Link>
            <Link to="/admin/clients" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <Users className="w-8 h-8 mb-2" />
              <p className="font-bold">Clients</p>
              <p className="text-xs text-white/70">16 clients</p>
            </Link>
            <Link to="/admin/employees" className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <Shield className="w-8 h-8 mb-2" />
              <p className="font-bold">Accès Employés</p>
              <p className="text-xs text-white/70">Gérer les rôles</p>
            </Link>
            <Link to="/admin/promotions" className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <Gift className="w-8 h-8 mb-2" />
              <p className="font-bold">Codes Promo</p>
              <p className="text-xs text-white/70">Créer/gérer codes</p>
            </Link>
            <Link to="/admin/loyalty" className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <Star className="w-8 h-8 mb-2" />
              <p className="font-bold">Points Fidélité</p>
              <p className="text-xs text-white/70">Ajuster points</p>
            </Link>
            <Link to="/admin/accounting" className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <DollarSign className="w-8 h-8 mb-2" />
              <p className="font-bold">Comptabilité</p>
              <p className="text-xs text-white/70">Code requis</p>
            </Link>
            <Link to="/admin/inventory" className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <Box className="w-8 h-8 mb-2" />
              <p className="font-bold">Inventaire</p>
              <p className="text-xs text-white/70">Stocks</p>
            </Link>
            <Link to="/admin/products" className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <LayoutGrid className="w-8 h-8 mb-2" />
              <p className="font-bold">Produits</p>
              <p className="text-xs text-white/70">Gérer menu</p>
            </Link>
            <Link to="/admin/featured" className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <Award className="w-8 h-8 mb-2" />
              <p className="font-bold">Ordre Phares</p>
              <p className="text-xs text-white/70">Réorganiser phares</p>
            </Link>
            <Link to="/admin/kitchen" className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <ChefHat className="w-8 h-8 mb-2" />
              <p className="font-bold">Écran Cuisine</p>
              <p className="text-xs text-white/70">Commandes en cours</p>
            </Link>
            <Link to="/admin/delivery" className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-4 text-white hover:scale-105 transition-transform shadow-lg">
              <MapPin className="w-8 h-8 mb-2" />
              <p className="font-bold">Zones Livraison</p>
              <p className="text-xs text-white/70">Gérer zones</p>
            </Link>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Chiffre d'affaires hebdomadaire</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip formatter={(v) => `${v.toLocaleString('fr-FR')}F`} />
                <Line type="monotone" dataKey="revenue" stroke="#E4002B" strokeWidth={3} dot={{ fill: '#E4002B' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Commandes par jour</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="orders" fill="#FFB81C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category & Payment Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category Sales */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Ventes par catégorie</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Méthodes de paiement</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg text-gray-900">Commandes récentes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">N° Commande</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Montant</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Paiement</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Statut</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.client}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#E4002B]">{order.total.toLocaleString('fr-FR')}F</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.method}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
