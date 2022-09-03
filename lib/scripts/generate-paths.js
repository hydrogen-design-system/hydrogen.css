// Hydrogen: Get user directories
'use strict';

// Vendor dependencies
var path = require('path');

// Hydrogen dependencies
var { log_info } = require('./logs');

/**
 * This function reads the user's configured input array, sanitizes it, and returns it in the requested format
 * @param {string} type 'array', 'string', or 'glob'
 * @returns a sanitized array, string, or glob, depending on the requested type
 */
function getUserInput(settings, type) {
  try {
    // Because settings.input is an array, loop through the array and sanitize each item
    var sanitizedArray = [];
    for (let i in settings.input) {
      var sanitizedPath = settings.input[i];
      // Check for prefixed / and remove it
      if (
        sanitizedPath.slice(0, 1) == '/' ||
        sanitizedPath.slice(0, 1) == '\\'
      ) {
        sanitizedPath = sanitizedPath.substring(1);
      }
      // Check for suffixed / and remove it
      if (sanitizedPath.slice(-1) == '/' || sanitizedPath.slice(-1) == '\\') {
        sanitizedPath = sanitizedPath.slice(0, -1);
      }
      sanitizedArray = sanitizedArray.concat(sanitizedPath);
    }
    // Return the requested type
    if (type === 'array') {
      var inputArray = [];
      for (let i in sanitizedArray) {
        inputArray = inputArray.concat(
          path.join(process.cwd() + '/' + sanitizedArray[i])
        );
      }
      return inputArray;
    } else if (type === 'string') {
      var inputString = '';
      for (let i in sanitizedArray) {
        inputString =
          inputString +
          path.join(process.cwd() + '/' + sanitizedArray[i] + '/**/*') +
          ',';
      }
      return inputString;
    } else if (type === 'glob') {
      var inputGlob = '';
      for (let i in sanitizedArray) {
        inputGlob =
          inputGlob +
          path.join(process.cwd() + '/' + sanitizedArray[i] + '/**/*') +
          ',';
      }
      return inputGlob;
    }
  } catch (error) {
    // Catch any errors ========================================================
    log_info(
      'error',
      'Unknown error',
      'Parsing user input path',
      null,
      null,
      null,
      [settings.path],
      error
    );
    return false;
  }
}

/**
 * This function reads the user's configured output string, sanitizes it, and returns it in the requested format
 * @param {string} type 'array', 'string', or 'glob'
 * @returns a sanitized array, string, or glob, depending on the requested type
 */
function getUserOutput(settings, type) {
  try {
    var sanitizedPath = settings.output;
    // Check for prefixed / and remove it
    if (sanitizedPath.slice(0, 1) == '/' || sanitizedPath.slice(0, 1) == '\\') {
      sanitizedPath = sanitizedPath.substring(1);
    }
    // Check for suffixed / and remove it
    if (sanitizedPath.slice(-1) == '/' || sanitizedPath.slice(-1) == '\\') {
      sanitizedPath = sanitizedPath.slice(0, -1);
    }
    // Return the requested type
    if (type === 'array') {
      var outputArray = [path.join(process.cwd() + '/' + sanitizedPath)];
      return outputArray;
    } else if (type === 'string') {
      var outputString = path.join(process.cwd() + '/' + sanitizedPath);
      return outputString;
    } else if (type === 'glob') {
      var outputGlob = path.join(process.cwd() + '/' + sanitizedPath + '/**/*');
      return outputGlob;
    }
  } catch (error) {
    // Catch any errors ========================================================
    log_info(
      'error',
      'Unknown error',
      'Parsing user output path',
      null,
      null,
      null,
      [settings.path],
      error
    );
    return false;
  }
}

module.exports = {
  getUserInput,
  getUserOutput,
};