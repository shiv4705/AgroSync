import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { ArrowLeft, Upload } from 'lucide-react';

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    available_quantity: '',
    farmer_id: '', 
    farmer_mobile: '',
    farmer_location: '',
    'traceability.farm_location': '',
    'traceability.harvest_date': '',
    'traceability.harvest_method': '',
    'traceability.certified_by': ''
  });

  // Fetch product details when component mounts
  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    } else {
      setError("Product ID is missing");
      setLoading(false);
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token and user data
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log('Fetching product details for ID:', productId);
      
      // Match the endpoint used in handleSubmit to be consistent 
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch product details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Product data received:', data);
      
      // The response could have different structures, handle them all
      const product = data.product || data || {};
      
      if (!product._id && !product.name) {
        console.error('Invalid product data received:', product);
        throw new Error('Product details not found or in incorrect format');
      }
      
      // Set form data from product
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price || '',
        available_quantity: product.available_quantity || '',
        farmer_id: product.farmer_id || userData?.uid || '',
        farmer_mobile: product.farmer_mobile || '',
        farmer_location: product.farmer_location || '',
        'traceability.farm_location': product.traceability?.farm_location || '',
        'traceability.harvest_date': product.traceability?.harvest_date ? 
          new Date(product.traceability.harvest_date).toISOString().split('T')[0] : '',
        'traceability.harvest_method': product.traceability?.harvest_method || '',
        'traceability.certified_by': product.traceability?.certified_by || ''
      });
  
      // Set image preview
      if (product.image_url) {
        // Handle different image URL formats
        let imageUrl = product.image_url;
        
        if (!imageUrl.startsWith('http')) {
          imageUrl = `http://localhost:5000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        }
        
        console.log('Setting image preview URL:', imageUrl);
        setImagePreview(imageUrl);
      }
      
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const submitFormData = new FormData();
      
      // Append all form fields except traceability and image
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && !key.startsWith('traceability.') && formData[key] !== undefined && formData[key] !== null) {
          submitFormData.append(key, formData[key]);
        }
      });
  
      // Create a traceability object instead of using dot notation
      // This matches how your backend expects the data
      submitFormData.append('traceability', JSON.stringify({
        farm_location: formData['traceability.farm_location'] || '',
        harvest_date: formData['traceability.harvest_date'] || '',
        harvest_method: formData['traceability.harvest_method'] || '',
        certified_by: formData['traceability.certified_by'] || ''
      }));
  
      // Append image if selected
      if (formData.image) {
        submitFormData.append('image', formData.image);
      }
  
      console.log('Submitting update for product ID:', productId);
      
      // Update endpoint to match your backend route structure
      const response = await fetch(`http://localhost:5000/api/products/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitFormData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = 'Failed to update product';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Failed to update product: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log('Update successful:', data);
      
      alert('Product updated successfully!');
      navigate('/farmer/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a332e]">
        <Navbar />
        <div className="pt-24 px-6 text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a332e]">
        <Navbar />
        <div className="pt-24 px-6 text-center">
          <div className="max-w-md mx-auto bg-red-500/10 rounded-lg p-6">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => navigate('/farmer/products')}
              className="mt-4 text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />
      
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/farmer/products')}
              className="text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Edit Product
            </motion.h1>
            <p className="text-gray-400">Product ID: {productId}</p>
          </div>

          {/* Edit Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2d4f47] rounded-xl border border-teal-500/20 p-6"
            onSubmit={handleSubmit}
          >
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Herbs">Herbs</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Available Quantity</label>
                  <input
                    type="number"
                    name="available_quantity"
                    value={formData.available_quantity}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Traceability Information */}
              <div className="border-t border-teal-500/20 pt-6">
                <h2 className="text-xl text-white mb-4">Traceability Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2">Farm Location</label>
                    <input
                      type="text"
                      name="traceability.farm_location"
                      value={formData['traceability.farm_location']}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Harvest Date</label>
                    <input
                      type="date"
                      name="traceability.harvest_date"
                      value={formData['traceability.harvest_date']}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Harvest Method</label>
                    <input
                      type="text"
                      name="traceability.harvest_method"
                      value={formData['traceability.harvest_method']}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Certified By</label>
                    <input
                      type="text"
                      name="traceability.certified_by"
                      value={formData['traceability.certified_by']}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-400 mb-2">Product Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-24 h-24 rounded-lg object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src);
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                      }}
                    />
                  )}
                  <label className="cursor-pointer bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 hover:border-teal-500 transition-colors flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-teal-500 text-white px-6 py-2.5 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;