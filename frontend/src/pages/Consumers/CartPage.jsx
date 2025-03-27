import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiTrash2, 
  FiPlus, 
  FiMinus, 
  FiShoppingBag, 
  FiCreditCard, 
  FiInfo,
  FiTag
} from "react-icons/fi";

const CartPage = () => {
  const [currentUser] = useState("Dishang18");
  const [currentDateTime] = useState("2025-03-21 08:03:05");
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Organic Strawberries",
      price: 4.99,
      quantity: 2,
      farmer: "Green Acres Farm",
      image: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 2,
      name: "Free-Range Eggs (Dozen)",
      price: 5.50,
      quantity: 1,
      farmer: "Heritage Family Farms",
      image: "https://images.unsplash.com/photo-1542223616-740d5dff7f56?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 3,
      name: "Honey (16oz)",
      price: 8.99,
      quantity: 1,
      farmer: "Bee Haven Apiaries",
      image: "https://images.unsplash.com/photo-1558642891-54be180ea339?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 4,
      name: "Seasonal Vegetables Basket",
      price: 24.99,
      quantity: 1,
      farmer: "Sunset Valley Organics",
      image: "https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  ]);
  
  const [promoCode, setPromoCode] = useState("");
  const [validPromo, setValidPromo] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Calculate cart totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.07; // 7% tax rate
  const shipping = subtotal > 50 ? 0 : 4.99; // Free shipping on orders over $50
  const total = subtotal + tax + shipping - discount;
  
  // Handle quantity changes
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
  
  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };
  
  // Handle promo code submission
  const applyPromoCode = () => {
    if (!promoCode.trim()) return;
    
    setLoading(true);
    
    // Simulate API call to validate promo code
    setTimeout(() => {
      // For demonstration, only "FARM25" is a valid code for 25% off
      if (promoCode.toUpperCase() === "FARM25") {
        setValidPromo({
          code: promoCode.toUpperCase(),
          description: "25% Off Your Order"
        });
        setDiscount(subtotal * 0.25); // 25% discount
      } else {
        setValidPromo(null);
        setDiscount(0);
      }
      setLoading(false);
    }, 800);
  };
  
  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link 
            to="/marketplace" 
            className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors inline-flex items-center"
          >
            <FiShoppingBag className="mr-2" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
        <div className="text-sm text-gray-500">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Cart header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Cart Items</h2>
            </div>
            
            {/* Cart items */}
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row">
                  {/* Product image */}
                  <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-md overflow-hidden mb-4 sm:mb-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Product details */}
                  <div className="sm:ml-6 flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                      <span className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">From {item.farmer}</p>
                    
                    <div className="flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FiMinus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Unit price and remove button */}
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-4">${item.price.toFixed(2)} each</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove item"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Continue shopping link */}
            <div className="p-6 border-t border-gray-200">
              <Link 
                to="/marketplace" 
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                <FiArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            {/* Summary header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
            </div>
            
            {/* Summary details */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (7%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({validPromo.code})</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-800">Total</span>
                  <span className="text-lg font-semibold text-gray-800">${total.toFixed(2)}</span>
                </div>
              </div>
              
              {shipping === 0 && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-start">
                  <FiInfo className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Your order qualifies for free shipping!</span>
                </div>
              )}
              
              {shipping > 0 && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-md flex items-start">
                  <FiInfo className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Add ${(50 - subtotal).toFixed(2)} more to qualify for free shipping.</span>
                </div>
              )}
              
              {/* Promo code section */}
              <div className="mt-6">
                <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiTag className="mr-2" />
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="promo-code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-800 text-white rounded-r-md hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {validPromo && (
                  <div className="mt-2 text-sm text-green-600 flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    {validPromo.description} applied
                  </div>
                )}
                {validPromo === null && promoCode && !loading && (
                  <div className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    Invalid promo code
                  </div>
                )}
              </div>
              
              {/* Checkout button */}
              <Link 
                to="/checkout" 
                className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors inline-flex items-center justify-center"
              >
                <FiCreditCard className="mr-2" />
                Proceed to Checkout
              </Link>
              
              {/* Payment methods */}
              <div className="mt-6 flex justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0533/2089/files/payment-icons.png" alt="Payment methods" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* You might also like section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Suggested product 1 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-200 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1571913196747-5023e41acb71?w=400" 
                alt="Organic Apples" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800">Organic Apples (lb)</h3>
              <p className="text-sm text-gray-500 mb-2">Green Acres Farm</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">$3.99</span>
                <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Suggested product 2 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-200 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400" 
                alt="Artisan Bread" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800">Artisan Sourdough Bread</h3>
              <p className="text-sm text-gray-500 mb-2">Village Bakery</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">$6.50</span>
                <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Suggested product 3 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-200 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400" 
                alt="Fresh Milk" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800">Grass-Fed Milk (Gallon)</h3>
              <p className="text-sm text-gray-500 mb-2">Mountain View Dairy</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">$7.25</span>
                <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Suggested product 4 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-200 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=400" 
                alt="Maple Syrup" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800">Pure Maple Syrup (8oz)</h3>
              <p className="text-sm text-gray-500 mb-2">Forest Farms</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">$9.99</span>
                <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customer info */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Logged in as {currentUser} | Last updated: {currentDateTime}</p>
        <p className="mt-2">Have questions about your order? <a href="/contact" className="text-green-600 hover:underline">Contact our support team</a></p>
      </div>
    </div>
  );
};

export default CartPage;