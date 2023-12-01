const express = require('express');
const { Op } = require('sequelize');

const { FormType } = require('../models');

const formTypesRouter = express.Router();

// For efficiency, only include the id and name when providing all formTypes.
formTypesRouter.get('/', async (req, res, next) => {
  try {
    const formTypes = await FormType.findAll({
      attributes: ['id', 'name'],
    });
    return res.json(formTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

formTypesRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const formType = await FormType.findAll({
      attributes: ['id', 'name', 'schema'],
      where: {
        id,
      },
    });
    return res.json(formType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = formTypesRouter;
