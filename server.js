const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const userRoutes = require("./routes/authRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const rewardUserRoutes = require("./routes/userReward");
const verification = require("./routes/verificationRoutes");
const { cloudinaryConnect } = require("./config/cloudinary");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect Cloudinary
cloudinaryConnect();

// File upload setup
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
    limits: { fileSize: 10 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// CORS setup
app.use(
  cors({
    origin: [
      "https://golden-admin-rouge.vercel.app",
      "https://golden-4.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Middleware
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes

app.use("/api/auth", userRoutes);
app.use("/api/verification", verification);
app.use("/api/rewards", rewardRoutes);
app.use("/api/user-rewards",rewardUserRoutes)

// Connect DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
