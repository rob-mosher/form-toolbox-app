const express = require('express');
const uploadRouter = require('./upload');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.use('/upload', uploadRouter);

module.exports = router;
