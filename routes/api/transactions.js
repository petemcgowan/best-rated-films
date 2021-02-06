const express = require('express');
const router = express.Router();
const Transaction = require('../../models/Transaction');

module.exports = router;


// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    console.log("controller:getTransactions called");
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    console.log("getTransactions:" + err);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const { text, amount } = req.body;

    const transaction = await Transaction.create(req.body);

    return res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    console.log("addTransaction:" + err);
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

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
router.delete('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if(!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found'
      });
    }

    await transaction.remove();

    return res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.log("deleteTransaction:" + err);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});
