import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function FarmerDashboard() {
  const [stats] = useState({
    totalProducts: 156,
    pendingOrders: 23,
  });

  const [recentOrders] = useState([
    {
      id: "ORD001",
      customer: "John Doe",
      product: "Organic Tomatoes",
      quantity: "5 kg",
      amount: "₹750",
      status: "pending",
      date: "2024-03-20",
    },
    {
      id: "ORD002",
      customer: "Jane Smith",
      product: "Fresh Spinach",
      quantity: "2 kg",
      amount: "₹400",
      status: "delivered",
      date: "2024-03-19",
    },
    {
      id: "ORD003",
      customer: "Mike Johnson",
      product: "Organic Carrots",
      quantity: "3 kg",
      amount: "₹600",
      status: "processing",
      date: "2024-03-18",
    },
  ]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
      <Navbar />
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-4xl font-bold tracking-tighter text-green-900 dark:text-teal-50 mb-4">
              Farmer Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Welcome back! Here's an overview of your farm's performance.
            </p>
          </motion.div>

          {/* Quick Actions Row */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/farmer/products")}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20 hover:border-green-300/30 dark:hover:border-teal-700/30 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-green-600 dark:text-teal-400" />
                  <span className="text-gray-600 dark:text-gray-300">Manage Products</span>
                </div>
                <p className="text-green-900 dark:text-teal-50 font-medium">
                  View and manage your products
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/farmer/orders")}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20 hover:border-green-300/30 dark:hover:border-teal-700/30 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingCart className="w-5 h-5 text-green-600 dark:text-teal-400" />
                  <span className="text-gray-600 dark:text-gray-300">View Orders</span>
                </div>
                <p className="text-green-900 dark:text-teal-50 font-medium">
                  Manage orders
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/farmer/analytics")}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20 hover:border-green-300/30 dark:hover:border-teal-700/30 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-teal-400" />
                  <span className="text-gray-600 dark:text-gray-300">Analytics</span>
                </div>
                <p className="text-green-900 dark:text-teal-50 font-medium">
                  View insights
                </p>
              </motion.button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-green-600 dark:text-teal-400" />
                <span className="text-gray-600 dark:text-gray-300">Total Products</span>
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-teal-50">
                {stats.totalProducts}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="w-5 h-5 text-green-600 dark:text-teal-400" />
                <span className="text-gray-600 dark:text-gray-300">Pending Orders</span>
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-teal-50">
                {stats.pendingOrders}
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
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {order.product} • {order.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-900 dark:text-teal-50">
                        {order.amount}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {order.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerDashboard;