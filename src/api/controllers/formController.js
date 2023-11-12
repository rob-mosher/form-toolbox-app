require('dotenv').config();
const { Form } = require('../models');

const formController = {};

formController.createForm = async (req, res, next) => {
  try {
    res.locals.form = await Form.create({
      status: 'initialized',
    });
    return next();
  } catch (err) {
    console.error('formController.createForm: Error creating a new form', err);
    return next(err);
  }
};

module.exports = formController;
