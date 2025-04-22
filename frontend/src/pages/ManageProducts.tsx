import React, { useEffect, useState } from 'react';
import { mockGetAdminProducts, mockPostAdminProducts, mockDeleteAdminProducts, mockPutAdminProducts } from '../mocks/mock';
import { Product } from '../types/types';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  ArrowPathIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  TagIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  StarIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import API from '../api';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  brand: string;
  tags: string[];
  image?: File;
  currency: string;
}

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    discountPrice: undefined,
    stock: 0,
    category: '',
    brand: '',
    tags: [],
    image: undefined,
    currency: 'USD',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('admin-token');
      if (!adminToken) {
        throw new Error('Admin authentication token not found');
      }

      // Fetch products with Authorization header
      const response = await API.get(`/products?limit=${50}`);


      if (response.data && response.data.items) {
        setProducts(response.data.items);
      } else {
        // Fallback to mock data if API response is not in expected format
        const mockResponse = await mockGetAdminProducts();
        setProducts(mockResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin products:', error);
      // Fallback to mock data if API call fails
      const mockResponse = await mockGetAdminProducts();
      setProducts(mockResponse.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('admin-token');
      if (!adminToken) {
        throw new Error('Admin authentication token not found');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price.toString());
      formData.append('currency', form.currency);
      if (form.discountPrice !== undefined) {
        formData.append('discountPrice', form.discountPrice.toString());
      }
      formData.append('stock', form.stock.toString());
      formData.append('category', form.category);
      formData.append('brand', form.brand);
      formData.append('tags', JSON.stringify(form.tags));
      if (form.image) {
        formData.append('image', form.image);
      }

      // Create product with Authorization header
      const response = await API.post('/admin/products', formData, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data) {
        // Show success notification
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
        
        // Reset form and close modal
        setForm({
          name: '',
          description: '',
          price: 0,
          discountPrice: undefined,
          stock: 0,
          category: '',
          brand: '',
          tags: [],
          image: undefined,
          currency: 'USD',
        });
        setShowEditModal(false);
        
        // Refresh products list
        await fetchProducts();
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      // Fallback to mock create if API call fails
      await mockPostAdminProducts({
        ...form,
        imageUrls: form.image ? [URL.createObjectURL(form.image)] : ['']
      });
      await fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (product: Product) => {
    setLoading(true);
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('admin-token');
      if (!adminToken) {
        throw new Error('Admin authentication token not found');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price.toString());
      formData.append('currency', form.currency);
      if (form.discountPrice !== undefined) {
        formData.append('discountPrice', form.discountPrice.toString());
      }
      formData.append('stock', form.stock.toString());
      formData.append('category', form.category);
      formData.append('brand', form.brand);
      formData.append('tags', JSON.stringify(form.tags));
      if (form.image) {
        formData.append('image', form.image);
      }

      // Update product with Authorization header
      const response = await API.put(`/admin/products/${product.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data) {
        // Show success notification
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
        
        // Reset form and close modal
        setForm({
          name: '',
          description: '',
          price: 0,
          discountPrice: undefined,
          stock: 0,
          category: '',
          brand: '',
          tags: [],
          image: undefined,
          currency: 'USD',
        });
        setShowEditModal(false);
        setEditingProduct(null);
        
        // Refresh products list
        await fetchProducts();
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      // Show error notification
      setShowSuccessNotification(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setLoading(true);
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('admin-token');
      if (!adminToken) {
        throw new Error('Admin authentication token not found');
      }

      // Delete product with Authorization header
      await API.delete(`/admin/products/${productToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      // Show success notification
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);

      // Refresh products list
      await fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      // Fallback to mock delete if API call fails
      await mockDeleteAdminProducts(productToDelete.id);
      await fetchProducts();
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
      tags: product.tags || [],
      image: undefined,
      currency: product.currency,
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      price: 0,
      discountPrice: undefined,
      stock: 0,
      category: '',
      brand: '',
      tags: [],
      image: undefined,
      currency: 'USD',
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <CheckCircleIcon className="w-6 h-6" />
            <span>Product deleted successfully!</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Product</h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="p-2 text-slate-400 hover:text-white transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <p className="text-slate-300 mb-6">
              Are you sure you want to delete "{productToDelete.name}"? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/70 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <TrashIcon className="w-5 h-5" />
                    <span>Delete</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <CubeIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Manage Products</h2>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setForm({
                name: '',
                description: '',
                price: 0,
                discountPrice: undefined,
                stock: 0,
                category: '',
                brand: '',
                tags: [],
                image: undefined,
                currency: 'USD',
              });
              setShowEditModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-6">Product List</h3>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <ArrowPathIcon className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <CubeIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">No products available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/70 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden">
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/96x96';
                              e.currentTarget.onerror = null;
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-1">{product.name}</h4>
                          <p className="text-slate-400 text-sm mb-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-400 font-semibold">
                              ${product.price.toFixed(2)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                aria-label="Edit product"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(product)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                                aria-label="Delete product"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit/Add Product Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-slate-400 hover:text-white transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="max-h-[80vh] overflow-y-auto pr-2">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Product Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CubeIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Price</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CurrencyDollarIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="number"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                          className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Discount Price (Optional)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CurrencyDollarIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="number"
                          value={form.discountPrice || ''}
                          onChange={(e) => setForm({ ...form, discountPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Stock</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingStorefrontIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TagIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter category"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Brand</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingStorefrontIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter brand"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma separated)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TagIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        value={form.tags.join(', ')}
                        onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {form.image && (
                      <div className="mt-2">
                        <img 
                          src={URL.createObjectURL(form.image)} 
                          alt="Preview" 
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>

              <div className="flex justify-end space-x-4 pt-4 mt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/70 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editingProduct) {
                      handleUpdate({ ...editingProduct, ...form });
                    } else {
                      handleCreate();
                    }
                    handleCloseModal();
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      {editingProduct ? (
                        <>
                          <PencilIcon className="w-5 h-5" />
                          <span>Update Product</span>
                        </>
                      ) : (
                        <>
                          <PlusIcon className="w-5 h-5" />
                          <span>Add Product</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;