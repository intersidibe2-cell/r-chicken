import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Download, Bell, User, ShoppingBag, Receipt, Tag, House, UtensilsCrossed, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/', icon: House },
    { name: 'Menu', path: '/menu', icon: UtensilsCrossed },
    { name: 'Commandes', path: '/orders', icon: Receipt },
    { name: 'Promos', path: '/promotions', icon: Tag },
  ];

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1A1A1A] via-[#2D0A0A] to-[#1A1A1A] border-b-4 border-[#E4002B] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2 border-b border-white/10"></div>
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 md:gap-4 group" aria-label="R-CHICKEN - Accueil">
              <div>
                <img
                  src="https://i.postimg.cc/ZqqPkfws/Gemini-Generated-Image-v9q21uv9q21uv9q2.png"
                  alt="Logo R-CHICKEN"
                  className="h-14 md:h-16 w-auto object-contain"
                  loading="eager"
                />
              </div>
              <div className="relative">
                <h1 className="text-xl md:text-3xl font-black text-white tracking-tight drop-shadow-lg">
                  R-CHICKEN
                  <span className="absolute -top-1 -right-1 text-xs md:text-sm text-[#FFB81C]">★</span>
                </h1>
                <p className="text-xs md:text-base text-[#FFB81C] font-black tracking-wide">
                  Le Poulet Croustillant Malien
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button 
                className="items-center justify-center gap-2 whitespace-nowrap transition-colors h-10 rounded-md px-4 text-xs border-2 border-[#FFB81C] bg-gradient-to-r from-amber-50 to-orange-50 text-[#E4002B] hover:bg-[#FFB81C] hover:text-white font-bold shadow-md hidden md:flex btn-touch"
                aria-label="Installer l'application mobile"
              >
                <Download className="w-4 h-4 mr-2" />
                Installer l'App
              </button>

              <nav className="hidden md:flex items-center gap-2" aria-label="Navigation principale">
                {navLinks.map(link => (
                  <Link key={link.path} to={link.path}>
                    <button 
                      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-5 py-2 ${
                        location.pathname === link.path
                          ? 'text-white bg-white/10'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.name}
                    </button>
                  </Link>
                ))}

                <Link to="/cart">
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors bg-primary shadow hover:bg-primary/90 h-10 relative kfc-button text-white font-bold px-6 ml-2 btn-touch"
                    style={{ animation: 'pulse-glow 2s ease infinite' }}
                    aria-label={`Panier - ${totalItems} article${totalItems !== 1 ? 's' : ''}`}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    <span className="font-black">PANIER</span>
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#FFB81C] text-[#1A1A1A] text-xs font-black rounded-full w-6 h-6 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </Link>
              </nav>

              <button 
                className="inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors text-gray-300 hover:text-white hover:bg-white/10 btn-touch"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>

              <Link to="/profile">
                <button 
                  className="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2 btn-touch"
                  aria-label="Mon profil"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">Profil</span>
                </button>
              </Link>
              <Link to="/admin">
                <button 
                  className="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-[#E4002B] hover:bg-[#C4001F] text-white flex items-center gap-2 btn-touch shadow-lg"
                  aria-label="Panneau d'administration"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden md:inline font-bold">Admin</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] border-t-4 border-[#E4002B] shadow-2xl pb-safe" aria-label="Navigation principale">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          <Link to="/" className="flex flex-col items-center">
            <button 
              className={`min-h-[56px] px-2 w-full flex flex-col items-center justify-center gap-1 rounded-md transition-colors ${
                location.pathname === '/' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Page d'accueil"
            >
              <House className="w-6 h-6" />
              <span className="text-[10px] font-bold">Accueil</span>
            </button>
          </Link>
          <Link to="/menu" className="flex flex-col items-center">
            <button 
              className={`min-h-[56px] px-2 w-full flex flex-col items-center justify-center gap-1 rounded-md transition-colors ${
                location.pathname === '/menu' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Voir le menu"
            >
              <UtensilsCrossed className="w-6 h-6" />
              <span className="text-[10px] font-bold">Menu</span>
            </button>
          </Link>
          <Link to="/cart" className="flex flex-col items-center -mt-5">
            <button
              className="w-[60px] h-[60px] rounded-full kfc-button text-white shadow-2xl flex flex-col items-center justify-center gap-0.5 relative border-4 border-white"
              style={{ animation: 'pulse-glow 2s ease infinite' }}
              aria-label={`Panier - ${totalItems} article${totalItems !== 1 ? 's' : ''}`}
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="text-[9px] font-black">PANIER</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFB81C] text-[#1A1A1A] text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </Link>
          <Link to="/orders" className="flex flex-col items-center">
            <button 
              className={`min-h-[56px] px-2 w-full flex flex-col items-center justify-center gap-1 rounded-md transition-colors ${
                location.pathname === '/orders' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Mes commandes"
            >
              <Receipt className="w-6 h-6" />
              <span className="text-[10px] font-bold">Commandes</span>
            </button>
          </Link>
          <Link to="/promotions" className="flex flex-col items-center">
            <button 
              className={`min-h-[56px] px-2 w-full flex flex-col items-center justify-center gap-1 rounded-md transition-colors ${
                location.pathname === '/promotions' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Promotions"
            >
              <Tag className="w-6 h-6" />
              <span className="text-[10px] font-bold">Promos</span>
            </button>
          </Link>
        </div>
      </nav>
    </>
  );
}
