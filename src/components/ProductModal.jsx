import { useState } from 'react';
import { X, ShoppingBag, Heart, Share2, Star, Minus, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export default function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const sizes = product.sizes || [
    { name: '6 Pcs', price: product.price },
    { name: '12 Pcs', price: Math.round(product.price * 1.8) },
    { name: '18 Pcs', price: Math.round(product.price * 2.5) },
    { name: '24 Pcs', price: Math.round(product.price * 3) },
  ];

  const addons = product.addons || [];
  const hasAddons = addons.length > 0;
  const hasSizes = sizes.length > 0;

  let currentPrice = selectedSize ? selectedSize.price : product.price;
  selectedAddons.forEach(addon => {
    currentPrice += addon.price;
  });

  const handleAddonToggle = (addon) => {
    if (selectedAddons.find(a => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    const selectedOptions = [];
    if (selectedSize) selectedOptions.push(selectedSize.name);
    selectedAddons.forEach(addon => selectedOptions.push(addon.name));
    
    const itemToAdd = {
      ...product,
      selectedSize: selectedSize?.name || null,
      selectedAddons: selectedAddons.map(a => a.name),
      price: currentPrice,
      quantity,
    };
    addToCart(itemToAdd);
    const optionsText = selectedOptions.length > 0 ? `(${selectedOptions.join(', ')})` : '';
    addToast(`${product.name} ${optionsText} ajouté au panier !`, 'success');
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Lien copié !', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-4 left-4 flex gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          {product.popular && (
            <div className="absolute bottom-4 left-4 bg-[#E4002B] text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              Populaire
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-black text-gray-900 mb-2">{product.name}</h2>
          
          {/* Description */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              📝 Description
            </h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
          </div>

          {/* Allergènes */}
          {product.allergens && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-bold">Allergènes:</span> {product.allergens}
              </p>
            </div>
          )}

          {/* Sélection de taille */}
          {hasSizes && (
            <div className="border-2 border-[#E4002B] rounded-xl p-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                📦 Choisissez votre taille
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedSize?.name === size.name
                        ? 'border-[#E4002B] bg-red-50'
                        : 'border-gray-200 hover:border-[#E4002B]'
                    }`}
                  >
                    <p className="font-bold text-gray-900">{size.name}</p>
                    <p className="text-sm text-gray-600">{size.description}</p>
                    <p className="text-[#E4002B] font-black">{size.price.toLocaleString('fr-FR')}F</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Addons */}
          {hasAddons && (
            <div className="border-2 border-gray-200 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                ➕ Suppléments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {addons.map((addon, index) => {
                  const isSelected = selectedAddons.find(a => a.name === addon.name);
                  return (
                    <button
                      key={index}
                      onClick={() => handleAddonToggle(addon)}
                      className={`p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-500'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-gray-900">{addon.name}</p>
                        <p className="text-green-600 font-black">+{addon.price.toLocaleString('fr-FR')}F</p>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-green-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantité */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-bold text-gray-700">Quantité</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#E4002B] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-black text-xl w-8 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#E4002B] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prix total et bouton */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total 
                {selectedAddons.length > 0 && ` (${selectedSize?.name || 'Base'} + ${selectedAddons.length} supp)`}
              </p>
              <p className="text-2xl font-black text-[#E4002B]">
                {(currentPrice * quantity).toLocaleString('fr-FR')}F
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="kfc-button text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
            >
              <ShoppingBag className="w-5 h-5" />
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}