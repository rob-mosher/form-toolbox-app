const express = require('express');
const formRouter = require('./forms');
const formTypesRouter = require('./formTypes');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.use('/forms', formRouter);
router.use('/formtypes', formTypesRouter);

module.exports = router;
