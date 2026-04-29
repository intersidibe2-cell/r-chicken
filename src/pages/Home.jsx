import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, ArrowRight, Clock, ChefHat, Truck,
  Gift, Star, Heart, Phone, MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { menuData } from '../data/menu';

const MENU_VERSION = '6.0';

export default function Home() {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const loadBestSellers = () => {
      const savedVersion = localStorage.getItem('rchicken_menu_version');
      const saved = localStorage.getItem('rchicken_products');
      
      if (savedVersion !== MENU_VERSION || !saved) {
        localStorage.setItem('rchicken_menu_version', MENU_VERSION);
        localStorage.removeItem('rchicken_products');
        setBestSellers(menuData.categories.flatMap(c => c.items).slice(0, 6));
        return;
      }
      
      try {
        const products = JSON.parse(saved).filter(p => p.visible !== false);
        setBestSellers(products.slice(0, 6));
      } catch {
        setBestSellers(menuData.categories.flatMap(c => c.items).slice(0, 6));
      }
    };

    loadBestSellers();
    window.addEventListener('storage', loadBestSellers);
    return () => window.removeEventListener('storage', loadBestSellers);
  }, []);

  return (
    <main className="min-h-[calc(100vh-5rem)] pb-20 md:pb-0">
      <div className="pb-20 md:pb-0 bg-white">
        {/* Construction Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-4 text-center border-b-4 border-yellow-400 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl font-black mb-1">🚧 SITE EN CONSTRUCTION 🚧</p>
            <p className="text-sm md:text-base font-bold mb-2">Lancement prévu très bientôt ! Restez connectés 🎉</p>
            <p className="text-sm md:text-base">
              📞 Pour vos commandes : <a href="tel:+22374908709" className="underline font-black hover:text-yellow-300">+223 74 90 87 09</a>
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[600px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f949d4d809a1ce10488916/867f38544_Gemini_Generated_Image_75u33s75u33s75u3.png)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50" />
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-2xl text-white text-center">
              <span className="inline-flex items-center rounded-md border border-transparent hover:bg-primary/80 mb-2 md:mb-3 bg-[#FFB81C] text-[#1A1A1A] px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-black shadow-lg">
                🔥 AUTHENTIQUE POULET MALIEN
              </span>
              <h1 className="text-2xl md:text-6xl font-black mb-3 md:mb-5 leading-tight drop-shadow-2xl">
                C'EST BON C'EST R-CHICKEN
              </h1>
              <p className="text-base md:text-2xl mb-4 md:mb-6 font-bold drop-shadow-lg">
                Le Meilleur Poulet Frit de Bamako 🇲🇱
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                <Link to="/menu">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors bg-primary hover:bg-primary/90 h-10 rounded-md kfc-button text-white px-5 py-4 md:px-8 md:py-6 text-base md:text-lg font-black shadow-2xl">
                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    COMMANDER
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                  </button>
                </Link>
                <Link to="/menu">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors shadow-sm h-10 rounded-md bg-white border-2 md:border-3 border-[#E4002B] text-[#E4002B] hover:bg-[#E4002B] hover:text-white px-5 py-4 md:px-8 md:py-6 text-base md:text-lg font-black">
                    VOIR LE MENU
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-br from-[#E4002B] to-[#C4001F] py-6 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-4 md:gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white mb-3 md:mb-4 shadow-xl">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-[#E4002B]" />
                </div>
                <h3 className="text-base md:text-xl font-black text-white mb-1 md:mb-2">Livraison Rapide</h3>
                <p className="text-sm md:text-base text-white font-semibold">30-45 minutes</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white mb-3 md:mb-4 shadow-xl">
                  <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-[#E4002B]" />
                </div>
                <h3 className="text-base md:text-xl font-black text-white mb-1 md:mb-2">Poulet Frais</h3>
                <p className="text-sm md:text-base text-white font-semibold">Croustillant</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white mb-3 md:mb-4 shadow-xl">
                  <Truck className="w-6 h-6 md:w-8 md:h-8 text-[#E4002B]" />
                </div>
                <h3 className="text-base md:text-xl font-black text-white mb-1 md:mb-2">Livraison Gratuite</h3>
                <p className="text-sm md:text-base text-white font-semibold">Dès 20 000 FCFA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Promotions Section */}
        <div className="bg-gradient-to-br from-[#FFB81C] to-[#E4002B] py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4">
              <Gift className="w-5 h-5" />
              <span className="text-sm font-bold">PROMOTIONS EXCLUSIVES</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
              Gagnez de l'Argent en Commandant !
            </h2>
            <p className="text-base md:text-xl text-white mb-6">
              Points de fidélité, parrainage, codes promo et bien plus...
            </p>
            <Link to="/promotions">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors h-10 rounded-md bg-white text-[#E4002B] hover:bg-gray-100 px-8 py-5 text-lg font-black shadow-2xl">
                DÉCOUVRIR TOUTES LES OFFRES
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="bg-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 md:mb-10">
              <span className="inline-flex items-center rounded-md border border-transparent shadow hover:bg-primary/80 mb-2 md:mb-3 bg-[#FFB81C] text-[#1A1A1A] px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-black">
                ⭐ NOS BEST-SELLERS
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 md:mb-3">
                Découvrez Nos Produits Phares
              </h2>
              <p className="text-base md:text-xl text-gray-600 font-semibold">
                Les favoris de nos clients !
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 max-w-6xl mx-auto">
              {bestSellers.map(item => (
                <div key={item.id} className="relative">
                  <div className="rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border border-amber-200 h-full flex flex-col cursor-pointer">
                    <div className="relative">
                      <div className="relative overflow-hidden w-full h-28 md:h-36" style={{ aspectRatio: '400 / 300', backgroundColor: '#f3f4f6' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-opacity duration-300"
                        />
                      </div>
                      <span className="inline-flex items-center rounded-md font-semibold transition-colors border-transparent bg-primary hover:bg-primary/80 absolute top-1 right-1 kfc-button text-white border-none shadow-lg text-xs px-2 py-1">
                        <Star className="w-3 h-3 mr-0.5 fill-current" />
                        Top
                      </span>
                      <button 
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs absolute top-1 left-1 w-10 h-10 p-0 rounded-full shadow-lg bg-white/90 hover:bg-white text-gray-400 hover:text-red-500"
                        aria-label="Ajouter aux favoris"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-2 md:p-3 bg-gradient-to-b from-white to-amber-50 flex-1 flex-col flex">
                      <h3 className="font-bold text-xs md:text-base text-gray-900 mb-1 line-clamp-2 min-h-[32px] md:min-h-[40px] leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1 hidden md:block">
                        {item.description}
                      </p>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm md:text-lg font-black text-[#E4002B]">
                          {item.fromPrice ? 'À partir de ' : ''}{((item.price ?? 0)).toLocaleString('fr-FR')}F
                          </span>
                        </div>
                        <Link to="/menu">
                          <button className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md font-bold transition-colors bg-primary shadow hover:bg-primary/90 py-2 md:py-3 w-full kfc-button text-white text-sm md:text-sm h-10 md:h-9 px-2">
                            <ShoppingBag className="w-4 h-4" />
                            Voir
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6 md:mt-8">
              <Link to="/menu">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors bg-primary shadow hover:bg-primary/90 h-10 rounded-md kfc-button text-white px-6 py-4 md:px-8 md:py-6 text-base md:text-lg font-black">
                  VOIR TOUT LE MENU
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Restaurant Location */}
        <div className="bg-white py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-black text-gray-900">📍 Notre Restaurant</h2>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center border-2 border-amber-200 mb-4 max-w-md mx-auto">
              <p className="font-bold text-lg">🏪 Baco-djicoroni Golf</p>
              <p className="text-sm text-gray-700 mt-1">📍 HXGV+5X7, Bamako, Mali</p>
              <a
                href="https://maps.google.com/?q=HXGV+5X7,Bamako,Mali"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-blue-600 hover:text-blue-800 font-semibold mt-2"
              >
                🗺️ Voir sur Google Maps
              </a>
              <p className="text-xs text-green-600 font-bold mt-2">🕐 Ouvert 24h/24 - 7j/7</p>
            </div>
            <a href="tel:+22383806129" className="block">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors shadow h-9 px-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg">
                📞 Appeler : +223 83 80 61 29
              </button>
            </a>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gradient-to-b from-amber-50 to-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                ⭐ Ce que disent nos clients
              </h2>
              <p className="text-gray-600">Plus de 10 000 clients satisfaits à Bamako</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Le meilleur poulet frit de Bamako ! Livraison rapide et toujours chaud. Ma famille adore la Box Famille !"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600">
                    MD
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Moussa D.</p>
                    <p className="text-xs text-gray-500">Baco-djicoroni • Client fidèle</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Commande via WhatsApp super facile ! Le livreur est arrivé en 25 min. Je recommande la Box S Solo, elle est top !"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center font-bold text-pink-600">
                    FT
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Fatoumata T.</p>
                    <p className="text-xs text-gray-500">Hippodrome • 15 commandes</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Je commande toujours pour le bureau. La Box XXL Party est parfaite pour nos réunions. Prix imbattables !"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    IK
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Ibrahim K.</p>
                    <p className="text-xs text-gray-500">Badalabougou • 28 commandes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#E4002B]">10K+</p>
                <p className="text-sm text-gray-600">Clients satisfaits</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#E4002B]">4.9</p>
                <p className="text-sm text-gray-600">Note moyenne ⭐</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#E4002B]">25</p>
                <p className="text-sm text-gray-600">Min livraison</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#E4002B] to-[#C4001F] py-8 md:py-16 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255, 255, 255, 0.1) 50px, rgba(255, 255, 255, 0.1) 100px)' }}
          />
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div>
              <h2 className="text-2xl md:text-5xl font-black text-white mb-3 md:mb-6">
                Prêt à Déguster ?
              </h2>
              <p className="text-base md:text-2xl text-white mb-6 md:mb-8 font-bold">
                Commandez maintenant et recevez votre repas en 30-45 minutes ! 🚀
              </p>
              <Link to="/menu">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none h-10 rounded-md bg-white text-[#E4002B] hover:bg-gray-100 px-8 py-5 md:px-12 md:py-7 text-base md:text-2xl font-black shadow-2xl hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 mr-2" />
                  COMMANDER MAINTENANT
                  <ArrowRight className="w-6 h-6 md:w-8 md:h-8 ml-2" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
