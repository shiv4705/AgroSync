import express from "express";
import { 
  addProduct,
  getProductbyId,
  getAllProducts, 
  searchProductByCatagory,
  editProducts,
  deleteProducts,
  getSingleProduct,
  upload,
  getFarmersForProduct,
  getUniqueProducts
} from "../controllers/productController.js";

const router = express.Router();

router.post("/add-product", upload.single("image"), addProduct);
router.get("/farmer/:farmer_id", getProductbyId);
router.get("/consumer/allproducts", getAllProducts);
router.get("/category/:category", searchProductByCatagory);
router.get("/:product_id", getSingleProduct);
router.put("/update/:product_id", upload.single("image"), editProducts);
router.delete("/delete/:product_id", deleteProducts);
router.get('/unique', getUniqueProducts);
router.get('/farmers/:productName', getFarmersForProduct);


export { router as productRoute };
// router.get('/products/:productName/farmers', async (req, res) => {
//   try {
//     const { productName } = req.params;
    
//     // Find all product listings with matching name from MongoDB
//     const productListings = await Product.find({ name: productName });
    
//     // Extract farmer_ids to fetch farmer details from PostgreSQL
//     const farmerIds = productListings.map(product => product.farmer_id);
    
//     // Get farmer details from PostgreSQL using raw query for maximum compatibility
//     const [farmerDetails] = await sequelize.query(
//       `SELECT uid, email, "createdAt" FROM users 
//        WHERE uid IN (:farmerIds) AND role = 'farmer'`,
//       {
//         replacements: { farmerIds },
//         type: sequelize.QueryTypes.SELECT
//       }
//     );
    
//     // Create a map of farmer details for quick lookup
//     const farmerMap = {};
//     if (Array.isArray(farmerDetails)) {
//       farmerDetails.forEach(farmer => {
//         farmerMap[farmer.uid] = {
//           uid: farmer.uid,
//           email: farmer.email,
//           memberSince: farmer.createdAt
//         };
//       });
//     }
    
//     // Combine product listings with farmer details
//     const enrichedListings = productListings.map(product => {
//       const productObj = product.toObject();
//       return {
//         ...productObj,
//         farmerDetails: farmerMap[productObj.farmer_id] || { note: 'Farmer details unavailable' }
//       };
//     });
    
//     res.json(enrichedListings);
//   } catch (error) {
//     console.error('Error fetching farmers:', error);
//     res.status(500).json({ error: 'Failed to fetch farmers' });
//   }
// });

// export { router as productRoute };