const express = require('express');
const { Op } = require('sequelize');

const { generatePresignedUrlsFromKeys } = require('../services/aws/s3/s3Functions');
const { Form } = require('../models');

const formsRouter = express.Router();

formsRouter.get('/', async (req, res, next) => {
  try {
    const forms = await Form.findAll({
      where: {
        isDeleted: false,
      },
    });
    return res.status(200).json(forms);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

formsRouter.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await Form.findByPk(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (!form.isDeleted) {
      form.isDeleted = true;
      await form.save();
    } else {
      console.log(`Form ${id} previously marked as deleted, so no action is needed, but proceeding as if delete action took place from the user's perspective.`);
    }

    return res.status(200).json({ message: 'Form marked as deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

formsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await Form.findByPk(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (form.isDeleted) {
      return res.status(404).json({ message: 'Form is deleted and not accessible' });
    }

    return res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

formsRouter.get('/:id/image-urls', async (req, res, next) => {
  const { id } = req.params;
  const form = await Form.findByPk(id);

  if (!form || form.isDeleted) {
    return res.status(404).json({ error: 'Form not found, or has been deleted' });
  }

  const { pages: pageCount } = form;
  const keys = [];

  for (let i = 1; i <= pageCount; i += 1) {
    const key = `exports/${id}/${i}.webp`;
    keys.push(key);
  }

  try {
    const presignedUrls = await generatePresignedUrlsFromKeys(keys);
    return res.json(presignedUrls);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error generating URLs' });
  }
});

module.exports = formsRouter;
