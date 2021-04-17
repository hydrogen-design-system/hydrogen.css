"use strict";

const { series, parallel, src, dest, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
var colors = require('colors');
const del = require('del');
var footer = require('gulp-footer');
const fs = require('fs');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');

// Set the Sass compiler to Dart Sass.
sass.compiler = require('sass');

// Load Hydrogen Modules
var loadDefaultConfig = require('./functions/config-default');
var loadUserConfig = require('./functions/config-user');
var loadMediaMap = require('./functions/map-media');
var loadColorMap = require('./functions/map-color');
var loadBorderWeightMap = require('./functions/map-border-weight');
var loadContainerMap = require('./functions/map-containers');
var setFontFaceCSS = require('./functions/set-font-face');
var loadFontFamilyMap = require('./functions/map-font-family');
var loadGradientMap = require('./functions/map-gradients');
var loadRadiusMap = require('./functions/map-radius');
var loadShadowMap = require('./functions/map-shadows');
var loadWhitespaceMap = require('./functions/map-whitespace');
var buildDevCSS = require('./functions/build-development-css');

// Signal task start.
function compileStartMessage(done) {
  console.log('Hydrogen: starting the compile...'.white);
  done();
}

// Load the config files.
var defaults;
var config;

function loadHydrogenConfig(done) {
  // Reset the variables.
  defaults = '';
  config = '';
  // Load the configs.
  defaults = loadDefaultConfig();
  config = loadUserConfig();
  // Signal completion.
  done();
}

// Clean Hydrogen
function cleanHydrogen() {
  return del('./' + config.folders.styles + '/hydrogen.css');
}

// Clean Stage
function cleanHydrogenCache() {
  return del('./' + config.folders.styles + '/hydrogen');
}

// Create the Hydrogen folder in the user's specified style path.
function createHydrogenCache(done) {
  fs.mkdirSync('./' + config.folders.styles + '/hydrogen');
  done();
}

// Cached H2
// This is required because each config setting needs to update a single instance of the Hydrogen file, otherwise they each create their own and overwrite the last.
function cacheHydrogenCore() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/core.scss')
    .pipe(dest('./' + config.folders.styles + '/hydrogen'));
}

function cacheHydrogenUtility() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/utility.scss')
    .pipe(dest('./' + config.folders.styles + '/hydrogen'));
}

// Media
var mediaMap = '';

function buildMediaMap(done) {
  // Reset the variables.
  mediaMap = '';
  // Load the media map.
  mediaMap = loadMediaMap(defaults, config);
  // Signal completion.
  done();
}

function setMediaMap() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/maps/_map-media.scss')
    .pipe(footer(mediaMap))
    .pipe(dest('./' + config.folders.styles + '/hydrogen/maps'));
}

// Color
var colorMap = '';

function buildColorMap(done) {
  // Reset the variables.
  colorMap = '';
  // Load the color map.
  colorMap = loadColorMap(defaults, config);
  // Signal completion.
  done();
}

function setColorMap() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/maps/_map-color.scss')
    .pipe(footer(colorMap))
    .pipe(dest('./' + config.folders.styles + '/hydrogen/maps'));
}

// Border Weights
var borderWeightMap = '';

function buildBorderWeightMap(done) {
  // Reset the variables.
  borderWeightMap = '';
  // Load the border weight map.
  borderWeightMap = loadBorderWeightMap(defaults, config);
  // Signal completion.
  done();
}

function setBorderWeightMap() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/maps/_map-border-weight.scss')
    .pipe(footer(borderWeightMap))
    .pipe(dest('./' + config.folders.styles + '/hydrogen/maps'));
}

// Containers
var containerMap = '';

function buildContainerMap(done) {
  // Reset the variables.
  containerMap = '';
  // Load the map.
  containerMap = loadContainerMap(defaults, config);
  // Signal completion.
  done();
}

function setContainerMap() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/maps/_map-containers.scss')
    .pipe(footer(containerMap))
    .pipe(dest('./' + config.folders.styles + '/hydrogen/maps'));
}

// Flex Grid
var flexgridEnabled = false;
var flexgridColumns;

