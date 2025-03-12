const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
        if (!req.user) return res.status(404).json({ message: "User not found" });

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
const adminAuth = (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      if (!decoded.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
  
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  

  module.exports = { authenticateUser, adminAuth };
