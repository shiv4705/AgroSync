import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiUser, 
  FiShoppingCart, 
  FiHeart, 
  FiDollarSign, 
  FiLogOut, 
  FiHome, 
  FiShoppingBag, 
  FiBell,
  FiPlus,
  FiMinus,
  FiX,
  FiTrendingUp,
  FiPackage,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiBox,
  FiChevronDown,
  FiSettings
} from "react-icons/fi";

const ConsumerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Dynamic username fetching
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const [currentDateTime] = useState("2025-03-21 07:45:16");
  const [cartOpen, setCartOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Set axios configuration
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000';
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);
  
  // Fetch username when component mounts
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        setLoading(true);
        // Use correct endpoint path
        const response = await axios.get('/api/auth/me');
        console.log("Response:", response.data.user.email);
        if (response.data && response.data.user) {
          setUsername(response.data.user.name || response.data.user.email || "User");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching username:", err);
        // Fallback for development
        setUsername("Guest");
        setLoading(false);
      }
    };
    
    // Comment this out temporarily to prevent API calls during testing
   fetchUsername();
    
    // For development, just use a placeholder username
  }, []);
  
  const [stats] = useState({
    totalOrders: 24,
    totalSpent: 487.50,
    wishlistItems: 12
  });
  
  const [recentOrders] = useState([
    {
      id: "ORD789",
      product: "Organic Strawberries",
      farm: "Green Acres Farm",
      quantity: "1 kg",
      amount: "₹499",
      status: "delivered",
      date: "2025-03-18",
    },
    {
      id: "ORD790",
      product: "Free-Range Eggs (Dozen)",
      farm: "Heritage Family Farms",
      quantity: "1 dozen",
      amount: "₹350",
      status: "processing",
      date: "2025-03-20",
    },
    {
      id: "ORD791",
      product: "Raw Honey (16oz)",
      farm: "Bee Haven Apiaries",
      quantity: "1 jar",
      amount: "₹600",
      status: "pending",
      date: "2025-03-21",
    },
  ]);
  
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Organic Strawberries",
      price: 4.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 2,
      name: "Free-Range Eggs (Dozen)",
      price: 5.50,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1542223616-740d5dff7f56?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 3,
      name: "Honey (16oz)",
      price: 8.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1558642891-54be180ea339?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  ]);
  
  const [notifications] = useState([
    { id: 1, message: "Your order #ORD67891 has been shipped!", time: "1 hour ago", read: false },
    { id: 2, message: "New seasonal produce available from Green Acres Farm", time: "3 hours ago", read: false },
    { id: 3, message: "Weekly farmers market this Saturday!", time: "Yesterday", read: true }
  ]);

  const formattedDate = new Date(currentDateTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const updateQuantity = (id, change) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };
  
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };
  
  const toggleCart = () => {
    setCartOpen(!cartOpen);
    if (notificationsOpen) setNotificationsOpen(false);
    if (profileOpen) setProfileOpen(false);
  };
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (cartOpen) setCartOpen(false);
    if (profileOpen) setProfileOpen(false);
  };
  
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    if (cartOpen) setCartOpen(false);
    if (notificationsOpen) setNotificationsOpen(false);
  };
  
  const markAllNotificationsAsRead = () => {
    // Placeholder function - in a real app this would make an API call
    console.log("Marking all notifications as read");
  };
  
  // Fixed logout function that doesn't use async/await to prevent navigate issues
  const handleLogout = () => {
    // First remove auth token
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    console.log("Logging out...");
    
    // Then make the API call, but don't await it
    axios.post('/api/auth/logout')
      .then(() => {
        console.log("Logout successful");
      })
      .catch(err => {
        console.error("Error logging out:", err);
      })
      .finally(() => {
        // Always navigate to login, even if the API call fails
        navigate('/login');
      });
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartOpen || notificationsOpen || profileOpen) {
        if (!event.target.closest('.cart-dropdown') && 
            !event.target.closest('.cart-button') &&
            !event.target.closest('.notifications-dropdown') && 
            !event.target.closest('.notifications-button') &&
            !event.target.closest('.profile-dropdown') &&
            !event.target.closest('.profile-button')) {
          setCartOpen(false);
          setNotificationsOpen(false);
          setProfileOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartOpen, notificationsOpen, profileOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
      <header className="bg-[#0A1F1C] border-b border-[#1F3330] py-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-[#00FFD1] rounded-lg p-2">
                  <span className="text-2xl font-bold text-[#0A1F1C]">K</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">AgroSync</span>
      
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {[
                { to: "/home", label: "Home" },
                { to: "/shop", label: "Marketplace" },
                { to: "/verified-farmers", label: "Verified Farmers" },
                { to: "/about", label: "About" }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-white hover:text-[#00FFD1] transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.to ? 'bg-[#1F3330] text-[#00FFD1]' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-6">
              <button 
                className="p-2 rounded-full text-white hover:bg-[#1F3330] transition-colors notifications-button relative"
                onClick={toggleNotifications}
              >
                <FiBell className="h-6 w-6" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 h-3 w-3 bg-[#00FFD1] rounded-full ring-2 ring-[#0A1F1C]"></span>
                )}
              </button>

              <button 
                className="p-2 rounded-full text-white hover:bg-[#1F3330] transition-colors cart-button relative"
                onClick={toggleCart}
              >
                <FiShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#00FFD1] text-[#0A1F1C] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-[#0A1F1C]">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <div 
                className="flex items-center space-x-1 profile-button cursor-pointer"
                onClick={toggleProfile}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00FFD1] to-[#00B396] text-[#0A1F1C] flex items-center justify-center shadow-lg">
                    <span className="font-medium">{username.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="hidden md:flex items-center space-x-1">
                    <span className="text-white font-medium">{username}</span>
                    <FiChevronDown className={`h-4 w-4 text-[#00FFD1] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {profileOpen && (
          <div className="absolute right-4 mt-2 w-48 bg-[#1F3330] rounded-lg shadow-xl z-50 profile-dropdown border border-[#2A4542] backdrop-blur-lg bg-opacity-95">
            <div className="py-2">
              <Link 
                to="/consumer/profile" 
                className="flex items-center px-4 py-3 text-white hover:bg-[#2A4542] transition-colors"
              >
                <FiUser className="h-5 w-5 mr-3 text-[#00FFD1]" />
                My Profile
              </Link>
              <Link 
                to="/consumer/settings" 
                className="flex items-center px-4 py-3 text-white hover:bg-[#2A4542] transition-colors"
              >
                <FiSettings className="h-5 w-5 mr-3 text-[#00FFD1]" />
                Settings
              </Link>
              <div className="border-t border-[#2A4542] my-1"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-3 text-red-400 hover:bg-[#2A4542] transition-colors"
              >
                <FiLogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}

        {notificationsOpen && (
          <div className="absolute right-4 mt-2 w-80 bg-[#1F3330] rounded-lg shadow-xl z-50 notifications-dropdown border border-[#2A4542] backdrop-blur-lg bg-opacity-95">
            <div className="p-4 border-b border-[#2A4542] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <button 
                onClick={markAllNotificationsAsRead}
                className="text-xs text-[#00FFD1] font-medium cursor-pointer hover:text-[#00E6BC]"
              >
                Mark all as read
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-4 border-b border-[#2A4542] hover:bg-[#2A4542] transition-colors ${
                    notification.read ? 'opacity-75' : ''
                  }`}
                >
                  <p className="text-sm text-white">{notification.message}</p>
                  <p className="text-xs text-[#00FFD1] mt-1 flex items-center">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {cartOpen && (
          <div className="absolute right-4 mt-2 w-80 bg-[#1F3330] rounded-lg shadow-xl z-50 cart-dropdown border border-[#2A4542] backdrop-blur-lg bg-opacity-95">
            <div className="p-4 border-b border-[#2A4542] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Your Cart</h3>
              <span className="text-sm text-[#00FFD1]">{cartItemCount} items</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="p-4 border-b border-[#2A4542] flex hover:bg-[#2A4542] transition-colors">
                  <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-[#2A4542]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-white">{item.name}</h4>
                    <p className="text-sm text-[#00FFD1] font-semibold">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#2A4542] rounded-md bg-[#0A1F1C]">
                        <button 
                          className="px-2 py-1 text-white hover:text-[#00FFD1] transition-colors"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <FiMinus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-sm text-white font-medium">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 text-white hover:text-[#00FFD1] transition-colors"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <FiPlus className="h-3 w-3" />
                        </button>
                      </div>
                      <button 
                        className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-[#0A1F1C] rounded"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-[#2A4542] bg-[#0A1F1C] bg-opacity-50">
              <div className="flex justify-between text-white mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-[#00FFD1]">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Link 
                  to="/checkout" 
                  className="block w-full py-2 px-4 bg-[#00FFD1] hover:bg-[#00E6BC] text-[#0A1F1C] text-center rounded-md font-medium transition-colors shadow-lg"
                >
                  Checkout
                </Link>
                <Link 
                  to="/cart" 
                  className="block w-full py-2 px-4 border border-[#00FFD1] text-[#00FFD1] hover:bg-[#1F3330] text-center rounded-md font-medium transition-colors"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {location.pathname === '/consumer' ? (
            <>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="font-serif text-4xl font-bold tracking-tighter text-green-900 dark:text-teal-50 mb-4">
                  Consumer Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Welcome back, {username}! Here's an overview of your purchases and favorite products.
                </p>
              </motion.div>

              {/* Quick Actions Row */}
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/shop")}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20 hover:border-green-300/30 dark:hover:border-teal-700/30 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FiShoppingBag className="w-5 h-5 text-green-600 dark:text-teal-400" />
                      <span className="text-gray-600 dark:text-gray-300">Browse Marketplace</span>
                    </div>
                    <p className="text-green-900 dark:text-teal-50 font-medium">
                      Discover fresh local produce
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/consumer/orders")}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20 hover:border-green-300/30 dark:hover:border-teal-700/30 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FiPackage className="w-5 h-5 text-green-600 dark:text-teal-400" />
                      <span className="text-gray-600 dark:text-gray-300">Track Orders</span>
                    </div>
                    <p className="text-green-900 dark:text-teal-50 font-medium">
                      View and track your orders
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/consumer/wishlist")}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20 hover:border-green-300/30 dark:hover:border-teal-700/30 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FiHeart className="w-5 h-5 text-green-600 dark:text-teal-400" />
                      <span className="text-gray-600 dark:text-gray-300">Wishlist</span>
                    </div>
                    <p className="text-green-900 dark:text-teal-50 font-medium">
                      View saved products
                    </p>
                  </motion.button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FiPackage className="w-5 h-5 text-green-600 dark:text-teal-400" />
                    <span className="text-gray-600 dark:text-gray-300">Total Orders</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-teal-50">
                    {stats.totalOrders}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FiDollarSign className="w-5 h-5 text-green-600 dark:text-teal-400" />
                    <span className="text-gray-600 dark:text-gray-300">Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-teal-50">
                    ${stats.totalSpent}
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FiHeart className="w-5 h-5 text-green-600 dark:text-teal-400" />
                    <span className="text-gray-600 dark:text-gray-300">Wishlist Items</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 dark:text-teal-50">
                    {stats.wishlistItems}
                  </p>
                </motion.div>
              </div>

              {/* Recent Orders */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20"
                >
                  <h2 className="font-serif text-2xl font-bold tracking-tighter text-green-900 dark:text-teal-50 mb-6">
                    Recent Orders
                  </h2>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-green-200/10 dark:border-teal-800/10"
                      >
                        <div>
                          <p className="font-medium text-green-900 dark:text-teal-50">
                            {order.product}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {order.farm} • {order.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-900 dark:text-teal-50">
                            {order.amount}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <FiClock className="w-4 h-4" />
                            <span className="text-gray-600 dark:text-gray-300">
                              {order.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <button 
                      onClick={() => navigate('/consumer/orders')}
                      className="inline-flex items-center px-4 py-2 border border-green-200/20 dark:border-teal-800/20 rounded-md text-sm font-medium text-green-900 dark:text-teal-50 hover:bg-white/10 transition-colors"
                    >
                      View All Orders
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </div>
              
              {/* Nearby Farmers */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20"
                >
                  <h2 className="font-serif text-2xl font-bold tracking-tighter text-green-900 dark:text-teal-50 mb-6">
                    Nearby Farmers
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        name: "Green Acres Farm",
                        location: "Ruralia, 5.2 km away",
                        products: "Organic Vegetables, Fruits",
                        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop"
                      },
                      {
                        name: "Heritage Family Farms",
                        location: "Agraria, 7.1 km away",
                        products: "Free-Range Eggs, Dairy",
                        image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&auto=format&fit=crop"
                      },
                      {
                        name: "Sunset Valley Organics",
                        location: "Greendale, 3.8 km away",
                        products: "Organic Produce, Honey",
                        image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&auto=format&fit=crop"
                      }
                    ].map((farmer, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg bg-white/5 border border-green-200/10 dark:border-teal-800/10 flex items-center space-x-4"
                      >
                        <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                          <img src={farmer.image} alt={farmer.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium text-green-900 dark:text-teal-50">{farmer.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center mt-1">
                            <FiMapPin className="w-3 h-3 mr-1" />
                            {farmer.location}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center mt-1">
                            <FiBox className="w-3 h-3 mr-1" />
                            {farmer.products}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <button 
                      onClick={() => navigate('/verified-farmers')}
                      className="inline-flex items-center px-4 py-2 border border-green-200/20 dark:border-teal-800/20 rounded-md text-sm font-medium text-green-900 dark:text-teal-50 hover:bg-white/10 transition-colors"
                    >
                      View All Farmers
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;