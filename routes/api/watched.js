const express = require('express');
const router = express.Router();
const Watched = require('../../models/Watched');

module.exports = router;

// @desc    Get all watched
// @route   POST /api/watched
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    console.log("post/getWatched, req.body:" + JSON.stringify(req.body));
    const { email } = req.body;
    console.log("post/getWatched, email:" + JSON.stringify(email));
    const watched = await Watched.find({email: email}).exec();
    console.log("post/getWatched, watched:" + JSON.stringify(watched));

    return res.status(200).json({
      success: true,
      count: watched.length,
      data: watched
    });
  } catch (err) {
    console.log("post/getWatched:" + err);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Add watched
// @route   POST /api/watched/addWatched
// @access  Public
router.post('/addWatched', async (req, res, next) => {
  try {
    console.log("addWatched, req.body:" + JSON.stringify(req.body));
    const { title, email} = req.body;
    console.log("addWatched, title:" + title + ", email:" + email  );
    const film = await Watched.create(req.body);
    console.log("addWatched, after Watched create");

    return res.status(201).json({
      success: true,
      data: film
    });
  } catch (err) {
    console.log("addWatched:" + err);
    if(err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
});

// @desc    Delete watched
// @route   DELETE /api/watched/:id
// @access  Public
router.delete('/:id', async (req, res, next) => {
  try {
    console.log("deleteWatched, req.body:" + JSON.stringify(req.body));
    const watched = await Watched.findById(req.params.id);

    if(!watched) {
      return res.status(404).json({
        success: false,
        error: 'No watched found'
      });
    }

    await watched.remove();

    return res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.log("deleteWatched:" + err);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});
