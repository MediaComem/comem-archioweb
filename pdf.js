const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

/**
 * Converts the specified HTML source file to PDF and saves it to the specified destination path.
 *
 * Uses https://www.npmjs.com/package/html-pdf to perform the conversion with PhantomJS.
 *
 * @param {String} src - The path to the HTML file to convert
 * @param {String} dest - The path to save the generated PDF file to
 * @param {Object} options - Options to pass to html-pdf
 * @param {String} options.width - The width of the screen (defaults to "1024px")
 * @param {String} options.height - The height of the screen (defaults to "768px")
 * @returns {Promise} A promise that will be resolved with the result of calling html-pdf on the source file
 */
module.exports = function generatePdfFromSlides(src, dest, options) {
  if (!src || !src.match(/\.html$/)) {
    throw new Error('Source file ${src} is not an HTML file');
  } else if (!fs.existsSync(src)) {
    throw new Error(`Source file ${src} doesn't exist`);
  }

  // Read HTML from src file
  const html = fs.readFileSync(src, 'utf-8');

  // Base options (cannot be overriden)
  const pdfOptions = {
    base: `file://${path.resolve(src)}`
  };

  // Options from environment variables
  const envOptions = {
    width: process.env.PDF_WIDTH,
    height: process.env.PDF_HEIGHT
  };

  // Default options
  const defaultOptions = {
    width: '1024px',
    height: '768px'
  };

  _.defaults(pdfOptions, options, envOptions, defaultOptions);

  return new Promise((resolve, reject) => {
    // Convert HTML to PDF
    pdf.create(html, pdfOptions).toFile(dest, function(err, res){
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
};

