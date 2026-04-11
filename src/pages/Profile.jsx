import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, ShoppingCart, Settings, LogOut, ChevronRight, Smartphone } from 'lucide-react';

export default function Profile() {
  const [user] = useState(null);

  const menuItems = [
    { name: 'Mes commandes', icon: ShoppingCart, path: '/orders' },
    { name: 'Mes favoris', icon: Package, path: '/menu' },
  ];

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* User info or login prompt */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#E4002B] rounded-full flex items-center justify-center text-white font-black text-xl">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">{user.name || 'Utilisateur'}</h2>
                <p className="text-gray-500 text-sm">{user.phone || '+223 ...'}</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-black text-gray-700">Guest</h2>
              <p className="text-gray-500 text-sm">Visiteur</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="bg-white rounded-xl shadow p-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-bold text-gray-900">{item.name}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
          <Link
            to="/admin"
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E4002B] rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Administration</span>
                <span className="text-xs text-gray-500">Gérer le restaurant</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/mobile-preview"
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Version Mobile</span>
                <span className="text-xs text-gray-500">Aperçu mobile</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          
          <button className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <span className="font-bold text-red-600">Déconnexion</span>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}