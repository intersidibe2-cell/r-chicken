import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Minus, Trash2, Printer, CreditCard, Banknote, Smartphone, X, Check, Clock, ShoppingBag } from 'lucide-react';
import { menuData } from '../../data/menu';

export default function Cashier() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    const allProducts = menuData.categories.flatMap(cat => 
      cat.items.map(item => ({ ...item, category: cat.id, categoryName: cat.name }))
    );
    setProducts(allProducts);
    setCategories(menuData.categories);
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  const generateOrderId = () => {
    const date = new Date();
    return `POS-${date.getDate()}${date.getMonth() + 1}${date.getFullYear().toString().slice(-2)}-${Date.now().toString().slice(-4)}`;
  };

  const handlePayment = () => {
    const order = {
      id: generateOrderId(),
      items: [...cart],
      total: totalAmount,
      paymentMethod,
      customerName: customerName || 'Client sur place',
      customerPhone,
      date: new Date().toISOString(),
      status: 'livré',
      type: 'caisse'
    };

    // Save to localStorage
    const orders = JSON.parse(localStorage.getItem('rchicken_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('rchicken_orders', JSON.stringify(orders));

    setLastOrder(order);
    setShowPaymentModal(false);
    setShowSuccessModal(true);
    clearCart();
  };

  const printReceipt = () => {
    if (!lastOrder) return;
    
    const receiptContent = `
╔════════════════════════════════════╗
║        🍗 R-CHICKEN                ║
║    Baco-djicoroni Golf, Bamako    ║
║        Tél: +223 83 80 61 29      ║
╠════════════════════════════════════╣
║ N° Commande: ${lastOrder.id.padEnd(20)}║
║ Date: ${new Date(lastOrder.date).toLocaleString('fr-FR').padEnd(25)}║
╠════════════════════════════════════╣
${lastOrder.items.map(item => `║ ${item.quantity}x ${item.name.padEnd(20)} ${(item.price * item.quantity).toLocaleString('fr-FR')}F`).join('\n')}
╠════════════════════════════════════╣
║ TOTAL: ${lastOrder.total.toLocaleString('fr-FR').padEnd(28)}F
╠════════════════════════════════════╣
║ Paiement: ${lastOrder.paymentMethod === 'cash' ? 'Espèces' : lastOrder.paymentMethod === 'om' ? 'Orange Money' : 'Wave'}
╠════════════════════════════════════╣
║     Merci et à bientôt ! 🍗       ║
╚════════════════════════════════════╝
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket R-CHICKEN</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; padding: 20px; }
            pre { margin: 0; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${receiptContent}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const startNewOrder = () => {
    setShowSuccessModal(false);
    setLastOrder(null);
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-4">
        {/* Products Section */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-black text-gray-900">🧾 Caisse</h1>
            <p className="text-gray-500 text-sm">Saisie rapide des commandes</p>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === 'all' ? 'kfc-button text-white' : 'bg-white border border-gray-200'
              }`}
            >
              Tout
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeCategory === cat.id ? 'kfc-button text-white' : 'bg-white border border-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-xl p-3 text-left hover:shadow-lg transition-all hover:scale-105 border border-gray-100 active:scale-95"
                >
                  <div className="w-full h-20 bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-bold text-xs text-gray-900 line-clamp-2 min-h-[32px]">{product.name}</p>
                  <p className="text-[#E4002B] font-black text-sm mt-1">
                    {product.price.toLocaleString('fr-FR')}F
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-full lg:w-96 bg-white rounded-2xl shadow-lg flex flex-col h-full">
          {/* Cart Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#E4002B]" />
                Commande en cours
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-500 text-sm font-medium hover:text-red-700"
                >
                  Vider
                </button>
              )}
            </div>
            
            {/* Customer Info (optional) */}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nom client (optionnel)"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="Téléphone"
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Ajoutez des produits</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-[#E4002B] font-bold text-sm">
                        {(item.price * item.quantity).toLocaleString('fr-FR')}F
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center hover:bg-red-200 ml-1"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-black text-[#E4002B]">
                {totalAmount.toLocaleString('fr-FR')}F
              </span>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
              className="w-full kfc-button text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Payer maintenant
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Paiement</h2>
              <button onClick={() => setShowPaymentModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-500 text-sm mb-1">Total à payer</p>
              <p className="text-3xl font-black text-[#E4002B]">{totalAmount.toLocaleString('fr-FR')}F</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === 'cash' ? 'border-[#E4002B] bg-red-50' : 'border-gray-200'
                }`}
              >
                <Banknote className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <p className="font-bold">Espèces</p>
                  <p className="text-xs text-gray-500">Paiement en cash</p>
                </div>
                {paymentMethod === 'cash' && <Check className="w-5 h-5 text-[#E4002B] ml-auto" />}
              </button>

              <button
                onClick={() => setPaymentMethod('om')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === 'om' ? 'border-[#FF6600] bg-orange-50' : 'border-gray-200'
                }`}
              >
                <Smartphone className="w-8 h-8 text-[#FF6600]" />
                <div className="text-left">
                  <p className="font-bold">Orange Money</p>
                  <p className="text-xs text-gray-500">Paiement mobile</p>
                </div>
                {paymentMethod === 'om' && <Check className="w-5 h-5 text-[#FF6600] ml-auto" />}
              </button>

              <button
                onClick={() => setPaymentMethod('wave')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === 'wave' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <Smartphone className="w-8 h-8 text-blue-500" />
                <div className="text-left">
                  <p className="font-bold">Wave</p>
                  <p className="text-xs text-gray-500">Paiement mobile</p>
                </div>
                {paymentMethod === 'wave' && <Check className="w-5 h-5 text-blue-500 ml-auto" />}
              </button>
            </div>

            <button
              onClick={handlePayment}
              className="w-full kfc-button text-white py-4 rounded-xl font-bold text-lg"
            >
              <Check className="w-5 h-5 inline mr-2" />
              Confirmer le paiement
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && lastOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</h2>
            <p className="text-gray-500 mb-4">Commande {lastOrder.id}</p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="font-bold text-lg text-[#E4002B] mb-2">
                {lastOrder.total.toLocaleString('fr-FR')}F
              </p>
              <p className="text-sm text-gray-600">
                {lastOrder.items.reduce((sum, i) => sum + i.quantity, 0)} articles
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={printReceipt}
                className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Imprimer
              </button>
              <button
                onClick={startNewOrder}
                className="flex-1 kfc-button text-white py-3 rounded-xl font-bold"
              >
                Nouvelle commande
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}