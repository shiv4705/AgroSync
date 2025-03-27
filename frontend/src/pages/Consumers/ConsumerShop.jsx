import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Search, 
  ChevronDown, 
  Star, 
  Heart, 
  Grid, 
  List,
  Clock,
  ChevronLeft,
  ChevronRight,
  Package,
  Users,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

const ConsumerShop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState(null);
  
  // New state variables for product-farmer functionality
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUserData(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/consumer/allproducts');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      // Create a map to group products by name
      const productMap = new Map();
      data.products.forEach(product => {
        if (!productMap.has(product.name)) {
          productMap.set(product.name, {
            ...product,
            count: 1
          });
        } else {
          productMap.get(product.name).count += 1;
        }
      });
      
      // Convert map to array of unique products
      const uniqueProducts = Array.from(productMap.values());
      setProducts(uniqueProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch farmers for a specific product
  const fetchFarmersForProduct = async (productName) => {
    try {
      setLoadingFarmers(true);
      const encodedName = encodeURIComponent(productName);
      const response = await fetch(`http://localhost:5000/api/products/farmers/${encodedName}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch farmers for this product');
      }
      
      const data = await response.json();
      setSelectedProduct(data.product);
      setFarmers(data.farmers);
      setLoadingFarmers(false);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      setError('Failed to load farmer details');
      setLoadingFarmers(false);
    }
  };

  // Handle product click
  const handleProductClick = (product) => {
    fetchFarmersForProduct(product.name);
  };

  // Handle back button click
  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setFarmers([]);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle add to cart from farmer listing
  const handleAddToCartFromFarmer = async (farmer) => {
    try {
      // Get existing cart items from localStorage
      const existingCart = localStorage.getItem('cart');
      const cartItems = existingCart ? JSON.parse(existingCart) : [];

      // Create a product with farmer details for the cart
      const cartProduct = {
        _id: farmer.product_id,
        name: selectedProduct.name,
        description: selectedProduct.description,
        category: selectedProduct.category,
        image_url: selectedProduct.image_url,
        price: farmer.price,
        available_quantity: farmer.available_quantity,
        farmer_id: farmer.farmer_id,
        farmer_mobile: farmer.farmer_mobile,
        farmer_location: farmer.farmer_location,
        quantity: 1
      };

      // Check if product from this farmer already exists in cart
      const existingItem = cartItems.find(item => item._id === farmer.product_id);

      if (existingItem) {
        // If product exists, update quantity
        const updatedCart = cartItems.map(item => {
          if (item._id === farmer.product_id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        // If product doesn't exist, add it with quantity 1
        const updatedCart = [...cartItems, cartProduct];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  // Original add to cart function (kept for compatibility)
  const handleAddToCart = async (product) => {
    try {
      // Get existing cart items from localStorage
      const existingCart = localStorage.getItem('cart');
      const cartItems = existingCart ? JSON.parse(existingCart) : [];

      // Check if product already exists in cart
      const existingItem = cartItems.find(item => item._id === product._id);

      if (existingItem) {
        // If product exists, update quantity
        const updatedCart = cartItems.map(item => {
          if (item._id === product._id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        // If product doesn't exist, add it with quantity 1
        const updatedCart = [...cartItems, { ...product, quantity: 1 }];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
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

  // Display farmers for selected product
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
        {/* Main Content */}
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleBackToProducts}
              className="mb-8 flex items-center space-x-2 text-teal-400 hover:text-teal-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Products</span>
            </motion.button>
            
            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Product Image */}
                <div className="md:w-1/3">
                  {selectedProduct.image_url && (
                    <img
                      src={`http://localhost:5000${selectedProduct.image_url}`}
                      alt={selectedProduct.name}
                      className="w-full h-auto rounded-xl"
                    />
                  )}
                </div>
                
                {/* Product Info */}
                <div className="md:w-2/3">
                  <h1 className="font-serif text-3xl font-bold text-green-900 dark:text-teal-50 mb-3">
                    {selectedProduct.name}
                  </h1>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-teal-900/30 dark:text-teal-300 mb-4 inline-block">
                    {selectedProduct.category}
                  </span>
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    {selectedProduct.description}
                  </p>
                  <div className="mt-6 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-teal-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {farmers.length} {farmers.length === 1 ? 'Farmer' : 'Farmers'} selling this product
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Farmers Section */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-green-900 dark:text-teal-50 mb-6">
                Choose a Farmer
              </h2>
              
              {loadingFarmers ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {farmers.map((farmer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-200/20 dark:border-teal-800/20 overflow-hidden p-6"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Farmer Details */}
                        <div className="md:w-1/2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-teal-50 mb-3">
                            Farmer from <span className="text-green-600 dark:text-teal-400">{farmer.farmer_location}</span>
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">
                            Contact: {farmer.farmer_mobile}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
                            <span className="text-lg font-semibold text-green-600 dark:text-teal-400">
                              ₹{farmer.price}/unit
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Available: {farmer.available_quantity} units
                            </span>
                          </div>
                        </div>
                        
                        {/* Traceability Info */}
                        <div className="md:w-1/2 bg-white/5 p-4 rounded-lg">
                          <h4 className="text-lg font-semibold text-green-600 dark:text-teal-400 mb-3">
                            Traceability Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600 dark:text-gray-300 flex justify-between">
                              <span>Farm Location:</span>
                              <span>{farmer.traceability?.farm_location || 'Not specified'}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 flex justify-between">
                              <span>Harvest Date:</span>
                              <span>
                                {farmer.traceability?.harvest_date 
                                  ? new Date(farmer.traceability.harvest_date).toLocaleDateString() 
                                  : 'Not specified'}
                              </span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 flex justify-between">
                              <span>Harvest Method:</span>
                              <span>{farmer.traceability?.harvest_method || 'Not specified'}</span>
                            </p>
                            {farmer.traceability?.certified_by && (
                              <p className="text-gray-600 dark:text-gray-300 flex justify-between">
                                <span>Certified By:</span>
                                <span>{farmer.traceability.certified_by}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="mt-4 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCartFromFarmer(farmer)}
                          className="bg-green-600 dark:bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 dark:hover:bg-teal-600 transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>Add to Cart</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product listing view
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
      {/* Main Content */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block p-3 rounded-full bg-teal-500/10 mb-6"
            >
              <Package className="w-8 h-8 text-green-600 dark:text-teal-400" />
            </motion.div>
            <h1 className="font-serif text-4xl font-bold tracking-tighter text-green-900 dark:text-teal-50 mb-4">
              Available Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse and shop from our collection of fresh farm products
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">No products found</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-200/20 dark:border-teal-800/20 overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative">
                    {product.image_url && (
                      <img
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    {product.count > 1 && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.count} farmers
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-teal-50 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {product.description && product.description.length > 100
                        ? `${product.description.substring(0, 100)}...`
                        : product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-teal-900/30 dark:text-teal-300">
                        {product.category}
                      </span>
                      <span className="text-lg font-semibold text-green-600 dark:text-teal-400">
                        ₹{product.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-teal-400">
                        {product.count > 1 ? 'Multiple farmers' : 'View details'}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the parent onClick
                          handleProductClick(product);
                        }}
                        className="bg-green-600 dark:bg-teal-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 dark:hover:bg-teal-600 transition-colors"
                      >
                        View Farmers
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="p-2 rounded-lg border border-[#0EA5E9]/20 text-[#0EA5E9] hover:bg-[#0EA5E9]/10">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#0EA5E9] text-white">1</button>
              <button className="px-4 py-2 rounded-lg border border-[#0EA5E9]/20 text-[#0EA5E9] hover:bg-[#0EA5E9]/10">2</button>
              <button className="px-4 py-2 rounded-lg border border-[#0EA5E9]/20 text-[#0EA5E9] hover:bg-[#0EA5E9]/10">3</button>
              <button className="p-2 rounded-lg border border-[#0EA5E9]/20 text-[#0EA5E9] hover:bg-[#0EA5E9]/10">
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerShop;