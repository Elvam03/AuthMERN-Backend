const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User"); // Ensure the User model exists
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const favoriteRoutes = require('./routes/favoriteRoutes');
const jwt = require("jsonwebtoken");
const resourceRoutes = require("./routes/resourceRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://auth-mern-frontend-one.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) { 
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api", favoriteRoutes);

// ✅ Test API
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
