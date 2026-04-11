import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Download, Calendar, Filter, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';

const monthlyRevenue = [
  { month: 'Jan', revenue: 2500000, expenses: 1200000, profit: 1300000 },
  { month: 'Fév', revenue: 2800000, expenses: 1350000, profit: 1450000 },
  { month: 'Mar', revenue: 3200000, expenses: 1500000, profit: 1700000 },
  { month: 'Avr', revenue: 3800000, expenses: 1800000, profit: 2000000 },
  { month: 'Mai', revenue: 3500000, expenses: 1650000, profit: 1850000 },
  { month: 'Jun', revenue: 4200000, expenses: 2000000, profit: 2200000 },
];

const expenseBreakdown = [
  { name: 'Ingrédients', value: 45, color: '#E4002B' },
  { name: 'Personnel', value: 25, color: '#FFB81C' },
  { name: 'Livraison', value: 12, color: '#3B82F6' },
  { name: 'Loyer', value: 10, color: '#10B981' },
  { name: 'Autres', value: 8, color: '#8B5CF6' },
];

const dailySales = [
  { day: 'Lun', sales: 185000 },
  { day: 'Mar', sales: 220000 },
  { day: 'Mer', sales: 195000 },
  { day: 'Jeu', sales: 245000 },
  { day: 'Ven', sales: 310000 },
  { day: 'Sam', sales: 380000 },
  { day: 'Dim', sales: 275000 },
];

const recentTransactions = [
  { id: 'TXN-001', type: 'revenue', desc: 'Commande CMD-001', amount: 8000, date: '05/04/2026', method: 'Orange Money' },
  { id: 'TXN-002', type: 'expense', desc: 'Achat poulet (fournisseur)', amount: -150000, date: '05/04/2026', method: 'Espèces' },
  { id: 'TXN-003', type: 'revenue', desc: 'Commande CMD-002', amount: 11000, date: '05/04/2026', method: 'Moov Money' },
  { id: 'TXN-004', type: 'revenue', desc: 'Commande CMD-004', amount: 22000, date: '05/04/2026', method: 'Orange Money' },
  { id: 'TXN-005', type: 'expense', desc: 'Salaire livreur', amount: -50000, date: '04/04/2026', method: 'Espèces' },
  { id: 'TXN-006', type: 'revenue', desc: 'Commande CMD-003', amount: 7000, date: '04/04/2026', method: 'Espèces' },
  { id: 'TXN-007', type: 'expense', desc: 'Fournitures emballage', amount: -25000, date: '04/04/2026', method: 'Espèces' },
  { id: 'TXN-008', type: 'revenue', desc: 'Commande CMD-005', amount: 2000, date: '04/04/2026', method: 'Espèces' },
];

export default function AdminAccounting() {
  const [period, setPeriod] = useState('week');

  const totalRevenue = 4200000;
  const totalExpenses = 2000000;
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Comptabilité</h1>
            <p className="text-gray-500 mt-1">Rapports financiers et analyses</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#E4002B]"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
            <button className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-green-500">
                <ArrowUpRight className="w-4 h-4" /> +15.3%
              </span>
            </div>
            <p className="text-2xl font-black text-gray-900">{totalRevenue.toLocaleString('fr-FR')}F</p>
            <p className="text-sm text-gray-500 mt-1">Chiffre d'affaires</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-red-500">
                <ArrowUpRight className="w-4 h-4" /> +8.1%
              </span>
            </div>
            <p className="text-2xl font-black text-gray-900">{totalExpenses.toLocaleString('fr-FR')}F</p>
            <p className="text-sm text-gray-500 mt-1">Dépenses</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-green-500">
                <ArrowUpRight className="w-4 h-4" /> +22.5%
              </span>
            </div>
            <p className="text-2xl font-black text-green-600">{totalProfit.toLocaleString('fr-FR')}F</p>
            <p className="text-sm text-gray-500 mt-1">Bénéfice net</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{profitMargin}%</p>
            <p className="text-sm text-gray-500 mt-1">Marge bénéficiaire</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Évolution mensuelle</h2>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v/1000000}M`} />
              <Tooltip formatter={(v) => `${v.toLocaleString('fr-FR')}F`} />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenus" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={3} />
              <Area type="monotone" dataKey="expenses" name="Dépenses" stroke="#E4002B" fill="#E4002B" fillOpacity={0.1} strokeWidth={3} />
              <Area type="monotone" dataKey="profit" name="Bénéfice" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Sales */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Ventes journalières</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip formatter={(v) => `${v.toLocaleString('fr-FR')}F`} />
                <Bar dataKey="sales" fill="#FFB81C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Répartition des dépenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg text-gray-900">Transactions récentes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Montant</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Méthode</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{tx.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.desc}</td>
                    <td className={`px-6 py-4 text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('fr-FR')}F
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.method}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
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
