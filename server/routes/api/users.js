const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

// data Models
const User = require("../../models/User");
const Film = require("../../models/Film");
const Filmstowatch = require("../../models/Filmstowatch");

// @desc    Register new user
router.post("/", (req, res) => {
  const { name, email, password } = req.body;
  console.log("routes/api/users, post user called");

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  try {
    User.findOne({ email }).then((user) => {
      if (user) return res.status(400).json({ msg: "User already exists" });

      const newUser = new User({
        name,
        email,
        password,
      });

      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then((user) => {
            jwt.sign(
              { id: user.id },
              config.get("jwtSecret"),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                // Set up database rows for new user
                // Find all current films
                Film.find().then((films) => {
                  var filmsToWatch = [];
                  films.forEach((film) => {
                    var newFilmObj = {
                      email: email,
                      title: film.title,
                    };
                    filmsToWatch.push(newFilmObj);
                  }); // films for
                  Filmstowatch.create(filmsToWatch).then((filmsToWatch) => {
                    console.log(
                      "filmsToWatch created:" + JSON.stringify(filmsToWatch)
                    );
                    // User is successfull created, tell the user
                    res.json({
                      token,
                      user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                      },
                    });
                  }); // filmsToWatch then
                }); // then
              }
            );
          });
        });
      }); // bcrypt
    }); // user
  } catch (err) {
    console.error(`users Error, register user error:err:${err}`);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;
