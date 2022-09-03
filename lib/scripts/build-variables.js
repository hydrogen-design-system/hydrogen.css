// Hydrogen: Build variables
'use strict';

// Vendor dependencies
var colors = require('colors');
var fs = require('fs');
var path = require('path');

// Hydrogen dependencies
var { getUserOutput } = require('./generate-paths');
var { log_info } = require('./logs');
var { log_timer } = require('./log-timer');
var { base_modifiers, tint_shade } = require('./parse-color');
var { buildTypography } = require('./build-typography');

/**
 * Builds CSS variables from the user's configuration and ensures that typography settings are adjusted for each media query they've specified.
 * @returns {string} CSS variables
 */
function build_variables(settings) {
  try {
    // Load the user's settings ================================================
    const typography_settings = buildTypography(settings);
    // Set up initial variables ================================================
    let variable_string = '';
    // Build the variables by looping type settings ============================
    typography_settings.forEach(function (
      typography_setting,
      typography_setting_index
    ) {
      // Check for a media query -----------------------------------------------
      // Most variables are generated in the base query only
      if (
        typography_setting.query != null &&
        typography_setting.query != 'base'
      ) {
        variable_string =
          variable_string + '@media ' + typography_setting.query + '{\n';
      }
      // Open the root ---------------------------------------------------------
      variable_string = variable_string + ':root{\n';
      // Build the core units --------------------------------------------------
      // Set the variable label ................................................
      variable_string = variable_string + '/* Core units */\n';
      // Build the variables ...................................................
      variable_string =
        variable_string +
        '--h2-base-font-size: ' +
        typography_setting.htmlSize +
        ';\n';
      variable_string =
        variable_string +
        '--h2-base-line-height: ' +
        typography_setting.line_height +
        ';\n';
      variable_string =
        variable_string +
        '--h2-base-whitespace: ' +
        typography_setting.line_height +
        ';\n';
      // Build colors and gradients --------------------------------------------
      if (
        typography_setting.query == null ||
        typography_setting.query === 'base'
      ) {
        // Set the variable label ..............................................
        variable_string = variable_string + '/* Colors */\n';
        // Build the variables .................................................
        if (
          settings.styles.tokens.colors != null ||
          settings.styles.tokens.colors != undefined ||
          settings.styles.tokens.colors != []
        ) {
          settings.styles.tokens.colors.forEach(function (
            color_setting,
            color_setting_index
          ) {
            // Build the standard color variable
            variable_string =
              variable_string +
              '--h2-color-' +
              color_setting.key +
              ': ' +
              color_setting.color +
              ';\n';
            // Build variables for the modifiers
            if (
              color_setting.modifiers == null ||
              color_setting.modifiers.length === 0
            ) {
              // They've chosen strictly automated modifiers
              base_modifiers.forEach(function (base_modifier, base_index) {
                // Generate the auto modifier
                let modified_color = tint_shade(
                  base_modifiers,
                  color_setting.color,
                  base_modifier.key
                );
                variable_string =
                  variable_string +
                  '--h2-color-' +
                  color_setting.key +
                  '-' +
                  base_modifier.key +
                  ': ' +
                  modified_color +
                  ';\n';
              });
            } else {
              // Create automated modifiers, but check for overwritten ones
              base_modifiers.forEach(function (base_modifier, base_index) {
                // Set up override variables
                let custom_override_status = false;
                let overwritten_color;
                // Loop through the modifier settings
                color_setting.modifiers.forEach(function (
                  modifier_setting,
                  config_index
                ) {
                  // Check to see if a modifier key matches the reserved modifiers
                  if (modifier_setting.key === base_modifier.key) {
                    custom_override_status = true;
                    overwritten_color = modifier_setting.color;
                  }
                });
                // Build the modifier variable based on whether they've overwritten a reserved modifier
                let final_color;
                if (custom_override_status === false) {
                  // They haven't overwritten the modifier, so generate the automatic value
                  let modified_color = tint_shade(
                    base_modifiers,
                    color_setting.color,
                    base_modifier.key
                  );
                  final_color = modified_color;
                } else {
                  // They have overwritten a reserved modifier, so generate the custom value
                  final_color = overwritten_color;
                }
                variable_string =
                  variable_string +
                  '--h2-color-' +
                  color_setting.key +
                  '-' +
                  base_modifier.key +
                  ': ' +
                  final_color +
                  ';\n';
              });
              // Create any remaining custom modifiers
              color_setting.modifiers.forEach(function (
                modifier_setting,
                modifier_setting_index
              ) {
                // Set up a modifier check to make sure the modifier doesn't match a reserved modifier
                let custom_modifier_state = true;
                base_modifiers.forEach(function (
                  base_modifier,
                  base_modifier_index
                ) {
                  if (modifier_setting.key === base_modifier.key) {
                    custom_modifier_state = false;
                  }
                });
                // If the modifier is in fact custom, build the variable
                if (custom_modifier_state === true) {
                  variable_string =
                    variable_string +
                    '--h2-color-' +
                    color_setting.key +
                    '-' +
                    modifier_setting.key +
                    ': ' +
                    modifier_setting.color +
                    ';\n';
                }
              });
            }
          });
        }
      }
      // Build containers ------------------------------------------------------
      if (
        typography_setting.query == null ||
        typography_setting.query === 'base'
      ) {
        // Set the variable label ..............................................
        variable_string = variable_string + '/* Container max widths */\n';
        // Build the variables .................................................
        if (
          settings.styles.tokens.containers != null &&
          settings.styles.tokens.containers != []
        ) {
          settings.styles.tokens.containers.forEach(function (
            container_setting,
            container_setting_index
          ) {
            variable_string =
              variable_string +
              '--h2-container-' +
              container_setting.key +
              ': ' +
              container_setting.max_width +
              ';\n';
          });
        }
      }
      // Build font families ---------------------------------------------------
      if (
        typography_setting.query == null ||
        typography_setting.query === 'base'
      ) {
        // Set the variable label ..............................................
        variable_string = variable_string + '/* Font families */\n';
        // Build the variables .................................................
        if (
          settings.styles.tokens.fonts != null &&
          settings.styles.tokens.fonts != []
        ) {
          settings.styles.tokens.fonts.forEach(function (
            container_setting,
            container_setting_index
          ) {
            variable_string =
              variable_string +
              '--h2-font-family-' +
              container_setting.key +
              ': ' +
              container_setting.family +
              ';\n';
          });
        }
      }
      // Build font sizes and line heights -------------------------------------
      // Set the variable label ................................................
      variable_string = variable_string + '/* Font sizes and line heights */\n';
      // Build the variables ...................................................
      // Captions
      variable_string =
        variable_string +
        '--h2-font-size-caption: ' +
        typography_setting.caption.size +
        ';\n';
      variable_string =
        variable_string +
        '--h2-line-height-caption: ' +
        typography_setting.caption.line_height +
        ';\n';
      // Copy
      variable_string =
        variable_string +
        '--h2-font-size-copy: ' +
        typography_setting.copy.size +
        ';\n';
      variable_string =
        variable_string +
        '--h2-line-height-copy: ' +
        typography_setting.copy.line_height +
        ';\n';
      // h6
      variable_string =
        variable_string +
        '--h2-font-size-h6: ' +
        typography_setting.h6.size +
        ';\n';
      variable_string =
        variable_string +
        '--h2-line-height-h6: ' +
        typography_setting.h6.line_height +
        ';\n';
      // h5
      variable_string =
        variable_string +
        '--h2-font-size-h5: ' +
        typography_setting.h5.size +
        ';\n';
      variable_string =
        variable_string +
        '--h2-line-height-h5: ' +
        typography_setting.h5.line_height +
        ';\n';
      // h4
      variable_string =
        variable_string +
        '--h2-font-size-h4: ' +
        typography_setting.h4.size +
        ';\n';
      variable_string =
        variable_string +
        '--h2-line-height-h4: ' +
        typography_setting.h4.line_height +
        ';\n';
      // h3
      variable_string =
        variable_string +
        '--h2-font-size-h3: ' +
        typography_setting.h3.size +
        ';\n';
      variable_string =
        variable_string +
        '--h2-line-height-h3: ' +
        typography_setting.h3.line_height +
        ';\n';
      // h2
      variable_string =
        variable_string +
        '--h2-font-size-h2: ' +
        typography_setting.h2.size +
        ';\n';
      variable_string =
        variable_string +
        '--h2-line-height-h2: ' +
        typography_setting.h2.line_height +
        ';\n';
      // h1
      variable_string =
        variable_string +
        '--h2-font-size-h1: ' +
        typography_setting.h1.size +
        ';\n';
      variable_string =
        variable_string +
        '--h2-line-height-h1: ' +
        typography_setting.h1.line_height +
        ';\n';
      // Build gradients -------------------------------------------------------
      if (
        typography_setting.query == null ||
        typography_setting.query === 'base'
      ) {
        // Set the variable label ..............................................
        variable_string = variable_string + '/* Gradients */\n';
        // Build the variables .................................................
        if (
          settings.styles.tokens.gradients != null &&
          settings.styles.tokens.gradients != []
        ) {
          settings.styles.tokens.gradients.forEach(function (
            gradient_setting,
            gradient_setting_index
          ) {
            variable_string =
              variable_string +
              '--h2-gradient-' +
              gradient_setting.key +
              ': ' +
              gradient_setting.gradient +
              ';\n';
          });
        }
      }
      // Build radii -----------------------------------------------------------
      if (
        typography_setting.query == null ||
        typography_setting.query === 'base'
      ) {
        // Set the variable label ..............................................
        variable_string = variable_string + '/* Radii */\n';
        // Build the variables .................................................
        if (
          settings.styles.tokens.radii != null &&
          settings.styles.tokens.radii != []
        ) {
          settings.styles.tokens.radii.forEach(function (
            radius_setting,
            radius_setting_index
          ) {
            variable_string =
              variable_string +
              '--h2-radius-' +
              radius_setting.key +
              ': ' +
              radius_setting.radius +
              ';\n';
          });
        }
      }
      // Build shadows ---------------------------------------------------------
      if (
        typography_setting.query == null ||
        typography_setting.query === 'base'
      ) {
        // Set the variable label ..............................................
        variable_string = variable_string + '/* Radii */\n';
        // Build the variables .................................................
        if (
          settings.styles.tokens.shadows != null &&
          settings.styles.tokens.shadows != []
        ) {
          settings.styles.tokens.shadows.forEach(function (
            shadow_setting,
            shadow_setting_index
          ) {
            variable_string =
              variable_string +
              '--h2-shadow-' +
              shadow_setting.key +
              ': ' +
              shadow_setting.shadow +
              ';\n';
          });
        }
      }
      // Build transition values -----------------------------------------------
      if (
        typography_setting.query == null ||
        typography_setting.query === 'base'
      ) {
        // Set the variable label ..............................................
        variable_string = variable_string + '/* Transitions */\n';
        // Build the variables .................................................
        if (
          settings.styles.tokens.transitions != null &&
          settings.styles.tokens.transitions != {}
        ) {
          // Build transition duration variables
          if (settings.styles.tokens.transitions.durations != null) {
            settings.styles.tokens.transitions.durations.forEach(function (
              duration_setting,
              duration_setting_index
            ) {
              variable_string =
                variable_string +
                '--h2-transition-duration-' +
                duration_setting.key +
                ': ' +
                duration_setting.duration +
                ';\n';
            });
          }
          // Build transition function variables
          if (settings.styles.tokens.transitions.functions != null) {
            settings.styles.tokens.transitions.functions.forEach(function (
              function_setting,
              function_setting_index
            ) {
              variable_string =
                variable_string +
                '--h2-transition-function-' +
                function_setting.key +
                ': ' +
                function_setting.function +
                ';\n';
            });
          }
          // Build transition delay variables
          if (settings.styles.tokens.transitions.delays != null) {
            settings.styles.tokens.transitions.delays.forEach(function (
              delay_setting,
              delay_setting_index
            ) {
              variable_string =
                variable_string +
                '--h2-transition-delay-' +
                delay_setting.key +
                ': ' +
                delay_setting.delay +
                ';\n';
            });
          }
        }
      }
      // Build whitespace convenience variables --------------------------------
      if (
        typography_setting.query == null ||
        typography_setting.query === 'base'
      ) {
        // Set the variable label ..............................................
        variable_string = variable_string + '/* Whitespace shortcuts */\n';
        variable_string =
          variable_string +
          '/* Note that these are merely for convenience. You can create any calc function you need using the --h2-base-whitespace variable */\n';
        // Build the variables .................................................
        for (let i = 1; i < 11; i++) {
          variable_string =
            variable_string +
            '--h2-whitespace-' +
            i +
            ': calc(var(--h2-base-whitespace) * ' +
            i +
            ');\n';
        }
      }
      // Close the root ========================================================
      variable_string = variable_string + '}\n';
      // Close the query loop if one has been opened ---------------------------
      if (typography_setting.query != null && typography_setting != 'base') {
        variable_string = variable_string + '}\n';
      }
    });
    // Return the final variable string ========================================
    return variable_string;
  } catch (error) {
    // Catch any errors ========================================================
    log_info(
      'error',
      'Unknown error',
      'Building CSS variables',
      null,
      null,
      null,
      null,
      error
    );
    return false;
  }
}

