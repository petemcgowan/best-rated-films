const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');


// TODO: Shouldn't this be put into a route/controller model like the rest of the server side?  Or combine routes/controllers as they're shite

// data Models
const User = require('../../models/User');
const Film = require('../../models/Film');
const Filmstowatch = require('../../models/Filmstowatch');

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  console.log("routes/api/users, post user called")
  console.log("name, email, password" + name + email + password);
  console.log("req.body" + JSON.stringify(req.body));

  // Simple validation
  if(!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  try {
    User.findOne({ email })
      .then(user => {
        if(user) return res.status(400).json({ msg: 'User already exists' });

        const newUser = new User({
          name,
          email,
          password
        });

        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                jwt.sign(
                  { id: user.id },
                  config.get('jwtSecret'),
                  { expiresIn: 3600 },
                  (err, token) => {
                    if(err)
                      throw err;
                    // Set up database rows for new user
                    console.log ("users, user create: Create films to watch rows for email:" + email);

                    // Find all current films
                    Film.find().then(films => {
                      console.log ("users, films found length:" + films.length);
                      var filmsToWatch = [];
                      films.forEach(film => {
                        var newFilmObj = {
                          email: email,
                          title: film.title,
                        };
                        filmsToWatch.push(newFilmObj);
                      }); // films for
                      console.log ("filmsToWatch to create length:" + filmsToWatch.length);
                      Filmstowatch.create(filmsToWatch)
                      .then(filmsToWatch => {
                        console.log ("filmsToWatch created:" + JSON.stringify(filmsToWatch));
                        // User is successfull created, tell the user
                        res.json({
                          token,
                          user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                          }
                        });
                      }); // filmsToWatch then

                    }); // then
                  }
                )
              });
          })
        })  // bcrypt
      }) // user
    }
    catch (err) {
      console.log("users, register user error:" + err);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
});

module.exports = router;
