import { useState, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  Plus, Edit, Trash2, Search, X, Save, Image,
  Eye, EyeOff, Upload, Camera, XCircle
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { menuData } from '../../data/menu';

export default function AdminProducts() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('rchicken_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return menuData.categories.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.id, visible: true })));
      }
    }
    return menuData.categories.flatMap(cat => cat.items.map(item => ({ ...item, category: cat.id, visible: true })));
  });

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'boxes',
    popular: false,
    fromPrice: false,
  });

  const categories = menuData.categories;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const saveProductsToStorage = (newProducts) => {
    localStorage.setItem('rchicken_products', JSON.stringify(newProducts));
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        category: product.category,
        popular: product.popular,
        fromPrice: product.fromPrice || false,
      });
      setPreviewImage(product.image);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'boxes',
        popular: false,
        fromPrice: false,
      });
      setPreviewImage(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setPreviewImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      image: formData.image || previewImage || 'https://i.postimg.cc/L8TgrJqG/Gemini-Generated-Image-bvrtv6bvrtv6bvrt.png',
      category: formData.category,
      popular: formData.popular,
      fromPrice: formData.fromPrice,
      visible: editingProduct ? editingProduct.visible : true,
    };

    let newProducts;
    if (editingProduct) {
      newProducts = products.map(p => p.id === editingProduct.id ? productData : p);
    } else {
      newProducts = [...products, productData];
    }

    setProducts(newProducts);
    saveProductsToStorage(newProducts);
    closeModal();
  };

  const deleteProduct = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      saveProductsToStorage(newProducts);
    }
  };

  const toggleVisibility = (id) => {
    const newProducts = products.map(p => p.id === id ? { ...p, visible: !p.visible } : p);
    setProducts(newProducts);
    saveProductsToStorage(newProducts);
  };

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : catId;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Gestion des Produits</h1>
            <p className="text-gray-500 mt-1">{products.length} produits au total</p>
          </div>
          <button
            onClick={() => openModal()}
            className="kfc-button text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter un produit
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B] focus:ring-1 focus:ring-[#E4002B]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B] bg-white"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Produit</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Catégorie</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Prix</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Populaire</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Visible</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        />
                        <div>
                          <p className="font-bold text-sm text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getCategoryName(product.category)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#E4002B]">
                      {product.fromPrice ? 'À partir de ' : ''}{product.price.toLocaleString('fr-FR')}F
                    </td>
                    <td className="px-6 py-4">
                      {product.popular && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">⭐ Top</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleVisibility(product.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          product.visible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}
                        title={product.visible ? 'Visible' : 'Masqué'}
                      >
                        {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-black text-gray-900">
                  {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                </h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Photo du produit</label>
                  
                  {previewImage ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                        isDragActive 
                          ? 'border-[#E4002B] bg-red-50' 
                          : 'border-gray-300 hover:border-[#E4002B] hover:bg-gray-50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-700">
                            {isDragActive ? 'Déposez l\'image ici' : 'Cliquez ou glissez une image'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            PNG, JPG ou WEBP (max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nom du produit</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                    placeholder="Ex: Box Solo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B] resize-none"
                    placeholder="Description du produit..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Prix (FCFA)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                      placeholder="3500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B] bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={e => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 text-[#E4002B] rounded"
                    />
                    <span className="text-sm font-medium">Produit populaire</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.fromPrice}
                      onChange={e => setFormData({ ...formData, fromPrice: e.target.checked })}
                      className="w-4 h-4 text-[#E4002B] rounded"
                    />
                    <span className="text-sm font-medium">Prix "À partir de"</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 kfc-button text-white px-4 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingProduct ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
