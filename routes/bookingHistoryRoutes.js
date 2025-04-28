const express = require('express');
const router = express.Router();

// Example endpoint
router.get('/', (req, res) => {
  res.send('Booking History route working!');
});

module.exports = router;