function setFlexgridConfig(done) {
  // Reset the variables.
  flexgridEnabled = false;
  flexgridColumns = undefined;
  // Set the options.
  if (config.flexgrid != null && config.flexgrid != undefined && config.flexgrid.enabled == true) {
    // console.log('Hydrogen: you\'ve successfully enabled flexgrid!');
    flexgridEnabled = true;
  }
  if (config.flexgrid != null && config.flexgrid != undefined && config.flexgrid.columns != null && config.flexgrid.columns != undefined) {
    // console.log('Hydrogen: you\'ve set a custom grid column value!');
    flexgridColumns = config.flexgrid.columns;
  } else {
    flexgridColumns = defaults.flexgrid.columns;
  }
  done();
}

// Move the flexgrid core file.
function moveFlexgridCore(done) {
  if (flexgridEnabled == true) {
    return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/utilities/_core-flex-grid.scss')
      .pipe(dest('./' + config.folders.styles + '/hydrogen/utilities'));
  } else {
    done();
  }
}

// Modify the cached version of H2's core.
function enableFlexgridCore(done) {
  if (flexgridEnabled == true) {
    return src('./' + config.folders.styles + '/hydrogen/core.scss')
      .pipe(replace('// @use "utilities/core-flex-grid";', '@use "utilities/core-flex-grid";'))
      .pipe(dest('./' + config.folders.styles + '/hydrogen'));
  } else {
    done();
  }
}

// Move the flexgrid utility file.
function moveFlexgrid(done) {
  if (flexgridEnabled == true) {
    return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/utilities/_utility-flex-grid.scss')
      // Set the column variable to the user's specification, or use the default.
      .pipe(replace('$h2GridColumns: 12;', '$h2GridColumns: ' + flexgridColumns + ';'))
      .pipe(dest('./' + config.folders.styles + '/hydrogen/utilities'));
  } else {
    done();
  }
}

// Modify the cached version of H2.
function enableFlexgrid(done) {
  if (flexgridEnabled == true) {
    return src('./' + config.folders.styles + '/hydrogen/utility.scss')
      .pipe(replace('// @use "utilities/utility-flex-grid";', '@use "utilities/utility-flex-grid";'))
      .pipe(dest('./' + config.folders.styles + '/hydrogen'));
  } else {
    done();
  }
}

// Font Family
var fontFaceCSS = '';
var fontFamilyMap = '';

function buildFontFaceCSS(done) {
  // Reset the variables.
  fontFaceCSS = '';
  // Load the CSS.
  fontFaceCSS = setFontFaceCSS(defaults, config);
  // Signal completion.
  done();  
}

function buildFontFamilyMap(done) {
  // Reset the variables.
  fontFamilyMap = '';
  // Load the map.
  fontFamilyMap = loadFontFamilyMap(defaults, config);
  // Signal completion.
  done();
}

function setFontFamilyMap() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/maps/_map-font-families.scss')
    .pipe(footer(fontFamilyMap))
    .pipe(dest('./' + config.folders.styles + '/hydrogen/maps'));
}

// Font Size
function setFontBaseSize() {
  if (config.fontBaseSize != null && config.fontBaseSize != undefined) {
    return src('./' + config.folders.styles + '/hydrogen/core.scss')
      .pipe(replace('$h2-font-base-size: $H2FONTBASESIZE;', '$h2-font-base-size: ' + config.fontBaseSize + ';'))
      .pipe(dest('./' + config.folders.styles + '/hydrogen'));
  } else {
    return src('./' + config.folders.styles + '/hydrogen/core.scss')
      .pipe(replace('$h2-font-base-size: $H2FONTBASESIZE;', '$h2-font-base-size: ' + defaults.fontBaseSize + ';'))
      .pipe(dest('./' + config.folders.styles + '/hydrogen'));
  }
}

// Font Scale
function setCoreFontScale() {
  if (config.fontScale != null && config.fontScale != undefined && config.fontScale > 0) {
    return src('./' + config.folders.styles + '/hydrogen/core.scss')
      .pipe(replace('$h2-font-scale: $H2FONTSCALE;', '$h2-font-scale: ' + config.fontScale + ';'))
      .pipe(dest('./' + config.folders.styles + '/hydrogen'));
  } else {
    return src('./' + config.folders.styles + '/hydrogen/core.scss')
      .pipe(replace('$h2-font-scale: $H2FONTSCALE;', '$h2-font-scale: ' + defaults.fontScale + ';'))
      .pipe(dest('./' + config.folders.styles + '/hydrogen'));
  }
}
function setUtilityFontScale() {
  if (config.fontScale != null && config.fontScale != undefined && config.fontScale > 0) {
    return src('./' + config.folders.styles + '/hydrogen/utility.scss')
      .pipe(replace('$h2-font-scale: $H2FONTSCALE;', '$h2-font-scale: ' + config.fontScale + ';'))
      .pipe(dest('./' + config.folders.styles + '/hydrogen'));
  } else {
    return src('./' + config.folders.styles + '/hydrogen/utility.scss')
      .pipe(replace('$h2-font-scale: $H2FONTSCALE;', '$h2-font-scale: ' + defaults.fontScale + ';'))
      .pipe(dest('./' + config.folders.styles + '/hydrogen'));
  }
}

