const express = require('express');
const formRouter = require('./forms');
const uploadRouter = require('./upload');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.use('/forms', formRouter);
router.use('/upload', uploadRouter);

module.exports = router;