/**
 * Loads build_variables and then writes them to a unique CSS file that can be imported on the user's project.
 * @returns CSS file containing CSS variables
 */
function write_variable_file(settings) {
  try {
    // Start the timer =========================================================
    const buildVariablesTimerStart = process.hrtime.bigint();
    // Load the variables ======================================================
    let css_variables = build_variables(settings);
    // Delete existing files ===================================================
    if (
      fs.existsSync(
        path.join(getUserOutput(settings, 'string') + '/hydrogen.vars.css')
      ) == true
    ) {
      fs.unlinkSync(
        path.join(getUserOutput(settings, 'string') + '/hydrogen.vars.css')
      );
    }
    // Write the new file ======================================================
    fs.writeFileSync(
      path.join(getUserOutput(settings, 'string') + '/hydrogen.vars.css'),
      css_variables
    );
    // End the timer and print results =========================================
    const buildVariablesTimerEnd = process.hrtime.bigint();
    log_timer(
      settings,
      'CSS variable file generation',
      buildVariablesTimerStart,
      buildVariablesTimerEnd
    );
  } catch (error) {
    // Catch any errors ========================================================
    log_info(
      'error',
      'Unknown error',
      'Writing the variable file',
      null,
      null,
      null,
      [path.resolve(getUserOutput(settings, 'string'), 'hydrogen.vars.css')],
      error
    );
    return false;
  }
}

module.exports = {
  build_variables,
  write_variable_file,
};