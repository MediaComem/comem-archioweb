# Contributing

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [First-time setup](#first-time-setup)
- [Usage](#usage)
  - [Run slides server](#run-slides-server)
  - [Generate slides and deploy to GitHub pages](#generate-slides-and-deploy-to-github-pages)
  - [Create a new subject](#create-a-new-subject)
  - [Update tables of contents](#update-tables-of-contents)
- [Documentation](#documentation)
- [Configuration](#configuration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## First-time setup

```bash
git clone git@github.com:MediaComem/comem-archioweb.git
cd comem-archioweb
npm install
```

You will also have to re-run `npm install` when someones adds or updates a dependency.



## Usage

All the following commands should be run from the project's directory.

### Run slides server

```bash
npm start
```

This will serve the compiled slides (with live-reload) at [http://localhost:3000](http://localhost:3000).

### Generate slides and deploy to GitHub pages

```bash
npm run deploy
```

This will compile the slides and commit them to a [separate repository][docs-repo] that is published on GitHub Pages at [https://mediacomem.github.io/comem-archioweb/][docs].

**Warning:** this runs a script which requires a **Unix shell** (use Git Bash or equivalent on Windows).

### Create a new subject

* Create a new directory under `subjects`, e.g. `subjects/space-time-continuum`
* Copy the [subject template][subject-template] at `templates/README.md` into the new directory and edit as needed
* Create a `subjects/space-time-continuum/images` directory if you need images

### Update tables of contents

```bash
npm run doctoc
```

This will update the tables of contents in all Markdown files using [doctoc][doctoc].



## Documentation

To edit the slides, you should be familiar with:

* [Remark][remark]
* Remark's [Markdown syntax][remark-syntax]
* [md2remark][md2remark] (converter of regular Markdown to Remark Markdown)



## Configuration

The following environment variables can be used for customization:

* `$BROWSER` - The browser with which to open the slides when running the slides server (defaults to your system's browser)
* `$BUILD_DIR` - The directory in which the generated HTML slides are saved (defaults to `build`)
* `$LIVERELOAD_PORT` - The port on which the live-reload server is run (defaults to 35729)
* `$PORT` - The port on which the slides server is run (defaults to 3000)
* `$SOURCE_VERSION` - The branch/commit to which source links to GitHub (in the top-right corner of slides) will point to (defaults to the current branch, or the latest commit when using `npm run deploy`)
* `$WEB_URL` - The URL to which the home link (in the top-right corner of slides) will point to (defaults to `https://mediacomem.github.io/comem-archioweb/`)

You can also put these settings in a `local.config.js` file in the project's directory (which will be ignored by Git):

```js
exports.browser = 'Google Chrome';
exports.buildDir = 'build';
exports.liveReloadPort = 35729;
exports.port = 3000;
exports.sourceVersion = 'master';
exports.webUrl = 'https://mediacomem.github.io/comem-archioweb/';
```



[docs]: https://mediacomem.github.io/comem-archioweb/
[docs-repo]: https://github.com/MediaComem/comem-archioweb
[doctoc]: https://github.com/thlorenz/doctoc
[md2remark]: https://github.com/AlphaHydrae/md2remark#md2remark
[remark]: https://remarkjs.com
[remark-syntax]: https://github.com/gnab/remark/wiki/Markdown
[subject-template]: templates/README.md
