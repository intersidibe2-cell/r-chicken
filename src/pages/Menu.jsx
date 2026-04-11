import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { menuData } from '../data/menu';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const loadProducts = () => {
      const saved = localStorage.getItem('rchicken_products');
      if (saved) {
        try {
          const parsedProducts = JSON.parse(saved);
          setProducts(parsedProducts.filter(p => p.visible !== false));
          
          const grouped = {};
          parsedProducts.filter(p => p.visible !== false).forEach(p => {
            if (!grouped[p.category]) {
              const cat = menuData.categories.find(c => c.id === p.category);
              grouped[p.category] = {
                id: p.category,
                name: cat ? cat.name : p.category,
                icon: cat ? cat.icon : '🍽️',
                items: []
              };
            }
            grouped[p.category].items.push(p);
          });
          setCategories(Object.values(grouped));
        } catch {
          loadDefaultMenu();
        }
      } else {
        loadDefaultMenu();
      }
    };

    const loadDefaultMenu = () => {
      const allProducts = menuData.categories.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.id })));
      setProducts(allProducts);
      setCategories(menuData.categories);
    };

    loadProducts();
    
    window.addEventListener('storage', loadProducts);
    return () => window.removeEventListener('storage', loadProducts);
  }, []);

  const filteredCategories =
    activeCategory === 'all'
      ? categories
      : categories.filter(c => c.id === activeCategory);

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <span className="inline-flex items-center rounded-md border border-transparent shadow mb-3 bg-[#FFB81C] text-[#1A1A1A] px-4 py-2 text-sm font-black">
            🍗 NOTRE MENU COMPLET
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
            Découvrez Notre <span className="text-[#E4002B]">Menu</span>
          </h1>
          <p className="text-lg text-gray-600 font-semibold">
            Le meilleur poulet frit de Bamako 🇲🇱
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {products.length} produits disponibles
          </p>
        </div>

        {categories.length > 0 ? (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeCategory === 'all'
                    ? 'kfc-button text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Tout ({products.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    activeCategory === cat.id
                      ? 'kfc-button text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name} ({cat.items.length})
                </button>
              ))}
            </div>

            {/* Menu Items */}
            {filteredCategories.map(category => (
              <div key={category.id} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{category.icon}</span>
                  <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900">
                    {category.name}
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {category.items.map(item => (
                    <div key={item.id} className="relative">
                      <div className="rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white border border-amber-200 h-full flex flex-col cursor-pointer">
                        <div className="relative">
                          <div className="relative overflow-hidden w-full h-32 md:h-36" style={{ aspectRatio: '400 / 300', backgroundColor: '#f3f4f6' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-opacity duration-300"
                            />
                          </div>
                          {item.popular && (
                            <span className="inline-flex items-center rounded-md border font-semibold transition-colors border-transparent bg-primary hover:bg-primary/80 absolute top-1 right-1 kfc-button text-white border-none shadow-lg text-xs px-2 py-1">
                              <Star className="w-3 h-3 mr-0.5 fill-current" />
                              Top
                            </span>
                          )}
                          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs absolute top-1 left-1 w-8 h-8 p-0 rounded-full shadow-lg bg-white/90 hover:bg-white text-gray-400 hover:text-red-500">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-3 bg-gradient-to-b from-white to-amber-50 flex-1 flex-col flex">
                          <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1 line-clamp-2 min-h-[40px] leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-base md:text-lg font-black text-[#E4002B]">
                                {item.fromPrice ? 'À partir de ' : ''}{item.price.toLocaleString('fr-FR')}F
                              </span>
                            </div>
                            <button
                              onClick={() => { addToCart(item); addToast(`${item.name} ajouté au panier !`, 'success'); }}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors bg-primary shadow hover:bg-primary/90 py-2 w-full kfc-button text-white text-xs md:text-sm h-10 md:h-11 px-3 min-w-[80px]"
                              aria-label={`Ajouter ${item.name} au panier`}
                            >
                              <ShoppingBag className="w-4 h-4 mr-1" />
                              Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Aucun produit disponible pour le moment.</p>
            <p className="text-gray-400 text-sm mt-2">Ajoutez des produits dans le panel admin.</p>
          </div>
        )}
      </div>
    </main>
  );
}