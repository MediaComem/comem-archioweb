const chain = require('gulp-chain');
const gulp = require('gulp');
const path = require('path');
const through = require('through2');
const util = require('gulp-util');

const generatePdfFromSlides = require('./pdf');

gulp.task('pdf', function() {
  return gulp
    .src('build/subjects/*/**/index.html')
    .pipe(generatePdf());
});

const generatePdf = chain(function(stream) {
  const base = 'build/subjects';
  const dest = path.relative(__dirname, 'pdf');
  return stream
    .pipe(through.obj((file, enc, callback) => {
      const relativePath = path.relative(base, file.path);
      const destPath = `${path.dirname(relativePath)}.pdf`;
      const pdfFile = path.join(dest, destPath);
      generatePdfFromSlides(file.path, pdfFile).then(() => {
        util.log(`Generated ${util.colors.magenta(pdfFile)}`);
        callback(undefined, file)
      }, callback);
    }));
});
