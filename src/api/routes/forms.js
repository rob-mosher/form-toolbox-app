const express = require('express');
const { Form } = require('../models');

const formsRouter = express.Router();

formsRouter.get('/', async (req, res) => {
  try {
    const forms = await Form.findAll();
    return res.status(200).json(forms);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

formsRouter.get('/:id', async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    return res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = formsRouter;
