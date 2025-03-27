import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/Navbar';
import {
  Package,
  Calendar,
  MapPin,
  Tag,
  FileText,
  Clock,
  Shield,
  Upload,
} from "lucide-react";

function AddProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [farmer, setFarmer] = useState({
    id: '',
    mobile: '',
    location: ''
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    available_quantity: "",
    image_url: "",
    farmer_id: "",
    farmer_mobile: "",
    farmer_location: "",
    traceability: {
      farm_location: "",
      harvest_date: "",
      harvest_method: "",
      certified_by: "",
    },
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.uid) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    
    setFarmer({
      id: userData.uid, // Use uid instead of id if that's what your auth system uses
      mobile: userData.mobile || '',
      location: userData.location || ''
    });
  
    setFormData(prev => ({
      ...prev,
      farmer_id: userData.uid, // Use uid instead of id
      farmer_mobile: userData.mobile || '',
      farmer_location: userData.location || ''
    }));
  }, [navigate]);

  const categories = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Dairy",
    "Meat",
    "Poultry",
    "Spices",
    "Other",
  ];

  const harvestMethods = [
    "Organic",
    "Conventional",
    "Hydroponic",
    "Aquaponic",
    "Biodynamic",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("traceability.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        traceability: {
          ...prev.traceability,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: file, // Store the actual file
        image_url: imageUrl, // Store the preview URL
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to add a product');
        navigate('/login');
        return;
      }
      
      // Get user information
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Create a FormData object to handle file upload
      const submitFormData = new FormData();
      
      // Append basic product information
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('category', formData.category);
      submitFormData.append('price', formData.price);
      submitFormData.append('available_quantity', formData.available_quantity);
      
      // Append farmer information
      submitFormData.append('farmer_id', userData?.uid || formData.farmer_id);
      submitFormData.append('farmer_mobile', userData?.mobile || formData.farmer_mobile);
      submitFormData.append('farmer_location', userData?.location || formData.farmer_location);
      
      // Convert traceability object to JSON string
      submitFormData.append('traceability', JSON.stringify({
        farm_location: formData.traceability.farm_location,
        harvest_date: formData.traceability.harvest_date,
        harvest_method: formData.traceability.harvest_method,
        certified_by: formData.traceability.certified_by
      }));
      
      // Append image if available
      if (formData.image) {
        submitFormData.append('image', formData.image);
      }
      
      console.log('Submitting product data...');
      
      // Make API call to add the product
      const response = await fetch('http://localhost:5000/api/products/add-product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitFormData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }
      
      const data = await response.json();
      console.log('Product added successfully:', data);
      
      alert('Product added successfully!');
      navigate('/farmer/products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
      <Navbar />
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-4xl font-bold tracking-tighter text-green-900 dark:text-teal-50 mb-4">
              Add New Product
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Fill in the details below to add a new product to your inventory
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-200/20 dark:border-teal-800/20 space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-900 dark:text-teal-50 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                  placeholder="Describe your product"
                />
              </div>
            </div>

            {/* Pricing and Quantity */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-900 dark:text-teal-50 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Pricing and Quantity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-2">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    name="available_quantity"
                    value={formData.available_quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
            </div>

            {/* Traceability Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-900 dark:text-teal-50 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Traceability Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-2">
                    Farm Location
                  </label>
                  <input
                    type="text"
                    name="traceability.farm_location"
                    value={formData.traceability.farm_location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                    placeholder="Enter farm location"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-2">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    name="traceability.harvest_date"
                    value={formData.traceability.harvest_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-2">
                    Harvest Method
                  </label>
                  <select
                    name="traceability.harvest_method"
                    value={formData.traceability.harvest_method}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                  >
                    <option value="">Select method</option>
                    {harvestMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-2">
                    Certified By
                  </label>
                  <input
                    type="text"
                    name="traceability.certified_by"
                    value={formData.traceability.certified_by}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                    placeholder="Enter certification authority"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-900 dark:text-teal-50 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Product Image
              </h2>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white/5 text-gray-600 dark:text-gray-300 rounded-lg border-2 border-dashed border-green-200/20 dark:border-teal-800/20 cursor-pointer hover:border-green-300/30 dark:hover:border-teal-700/30">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-green-600 dark:text-teal-400" />
                    <p className="mb-2 text-sm">
                      <span className="font-semibold">Click to upload</span> or drag
                      and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG or JPEG (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
              {formData.image_url && (
                <div className="mt-4">
                  <img
                    src={formData.image_url}
                    alt="Product preview"
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/farmer/products')}
                className="bg-red-500 backdrop-blur-sm text-white dark:text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-red-600/80 border border-green-200/20 dark:border-teal-800/20 transition-colors"
              >
                <span>Cancel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                type="submit"
                className={`bg-green-600 dark:bg-teal-500 text-white px-8 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 dark:hover:bg-teal-600 transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Package className="w-5 h-5" />
                <span>{isSubmitting ? "Adding Product..." : "Add Product"}</span>
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;