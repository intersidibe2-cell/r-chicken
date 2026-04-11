import { useState } from 'react';
import { X, ShoppingBag, Heart, Share2, Star, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export default function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
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

  const currentPrice = selectedSize ? selectedSize.price : product.price;

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      selectedSize: selectedSize?.name || null,
      price: currentPrice,
      quantity,
    };
    addToCart(itemToAdd);
    addToast(`${product.name} (${selectedSize?.name || '1'}) ajouté au panier !`, 'success');
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
          <div className="border-2 border-[#E4002B] rounded-xl p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              📦 Choisissez votre taille
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedSize?.name === size.name
                      ? 'border-[#E4002B] bg-red-50'
                      : 'border-gray-200 hover:border-[#E4002B]'
                  }`}
                >
                  <p className="font-bold text-gray-900">{size.name}</p>
                  <p className="text-[#E4002B] font-black">{size.price.toLocaleString('fr-FR')}F</p>
                </button>
              ))}
            </div>
          </div>

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
              <p className="text-sm text-gray-500">Total</p>
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