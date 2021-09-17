const _ = require('lodash');
const fs = require('fs');

const config = {
  title: 'Media Engineering Web-Oriented Architecture',
  version: '2020-2021',
  repoUrl: 'https://github.com/MediaComem/comem-archioweb',
  remark: {
    highlightLines: true,
    highlightSpans: true,
    countIncrementalSlides: false
  },
  subjectScripts: [],
  publish: {
    gitUrl: 'git@github.com:MediaComem/comem-archioweb.git',
    baseUrl: 'https://mediacomem.github.io/comem-archioweb',
    branch: 'gh-pages',
    version: '2020-2021'
  }
};

// Load `config.local.js` if it exists
if (fs.existsSync('./config.local.js')) {
  _.merge(config, require('./config.local'));
}

module.exports = config;
