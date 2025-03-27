import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
  FiCalendar
} from "react-icons/fi";

const ConsumerDashboard = () => {
  const location = useLocation();
  const [currentUser] = useState("Dishang18");
  const [currentDateTime] = useState("2025-03-21 07:45:16");
  const [cartOpen, setCartOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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
  };
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (cartOpen) setCartOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartOpen || notificationsOpen) {
        if (!event.target.closest('.cart-dropdown') && 
            !event.target.closest('.cart-button') &&
            !event.target.closest('.notifications-dropdown') && 
            !event.target.closest('.notifications-button')) {
          setCartOpen(false);
          setNotificationsOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartOpen, notificationsOpen]);

  return (
    <div className="min-h-screen bg-[#0A1F1C]">
      <header className="bg-[#0A1F1C] border-b border-[#1F3330] py-4 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-[#00FFD1] rounded-lg p-2">
                  <span className="text-2xl font-bold text-[#0A1F1C]">K</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">Krushi</span>
                  <span className="text-2xl font-bold text-[#00FFD1]">Setu</span>
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {[
                { to: "/home", label: "Home" },
                { to: "/marketplace", label: "Marketplace" },
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

              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00FFD1] to-[#00B396] text-[#0A1F1C] flex items-center justify-center shadow-lg">
                  <span className="font-medium">{currentUser.substring(0, 2).toUpperCase()}</span>
                </div>
                <span className="text-white font-medium hidden md:block">{currentUser}</span>
              </div>
            </div>
          </div>
        </div>

        {notificationsOpen && (
          <div className="absolute right-4 mt-2 w-80 bg-[#1F3330] rounded-lg shadow-xl z-50 notifications-dropdown border border-[#2A4542] backdrop-blur-lg bg-opacity-95">
            <div className="p-4 border-b border-[#2A4542] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <span className="text-xs text-[#00FFD1] font-medium">Mark all as read</span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-[#1F3330] rounded-lg shadow-lg sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-2">Dashboard</h2>
                <p className="text-sm text-[#00FFD1] mb-6">{formattedDate}</p>
                
                <Link 
                  to="shop" 
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#00FFD1] to-[#00B396] hover:from-[#00E6BC] hover:to-[#00A187] text-[#0A1F1C] text-center rounded-md font-medium flex items-center justify-center mb-6 transition-colors shadow-lg"
                >
                  <FiShoppingBag className="mr-2" />
                  Shop Now
                </Link>
                
                <nav className="space-y-2">
                  {[
                    { path: '/consumer', icon: FiHome, label: 'Overview' },
                    { path: '/consumer/profile', icon: FiUser, label: 'Profile' },
                    { path: '/consumer/orders', icon: FiPackage, label: 'Orders' },
                    { path: '/consumer/wishlist', icon: FiHeart, label: 'Wishlist' },
                    { path: '/consumer/total-spent', icon: FiTrendingUp, label: 'Analytics' },
                  ].map(item => (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                        location.pathname === item.path 
                          ? 'bg-gradient-to-r from-[#2A4542] to-[#1F3330] text-[#00FFD1] shadow-md' 
                          : 'text-white hover:bg-[#2A4542] hover:shadow-md'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="p-6 border-t border-[#2A4542]">
                <button className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-[#2A4542] rounded-lg transition-all hover:shadow-md">
                  <FiLogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {location.pathname === '/consumer' ? (
              <div className="space-y-8">
                <div className="bg-[#1F3330] rounded-lg p-8 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {currentUser}!</h1>
                      <p className="text-[#A3B3B0] text-lg">
                        Explore fresh, local produce from farmers in your area
                      </p>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-center bg-[#2A4542] px-6 py-4 rounded-lg">
                        <div className="text-[#00FFD1] text-3xl font-bold mb-1">24</div>
                        <div className="text-[#A3B3B0] text-sm font-medium">Orders</div>
                      </div>
                      <div className="text-center bg-[#2A4542] px-6 py-4 rounded-lg">
                        <div className="text-[#00FFD1] text-3xl font-bold mb-1">$487.50</div>
                        <div className="text-[#A3B3B0] text-sm font-medium">Total Spent</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Recommended Products</h2>
                    <Link to="/marketplace" className="text-[#00FFD1] hover:text-[#00E6BC] font-medium flex items-center">
                      View All
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        image: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400",
                        name: "Organic Strawberries",
                        farm: "Green Acres Farm",
                        price: 4.99
                      },
                      {
                        image: "https://images.unsplash.com/photo-1542223616-740d5dff7f56?w=400",
                        name: "Free-Range Eggs (Dozen)",
                        farm: "Heritage Family Farms",
                        price: 5.50
                      },
                      {
                        image: "https://images.unsplash.com/photo-1557844352-761f2565b576?w=400",
                        name: "Seasonal Vegetables Basket",
                        farm: "Sunset Valley Organics",
                        price: 24.99
                      },
                      {
                        image: "https://images.unsplash.com/photo-1558642891-54be180ea339?w=400",
                        name: "Raw Honey (16oz)",
                        farm: "Bee Haven Apiaries",
                        price: 8.99
                      }
                    ].map((product, index) => (
                      <div key={index} className="bg-[#1F3330] rounded-lg overflow-hidden group shadow-lg hover:shadow-xl transition-all">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F1C] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-white text-lg">{product.name}</h4>
                          <p className="text-sm text-[#A3B3B0] mb-3 flex items-center">
                            <FiUser className="w-4 h-4 mr-1" />
                            {product.farm}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#00FFD1] font-bold text-lg">${product.price.toFixed(2)}</span>
                            <button className="p-2 rounded-full bg-[#2A4542] text-[#00FFD1] hover:bg-[#00FFD1] hover:text-[#0A1F1C] transition-all transform hover:scale-105">
                              <FiShoppingCart className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConsumerDashboard;