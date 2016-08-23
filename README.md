# Travelscope
Interactive worldmap of visa-free travel

## About

A visual exploration of the travel freedom attached to passports using Three.js and D3.js.

This project uses the following libaries:

* [bootstrap-sass](http://getbootstrap.com/) Sass-powered version of Bootstrap 3, HTML, CSS, and JS framework
* [three](https://github.com/mrdoob/three.js) lightweight JavaScript 3D library using WebGL
* [d3](https://github.com/d3/d3) D3 (or D3.js) is a JavaScript library for visualizing data using web standards
* [Babel](http://babeljs.io) for ES6 and ES7 magic
* [ESLint](http://eslint.org) to maintain a consistent code style
* [gulp](http://gulpjs.com/) as a task runner
* [browserify](http://browserify.org/) for bundling
* [watchify](https://github.com/substack/watchify) for watching browserify builds

## Installation

### Install from source

First, clone or download:

```bash
$ git clone https://github.com/markuslerner/travelscope.git
// or
$ wget -O travelscope.zip https://github.com/markuslerner/travelscope/archive/master.zip
$ unzip travelscope.zip
```

Then, rename to your project name and change into the directory:

```bash
$ mv travelscope <my-project-name>
$ cd <my-project-name>
```

### Install dependencies

```bash
$ npm install
```

## Running Dev Server

```bash
$ npm start
```

Gulp will run a server on your local machine at port 3000. Whenever you change a source file it will re-compile client.js and reload your browser.


## Building distribution files (dist folder)

```bash
$ npm run deploy
```

## Delete distribution folder

```bash
$ npm run clean
```

– Markus Lerner, [@markuslerner](https://twitter.com/markuslerner)

