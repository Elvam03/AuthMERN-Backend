const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const User = require("./models/User"); // Ensure the User model exists
const authRoutes = require("./routes/authRoutes");

dotenv.config();
app.use(cors({ origin: "*" }));

const app = express();

// Middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

  app.use("/api/auth", authRoutes);
  
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pictures", // Cloudinary folder
    format: async (req, file) => "jpg", // Convert all images to JPG
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });

// ✅ Profile Image Upload Route
app.post("/api/profile/upload-profileImage", upload.single("profileImage"), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId || !req.file) return res.status(400).json({ error: "Missing data" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Save Cloudinary URL instead of local path
    user.profileImage = req.file.path;
    await user.save();

    res.json({ profileImage: user.profileImage });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Background Image Upload Route
app.post("/api/profile/upload-backgroundImage", upload.single("backgroundImage"), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId || !req.file) return res.status(400).json({ error: "Missing data" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Save Cloudinary URL instead of local path
    user.backgroundImage = req.file.path;
    await user.save();

    res.json({ backgroundImage: user.backgroundImage });
  } catch (error) {
    console.error("Error uploading background image:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fetch User Profile Data
app.get("/api/profile/userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Test API
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
