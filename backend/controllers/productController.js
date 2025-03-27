import Product from "../models/Product.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../uploads/products");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png) are allowed!"));
    }
  }
});

// Add new product
export const addProduct = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);

    // Get the image URL if an image was uploaded
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : "";

    // Create product data object
    const productData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: Number(req.body.price),
      available_quantity: Number(req.body.available_quantity),
      image_url: imageUrl,
      farmer_id: req.body.farmer_id,
      farmer_mobile: req.body.farmer_mobile,
      farmer_location: req.body.farmer_location,
      traceability: {
        farm_location: req.body["traceability.farm_location"],
        harvest_date: req.body["traceability.harvest_date"],
        harvest_method: req.body["traceability.harvest_method"],
        certified_by: req.body["traceability.certified_by"],
      },
    };
    //console.log(farmer_id);

    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'price', 'available_quantity', 'farmer_id'];
    const missingFields = requiredFields.filter(field => !productData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Validate numeric fields
    if (isNaN(productData.price) || productData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    if (isNaN(productData.available_quantity) || productData.available_quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Available quantity must be a non-negative number",
      });
    }

    // Create and save the product
    const product = new Product(productData);
    const savedProduct = await product.save();

    console.log('Product saved successfully:', savedProduct);

    // Send success response
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to add product",
    });
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
