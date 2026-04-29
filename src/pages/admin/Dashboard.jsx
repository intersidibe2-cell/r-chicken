import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ChefHat, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../../supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, uniqueClients: 0, todayRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('commandes').select('*').then(({ data, error }) => {
      console.log('Dashboard data:', data, error);
      const commandes = data || [];
      if (Array.isArray(commandes) && commandes.length > 0) {
        const total = commandes.reduce((s, c) => s + (c.total || 0), 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayData = commandes.filter(c => new Date(c.created_at) >= today);
        setStats({
          totalRevenue: total,
          totalOrders: commandes.length,
          uniqueClients: new Set(commandes.map(c => c.client_phone)).size,
          todayRevenue: todayData.reduce((s, c) => s + (c.total || 0), 0)
        });
      }
      setLoading(false);
    }).catch(err => {
      console.error('Dashboard error:', err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-[#E4002B] mb-8">Admin R-CHICKEN</h1>
        
        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl shadow">
                <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-2xl font-black">{((stats.totalRevenue ?? 0)).toLocaleString()}F</p>
                <p className="text-sm text-gray-500">Total CA</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow">
                <ShoppingCart className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-2xl font-black">{stats.totalOrders}</p>
                <p className="text-sm text-gray-500">Commandes</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow">
                <Users className="w-8 h-8 text-purple-500 mb-2" />
                <p className="text-2xl font-black">{stats.uniqueClients}</p>
                <p className="text-sm text-gray-500">Clients</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-2xl font-black text-green-600">{((stats.todayRevenue ?? 0).toLocaleString())}F</p>
                <p className="text-sm text-gray-500">Aujourd'hui</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/orders" className="block bg-blue-500 hover:bg-blue-600 p-6 rounded-2xl text-white transition">
                <ShoppingCart className="w-12 h-12 mb-2" />
                <p className="font-bold text-xl">Commandes</p>
                <p className="text-sm opacity-80">Gérer les commandes</p>
              </Link>
              
              <Link to="/admin/kitchen" className="block bg-green-500 hover:bg-green-600 p-6 rounded-2xl text-white transition">
                <ChefHat className="w-12 h-12 mb-2" />
                <p className="font-bold text-xl">Cuisine</p>
                <p className="text-sm opacity-80">Écran cuisine</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
