# Travelscope
Interactive worldmap of visa-free travel

## About

A visual exploration of the travel freedom attached to passports using [three.js](https://github.com/mrdoob/three.js) and [d3](https://github.com/d3/d3).

The weight and the travel freedom attached to a passport vary drastically across nationalities. International visa-regulations are very complex and often non-transparent. They reflect the economical and geopolitical situations as well as the relationships of countries.

This project aims to cast some light on these structures. The default <i>Visa-free destinations</i> mode shows a <a href="https://en.wikipedia.org/wiki/Choropleth_map" target=“_blank”>choropleth map</a>, which is shaded based on the number of destination countries an individual of a certain nationality can travel to without a visa or with visa on arrival.

The visa requirements are pulled from <a href="http://en.wikipedia.org/wiki/Category:Visa_requirements_by_nationality" target="_new">Wikipedia</a> in regular intervals and matched to the countries/territories via the sovereignty of the respective country/territory.

This project uses the following libaries/technologies:

* [bootstrap](http://getbootstrap.com/) Bootstrap 3: HTML, CSS, and JS framework
* [three.js](https://github.com/mrdoob/three.js) lightweight JavaScript 3D library using WebGL
* [d3](https://github.com/d3/d3) D3 (or D3.js) is a JavaScript library for visualizing data using web standards
* [d3-threeD](https://github.com/asutherland/d3-threeD) hooking d3.js up to three.js
* [tween.js](https://github.com/tweenjs/tween.js) Javascript tweening engine
* [Sass](http://sass-lang.com/) powerful CSS extension language
* [gulp](http://gulpjs.com/) as a task runner
* [browserify](http://browserify.org/) for bundling
* [watchify](https://github.com/substack/watchify) for watching browserify builds
* [Babel](http://babeljs.io) for ES6 and ES7 magic
* [ESLint](http://eslint.org) to maintain a consistent code style


## Installation

### Install from source

First, clone or download:

```bash
$ git clone https://github.com/markuslerner/travelscope.git
```
or

```bash
$ wget -O travelscope.zip https://github.com/markuslerner/travelscope/archive/master.zip
$ unzip travelscope.zip
```

Optionally rename to your project name and change into the directory:

```bash
$ mv travelscope <my-project-name>
$ cd <my-project-name>
```

### Install dependencies

```bash
$ npm install
```


### Install gulp globally

Only, if gulp isn't installed yet.

```bash
$ sudo npm install --global gulp-cli
```


## Running dev server

Files are compiled to `dev` folder, which is automatically created, if it doesn't exist.

```bash
$ gulp
```

Gulp will run a server on your local machine at port 3000. Whenever you change a source file it will re-compile client.js and reload your browser.


## Building production files

Files are compiled to `public` folder.

```bash
$ gulp deploy
```


## Application Structure


```
.
├── dev                            # Development folder created by gulp/browserify
├── public                         # Distribution folder
│   └── index.php                  # Production index.php file
└── src                            # Application source code
    ├── assets                     # Asset files
    │   ├── fonts                  # Font files
    │   └── img                    # Image files
    ├── client                     # Application JS folder
    │   ├── config.js              # Application settings file
    │   ├── jquery                 # jQuery plugins
    │   ├── jquery-ui              # jQuery UI
    │   ├── LogTerminal            # Window overlay log terminal
    │   ├── thirdparty             # Thirdparty JS files
    │   ├── three                  # Three.js extras
    │   ├── utils                  # Utility function
    │   └── worldmap               # Application core files
    │       ├── geometry.js        # Geometry functions
    │       ├── index.js           # Main application file
    │       ├── panel.js           # UI Panel for displaying content
    │       └── userinterface.js   # UI functions
    ├── client.js                  # Main JS file
    ├── index.html                 # Main HTML page container for app used for development
    └── scss                       # SCSS source files
```


– Markus Lerner, [markuslerner.com](http://www.markuslerner.com)

