import { Routes, Route } from "react-router-dom";
import React from "react";
import ConsumerDashboard from "./Dashboard";
import Profile from "./Profile";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import TotalSpent from "./TotalSpend"; 
import Cart from './CartPage';
import Shop from './ConsumerShop'
import ProductList from './ProductList';

function ConsumerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ConsumerDashboard />}>
        <Route index element={<Profile />} /> {/* Default route */}
        <Route path="profile" element={<Profile />} />
        <Route path="orders" element={<Orders />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="total-spent" element={<TotalSpent />} />
        <Route path="cart" element={<Cart />} />
        <Route path="shop" element={<Shop />} />
        <Route path="products" element={<ProductList />} />
      </Route>
    </Routes>
  );
}

export default ConsumerRoutes;