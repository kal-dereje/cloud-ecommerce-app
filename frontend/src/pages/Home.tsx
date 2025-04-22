import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/types';
import { getMockProducts } from '../mocks/mock';
import API from '../api';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to fetch from API first
        const response = await API.get('/products/popular');
        if (response.data && response.data.items) {
          // Transform the API response to match the Product type
          const transformedProducts = response.data.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            stock: item.stock,
            category: item.category,
            isActive: item.isActive,
            createdAt: item.createdAt,
            // Add default values for optional fields
            imageUrls: ['https://placehold.co/300x192'],
            currency: '$',
            rating: 0
          }));
          setProducts(transformedProducts);
        } else {
          // Fallback to mock data if API response is not in expected format
          const mockResponse = await getMockProducts();
          setProducts(mockResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch products from API:", error);
        try {
          // Fallback to mock data if API call fails
          const mockResponse = await getMockProducts();
          setProducts(mockResponse.data);
        } catch (mockError) {
          console.error("Failed to fetch mock products:", mockError);
          setError("Failed to load products. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 animate-fade-in">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Popular Products</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 6).map((p, index) => (
            <div
              key={p.id}
              className="transform transition-all duration-500 ease-in-out"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;