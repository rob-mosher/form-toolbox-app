const express = require('express');
const formRouter = require('./forms');
const formTypesRouter = require('./formTypes');
const uploadRouter = require('./upload');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.use('/forms', formRouter);
router.use('/formtypes', formTypesRouter);
router.use('/upload', uploadRouter);

module.exports = router;