// Gradients
var gradientMap = '';

function buildGradientMap(done) {
  // Reset the variables.
  gradientMap = '';
  // Load the gradient map.
  gradientMap = loadGradientMap(defaults, config);
  // Signal completion.
  done();
}

function setGradientMap() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/maps/_map-gradient.scss')
  .pipe(footer(gradientMap))
  .pipe(dest('./' + config.folders.styles + '/hydrogen/maps'));
}

// Radius
var radiusMap = '';

function buildRadiusMap(done) {
  // Reset the variables.
  radiusMap = '';
  // Load the map.
  radiusMap = loadRadiusMap(defaults, config)
  // Signal completion.
  done();
}

function setRadiusMap() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/maps/_map-radius.scss')
    .pipe(footer(radiusMap))
    .pipe(dest('./' + config.folders.styles + '/hydrogen/maps'));
}

// Shadow
var shadowMap = '';

function buildShadowMap(done) {
  // Reset the variables.
  shadowMap = '';
  // Load the shadow map.
  shadowMap = loadShadowMap(defaults, config);
  // Signal completion.
  done();
}

function setShadowMap() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/maps/_map-shadow.scss')
    .pipe(footer(shadowMap))
    .pipe(dest('./' + config.folders.styles + '/hydrogen/maps'));
}

// Whitespace
// This map is used by both margins and padding in the Sass file.
var whitespaceMap = '';

function buildWhitespaceMap(done) {
  // Reset the variables.
  whitespaceMap = '';
  // Get the whitespace map.
  whitespaceMap = loadWhitespaceMap(defaults, config);
  // Signal completion.
  done();
}

function setWhitespaceMap() {
  return src('./node_modules/@hydrogen-design-system/hydrogen.css/lib/styles/maps/_map-whitespace.scss')
    .pipe(footer(whitespaceMap))
    .pipe(dest('./' + config.folders.styles + '/hydrogen/maps'));
}

// Compile
function compileCore() {
  return src('./' + config.folders.styles + '/hydrogen/core.scss')
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(dest('./' + config.folders.styles + '/hydrogen/compiled'));
}

function compileUtility() {
  return src('./' + config.folders.styles + '/hydrogen/utility.scss')
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(dest('./' + config.folders.styles + '/hydrogen/compiled'));
}

// Build the development CSS file.
// Get normalize.css
var normalizeCSS = fs.readFileSync('./node_modules/normalize.css/normalize.css').toString();

function createDevelopmentCSS(done) {
  // Build the CSS.
  buildDevCSS(config, normalizeCSS, fontFaceCSS);
  // Signal completion.
  done();
}

function successMessage(done) {
  console.log('[SUCCESS] Hydrogen: you\'ve successfully compiled a development version of Hydrogen in the '.green + config.folders.styles + '/' + ' folder.'.green);
  done();
}

// Prod Prep Task
const compileSeries = series(
  compileStartMessage,
  loadHydrogenConfig, 
  cleanHydrogen,
  cleanHydrogenCache, 
  createHydrogenCache, 
  cacheHydrogenCore, 
  cacheHydrogenUtility, 
  buildMediaMap, setMediaMap, 
  buildColorMap, setColorMap, 
  buildBorderWeightMap, setBorderWeightMap, 
  buildContainerMap, setContainerMap, 
  setFlexgridConfig, moveFlexgridCore, enableFlexgridCore, moveFlexgrid, enableFlexgrid, 
  buildFontFaceCSS, buildFontFamilyMap, setFontFamilyMap, setFontBaseSize, setCoreFontScale, setUtilityFontScale, 
  buildGradientMap, setGradientMap, 
  buildRadiusMap, setRadiusMap, 
  buildShadowMap, setShadowMap, 
  buildWhitespaceMap, setWhitespaceMap, 
  compileCore, 
  compileUtility,
  createDevelopmentCSS,
  successMessage
);

exports.compile = series(compileSeries);