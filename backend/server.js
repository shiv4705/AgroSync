import express from 'express';
import dotenv from 'dotenv';
import connectMongoDB from './config/mongoDb.js';
import { authRoutes } from './routes/authRoutes.js';
import { productRoute } from './routes/productRoute.js';
//import { orderRoutes } from './routes/orderRoutes.js';
import cors from "cors";

// import { profileRoutes } from './routes/profileRoutes.js';

dotenv.config();



const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
//app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoute);
//app.use('/api/orders', orderRoutes);
// app.use('/api/users', profileRoutes);

// Connect MongoDB
connectMongoDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});