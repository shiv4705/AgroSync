import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FarmerDashboard from './Dashboard';
import FarmerProfile from './Profile';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
// import OrderList from './OrderList';

const FarmerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<FarmerDashboard />} />
            <Route path="/profile" element={<FarmerProfile />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/update/:productId" element={<EditProduct />} />
            {/* <Route path="/orders" element={<OrderList />} /> */}
        </Routes>
    );
};

export default FarmerRoutes;