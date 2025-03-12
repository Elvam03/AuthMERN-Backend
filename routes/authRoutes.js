const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();

// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
  }
});

// Request password reset
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Received forgot-password request for email:", email);

  const user = await User.findOne({ email });
  console.log("User found in DB:", user);

  if (!user) {
    console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
  }

  // Generate a token (valid for 1 hour)
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();

  // Send email with reset link
  // const resetLink = `https://authmern-backend-i3kc.onrender.com/reset-password/${token}`;
  const resetLink = `https://auth-mern-frontend-one.vercel.app/reset-password/${token}`;

  await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  });

  res.json({ message: "Password reset link sent to email" });
});

// Reset password route
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded.userId, resetToken: token });

      if (!user || user.resetTokenExpires < Date.now()) {
          return res.status(400).json({ message: "Invalid or expired token" });
      }

      // ✅ Remove reset token BEFORE updating the password
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "Password reset successfully" });
  } catch (error) {
      res.status(500).json({ message: "Invalid or expired token" });
  }
});



router.post("/signup", async (req, res) => {
  try {
    console.log("Signup Request Body:", req.body); // ✅ Log request body

    const { firstName, secondName, email, password } = req.body;

    if (!firstName || !secondName || !email || !password) {
      console.log("Missing fields:", req.body); // ✅ Log missing fields
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed Password:", hashedPassword); // ✅ Log hashed password

    // Create new user
    const newUser = new User({
      firstName,
      secondName,
      email,
      password: hashedPassword, // ✅ Ensure password is added
    });

    await newUser.save();
    console.log("User Created:", newUser); // ✅ Log saved user

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    console.log("Login Request Body:", req.body); // Debugging  

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Login Successful, Token Generated:", token);

    res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/protected", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Received Token:", token); // Debugging  

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    console.log("Authenticated User:", user);

    res.json(user);
  } catch (error) {
    console.error("Token Verification Failed:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
