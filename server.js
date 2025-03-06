const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path"); // ✅ Add path
const User = require("./models/User"); // ✅ Ensure the User model exists

const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Middleware
// app.use(express.json());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ Define multer storage BEFORE using it in routes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage }); // ✅ Now it's defined before usage

// ✅ Profile Image Upload Route
app.post("/api/profile/upload-profileImage", upload.single("profileImage"), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId || !req.file) return res.status(400).json({ error: "Missing data" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ profileImage: user.profileImage });
  } catch (error) {
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

    user.backgroundImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ backgroundImage: user.backgroundImage });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/profile/:userId", async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findById(userId); // Adjust based on your database structure

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
  } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Server error" });
  }
});


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
