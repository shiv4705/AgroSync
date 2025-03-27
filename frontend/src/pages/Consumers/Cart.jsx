import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

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
    // Get cart items from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setLoading(false);
  }, []);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => {
      if (item._id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Handle remove item
  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Handle place order
  const handlePlaceOrder = () => {
    navigate('/consumer/checkout');
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

  if (error) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
      <Navbar />
      
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
              <ShoppingCart className="w-8 h-8 text-green-600 dark:text-teal-400" />
            </motion.div>
            <h1 className="font-serif text-4xl font-bold tracking-tighter text-green-900 dark:text-teal-50 mb-4">
              Shopping Cart
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Review and manage your selected items
            </p>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">Your cart is empty</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/consumer/products')}
                className="bg-green-600 dark:bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-teal-600 transition-colors"
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-200/20 dark:border-teal-800/20 overflow-hidden"
                >
                  <div className="p-6">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 py-4 border-b border-green-200/20 dark:border-teal-800/20 last:border-0"
                      >
                        {item.image_url && (
                          <img
                            src={`http://localhost:5000${item.image_url}`}
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-teal-50">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-teal-900/30 dark:text-teal-300">
                              {item.category}
                            </span>
                            <span className="text-lg font-semibold text-green-600 dark:text-teal-400">
                              ₹{item.price}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-green-200/20 dark:border-teal-800/20 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-white/5"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-gray-900 dark:text-teal-50">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-white/5"
                            >
                              +
                            </button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-200/20 dark:border-teal-800/20 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-teal-50 mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Subtotal</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t border-green-200/20 dark:border-teal-800/20 pt-4">
                      <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-teal-50">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      className="w-full bg-green-600 dark:bg-teal-500 text-white py-3 rounded-lg hover:bg-green-700 dark:hover:bg-teal-600 transition-colors"
                    >
                      Proceed to Checkout
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
