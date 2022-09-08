// Hydrogen tests: Build settings
'use strict';

// Vendor dependencies

// Hydrogen dependencies
var { build_test_settings } = require('../../build-settings');

function modify_settings(settings) {
  // Manipulate the settings for this test =====================================
  settings.input = 'markup';
  settings.output = 'styles';
  return settings;
}

build_test_settings('Parser test', modify_settings);