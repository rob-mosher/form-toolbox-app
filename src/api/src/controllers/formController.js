require('dotenv').config();
const { createError } = require('../utils/error');
const { Form } = require('../models');

const formController = {};

formController.createForm = async (req, res, next) => {
  try {
    res.locals.form = await Form.create({
      status: 'initialized',
    });
    return next();
  } catch (err) {
    return next(createError({
      err,
      method: `${__filename}:createForm`,
      status: 500,
    }));
  }
};

formController.getForm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const form = await Form.findByPk(id);

    if (!form) {
      return next(createError({
        err: 'Form not found',
        method: `${__filename}:getForm`,
        status: 404,
      }));
    }

    if (!res.locals.allowDeleted && form.isDeleted) {
      return next(createError({
        err: 'Form is marked as deleted',
        method: `${__filename}:getForm`,
        status: 404,
      }));
    }

    res.locals.form = form;
    return next();
  } catch (err) {
    return next(createError({
      err,
      method: `${__filename}:getForm`,
      status: 500,
    }));
  }
};

module.exports = formController;
