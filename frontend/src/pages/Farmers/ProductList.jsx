import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, Search, Edit, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState(null);
  // Add a new state to track if this is a new user with no products
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Check for both token and user data
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    console.log('Stored User:', storedUser);
    console.log('Auth Token:', token);
    
    // Try to parse user data if it exists
    let parsedUser = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
        console.log('Parsed user data:', parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    
    // Handle authentication scenarios
    if (!token) {
      console.log('No authentication token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    // If we have a token but invalid/missing user data
    if (!parsedUser || !parsedUser.uid) {
      // Here you could either redirect to login or try to fetch user profile
      console.log('Valid token but invalid user data. Attempting to fetch user profile...');
      
      // Option 1: Just redirect to login
      navigate('/login');
      return;
      
      // Option 2: Try to fetch user profile (uncomment to use)
      // fetchUserProfile(token);
      // return;
    }
    
    // If we have valid user data, set it to state
    setUserData(parsedUser);
  }, [navigate]);

  useEffect(() => {
    if (userData?.uid) {
      fetchFarmerProducts();
    }
  }, [userData]);

  const fetchFarmerProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products for farmer ID:', userData.uid);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/farmer/${userData.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
  
      // Handle 404 as a special case for new users
      if (response.status === 404) {
        console.log('No products found - likely a new user');
        setProducts([]);
        setIsNewUser(true);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }
      
      console.log('API response:', data);
      
      // If products property exists in response, use it (even if empty array)
      if (data.products) {
        setProducts(data.products);
        console.log(`Loaded ${data.products.length} products`);
        
        // If the user has no products, mark them as a new user
        if (data.products.length === 0) {
          setIsNewUser(true);
        }
      } else {
        // Handle unexpected response format
        console.warn('Unexpected API response format:', data);
        setProducts([]);
        setIsNewUser(true);
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      // Don't set error for new users with no products
      if (error.message.includes('Not Found') || error.message.includes('404')) {
        setProducts([]);
        setIsNewUser(true);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Add missing token authorization
        const token = localStorage.getItem('token');
        console.log('Deleting product with ID:', productId);
        const response = await fetch(`http://localhost:5000/api/products/delete/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        
        // Refresh the product list after deletion
        fetchFarmerProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
        <Navbar />
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - don't show for new users
  if (error && !isNewUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
        <Navbar />
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-red-500">
              <p>Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // New user state - redirect to add product
  if (isNewUser || products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
        <Navbar />
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block p-3 rounded-full bg-teal-500/10 mb-6"
              >
                <Package className="w-10 h-10 text-green-600 dark:text-teal-400" />
              </motion.div>
              <h1 className="font-serif text-4xl font-bold tracking-tighter text-green-900 dark:text-teal-50 mb-4">
                Welcome to Your Product Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                It looks like you don't have any products yet. Let's add your first product to get started!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/farmer/add-product')}
                className="bg-green-600 dark:bg-teal-500 text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 dark:hover:bg-teal-600 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Product</span>
              </motion.button>
            </motion.div>

            {/* Helpful tips section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-200/20 dark:border-teal-800/20 p-6"
            >
              <h2 className="text-xl font-semibold text-green-900 dark:text-teal-50 mb-4">Getting Started Tips:</h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Add details about your products including images, prices, and availability.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Include information about organic farming, sustainability practices, and product origins.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Update your inventory regularly to reflect current stock levels.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Set competitive prices based on market trends and product quality.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Regular user with products
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Manage Products
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400"
            >
              Add, edit, and manage your farm products for the marketplace
            </motion.p>
          </div>

          {/* Search and Add Product Bar */}
          <div className="flex justify-between items-center mb-6 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-[#2d4f47] text-white pl-10 pr-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/farmer/add-product')}
              className="bg-teal-500 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-teal-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </motion.button>
          </div>

          {/* Products Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-200/20 dark:border-teal-800/20 overflow-hidden"
          >
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300">No products found matching your search</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-green-200/20 dark:border-teal-800/20">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Product</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Category</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Price</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Quantity</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-green-200/20 dark:border-teal-800/20 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {product.image_url && (
                            <img
                              src={`http://localhost:5000${product.image_url.startsWith('/') ? '' : '/'}${product.image_url}`}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                              }}
                            />
                          )}
                          <div>
                            <div className="text-gray-900 dark:text-teal-50 font-medium">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-teal-900/30 dark:text-teal-300">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900 dark:text-teal-50">
                        ₹{product.price}
                      </td>
                      <td className="py-4 px-4 text-gray-900 dark:text-teal-50">
                        {product.available_quantity}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/farmer/update/${product._id}`)}
                            className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit Product"
                          >
                            <Edit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete Product"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;