const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// @desc    Get user data
router.get("/user", auth, (req, res) => {
  console.log("routes/api/auth/user, get user called");
  console.log(`user.email called:${req.user.email}`);
  User.findById(req.user.email)
    .select("-password")
    .then((user) => res.json(user));
});

module.exports = router;

// @desc    Auth user
router.post("/", (req, res) => {
  const { email, password } = req.body;
  console.log("routes/api/auth, post auth user called");

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User Does not exist" });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign(
        { id: user.email },
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
    });
  });
});
