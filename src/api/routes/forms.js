const express = require('express');
const { Op } = require('sequelize');
const { Form } = require('../models');

const formsRouter = express.Router();

formsRouter.get('/', async (req, res) => {
  try {
    const forms = await Form.findAll({
      where: {
        status: {
          [Op.not]: 'deleted',
        },
      },
    });
    return res.status(200).json(forms);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

formsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findByPk(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (form.status !== 'deleted') {
      form.status = 'deleted';
      await form.save();
    } else {
      console.log(`Form ${id} previously marked as deleted, so action is needed, but proceeding as if delete action took place from the user's perspective.`);
    }

    return res.status(200).json({ message: 'Form marked as deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

formsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findByPk(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (form.status === 'deleted') {
      return res.status(404).json({ message: 'Form is deleted and not accessible' });
    }

    return res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = formsRouter;
