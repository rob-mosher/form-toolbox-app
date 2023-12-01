const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const imageController = {};

imageController.convertToWebp = async (req, res, next) => {
  if (!req.file) return next(new Error('No file provided'));

  try {
    const fileType = path.extname(req.file.originalname).toLowerCase();
    const outputFiles = [];

    if (fileType === '.pdf') {
      // TODO PDF logic
      return next({ log: 'imageController.convertToWebp: Intentional error thrown - middleware does not yet support PDF files.' });
    }

    // Convert single page/image file to WEBP
    const webpBuffer = await sharp(req.file.buffer).webp().toBuffer();
    outputFiles.push({
      buffer: webpBuffer,
      filename: req.file.originalname.replace(fileType, '.webp'),
    });

    req.webpFiles = outputFiles;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = imageController;
