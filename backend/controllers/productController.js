import Product from "../models/Product.js";
import mongoose from "mongoose";


// Add new product
export const addProduct = async (req, res) => {
  try {
    console.log("Creating product, received body:", req.body);
    console.log("File received:", req.file);

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const {
      name,
      category,
      price,
      available_quantity,
      description,
      farmer_id,
      unit, // Added unit field
      discount, // Add discount field
    } = req.body;

    const traceability = JSON.parse(req.body.traceability);

    // Validate required fields
    if (!name || !category || !price || !description || !farmer_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required product information",
      });
    }

    // Validate available_quantity is provided and is a number
    if (!available_quantity || isNaN(Number(available_quantity))) {
      return res.status(400).json({
        success: false,
        message: "Available quantity is required and must be a number",
      });
    }

    // Validate discount is between 0-100
    const discountValue = parseFloat(discount) || 0;
    if (discountValue < 0 || discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 100 percent",
      });
    }

    // Extract traceability fields from the FormData
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith("traceability[")) {
        const fieldName = key.replace("traceability[", "").replace("]", "");
        traceability[fieldName] = req.body[key];
        console.log("Extracted traceability field:", fieldName, req.body[key]);
      }
    });

    console.log("Extracted traceability data:", traceability);

    // Create image URL for frontend access
    const imageUrl = `/api/products/image/${req.file.filename}`;
    console.log("file id" + req.file.id);
    console.log("image url" + imageUrl);

    // Create new product
    const product = await Product.create({
      name,
      category,
      price: Number(price),
      discount: discountValue,
      available_quantity: Number(available_quantity),
      description,
      unit: unit || "kg", // Use the unit field correctly
      image_id: req.file.id,
      image_url: imageUrl,
      farmer_id,
      traceability,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const getProductImage = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });

    const { filename } = req.params;
    const file = await db.collection("uploads.files").findOne({ filename });

    if (!file) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Set the correct content type
    res.set("Content-Type", file.contentType);

    // Stream the file to the response
    bucket.openDownloadStreamByName(filename).pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Failed to fetch image" });
  }
};

// Get products by farmer ID
export const getProductbyId = async (req, res) => {
  try {
    console.log('Received farmer ID:', req.params);
    const { farmer_id } = req.params;
    console.log('Received farmer ID:', farmer_id);
    const products = await Product.find({ farmer_id })
      .sort({ createdAt: -1 });

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found for this farmer",
      });
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Search products by category
export const searchProductByCatagory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category })
      .sort({ createdAt: -1 });

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found in this category",
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching products",
      error: error.message,
    });
  }
};

// Edit product
export const editProducts = async (req, res) => {
  try {
    const { product_id } = req.params;
    const updates = { ...req.body };

    // Handle image update if new image is uploaded
    if (req.file) {
      updates.image_url = `/uploads/products/${req.file.filename}`;
    }

    // Handle traceability updates if provided
    if (req.body["traceability.farm_location"] ||
      req.body["traceability.harvest_date"] ||
      req.body["traceability.harvest_method"] ||
      req.body["traceability.certified_by"]) {
      updates.traceability = {
        farm_location: req.body["traceability.farm_location"],
        harvest_date: req.body["traceability.harvest_date"],
        harvest_method: req.body["traceability.harvest_method"],
        certified_by: req.body["traceability.certified_by"],
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      product_id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product details",
      error: error.message,
    });
  }
};


// Delete product
// Delete product
export const deleteProducts = async (req, res) => {
  try {
    // Extract product ID from parameters - support both formats
    const product_id = req.params.product_id || req.params.id;
    console.log('Received product ID:', product_id);
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required for deletion",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(product_id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProducts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

export const getUniqueProducts = async (req, res) => {
  try {
    // Get all products
    const allProducts = await Product.find().sort({ createdAt: -1 });

    // Create a map to store unique products by name
    const uniqueProductsMap = new Map();

    // Process each product
    allProducts.forEach(product => {
      if (!uniqueProductsMap.has(product.name)) {
        // Store the first instance of each product name
        uniqueProductsMap.set(product.name, {
          _id: product._id,
          name: product.name,
          description: product.description,
          category: product.category,
          image_url: product.image_url,
          price: product.price, // We'll show the price of the first farmer for display
          count: 1 // Track how many farmers sell this
        });
      } else {
        // Just increment the count for existing products
        const existing = uniqueProductsMap.get(product.name);
        existing.count += 1;
      }
    });

    // Convert map to array
    const uniqueProducts = Array.from(uniqueProductsMap.values());

    res.status(200).json({
      success: true,
      count: uniqueProducts.length,
      products: uniqueProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching unique products",
      error: error.message
    });
  }
};

// Get all farmers selling a specific product
export const getFarmersForProduct = async (req, res) => {
  try {
    const { productName } = req.params;

    // Find all product instances with this name from different farmers
    const products = await Product.find({
      name: { $regex: new RegExp('^' + productName + '$', 'i') }
    });

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found with this name",
      });
    }

    // Get product details from the first match
    const productDetails = {
      name: products[0].name,
      description: products[0].description,
      category: products[0].category,
      image_url: products[0].image_url,
    };

    // Extract all farmers who sell this product with their details
    const farmers = products.map(product => ({
      farmer_id: product.farmer_id,
      farmer_mobile: product.farmer_mobile,
      farmer_location: product.farmer_location,
      price: product.price,
      available_quantity: product.available_quantity,
      product_id: product._id,
      traceability: product.traceability
    }));

    res.status(200).json({
      success: true,
      product: productDetails,
      farmers: farmers,
      count: farmers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching farmers for this product",
      error: error.message,
    });
  }
};
