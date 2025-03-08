const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const User = require("./models/User"); // Ensure the User model exists
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

dotenv.config();


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: "*" }));

// Enable CORS
app.use(cors({
  origin: "https://auth-mern-frontend-one.vercel.app/", // Allow your frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true // Allow cookies, if needed
}));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

  app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

  
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
app.get("/api/profile/:userId", async (req, res) => {
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

app.put('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const { profileImage, backgroundImage } = req.body;

  try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (profileImage) user.profileImage = profileImage;
      if (backgroundImage) user.backgroundImage = backgroundImage;

      await user.save();
      res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
});


// Test API
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
