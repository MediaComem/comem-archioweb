const chain = require('gulp-chain');
const gulp = require('gulp');
const doctoc = require('gulp-doctoc');
const path = require('path');
const through = require('through2');
const util = require('gulp-util');

const generatePdfFromSlides = require('./pdf');

const src = {
  doctoc: [ 'README.md', 'CONTRIBUTING.md', 'subjects/**/*.md', '!subjects/**/node_modules/**/*.md' ],
  pdfSource: 'build/subjects/*/**/index.html'
};

gulp.task('doctoc', function() {
  return gulp
    .src(src.doctoc, { base: '.' })
    .pipe(doctoc({
      depth: 3,
      notitle: true,
      mode: 'github.com'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('pdf', function() {
  return gulp
    .src(src.pdfSource)
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
