const docs_layout = require('../../../../_includes/pages/docs.11ty');

let data = {
  layout: 'pages/docs.11ty.js',
  navigation: {
    order: 9,
    key: 'creating-themes',
    parent: 'configuration',
    pagination: true,
  },
  title: 'Creating themes',
  subtitle: 'Learn how to configure themes and their style tokens.',
  main: [
    {
      type: 'title',
      label: 'Theme basics',
      id: 'basics',
    },
    {
      type: 'copy',
      items: [
        "Themes are groups of settings that define a series of reusable design-token-style settings for your project. Normally, one theme (the default theme) will be all you'll need to style your project, and you can define all of your style options within it. Occasionally, having multiple themes is beneficial, and Hydrogen allows you to define as many themes as you need.",
        "Theme style values act as variables of sorts, where you define a key and assign it a unique style value. You'll then be able to use that key inside of relevant Hydrogen attributes: <code>data-h2-color='base(myColorKey)'</code>. This is powerful because it enables designers to create and set concrete, reusable style values that can be changed project-wide in a matter of seconds.",
      ],
    },
    {
      type: 'section',
      content: [
        {
          type: 'title',
          label: 'The default theme',
          id: 'default',
        },
        {
          type: 'copy',
          items: [
            "Hydrogen requires that you have at least one theme defined in your configuration, and that theme must have its <code>key</code> value set to <code>default</code>. This default theme allows you to set base styles for your project and doesn't require any special work to be applied.",
            "Subsequent themes require a unique key value and when used in your code, only work if your project's <code>data-h2</code> wrapper value contains the theme's key as a value.",
          ],
        },
      ],
    },
    {
      type: 'title',
      label: 'Core settings',
      id: 'core',
    },
    {
      type: 'section',
      content: [
        {
          type: 'title',
          label: 'The theme key',
          id: 'key',
        },
        {
          type: 'group',
          items: [
            {
              type: 'copy',
              items: [
                'The key definition for your theme sets the value you will use inside of Hydrogen attributes to trigger theme styles. As described above, there must always be a theme with the key set to <code>default</code> in your settings, but you can then name other themes using custom values.',
                'For example, if you set the theme\'s key to <code>myTheme</code>, you would use it inside of a Hydrogen attribute like this: <code>data-h2-color="base:myTheme(primary)"</code>. This style would only trigger when the theme\'s key was applied to the site-wide <code>data-h2</code> attribute.',
              ],
            },
            {
              type: 'code',
              file: 'hydrogen.config.json',
              lines: ['"key": "myTheme",'],
            },
          ],
        },
        {
          type: 'title',
          label: 'Typography',
          id: 'typography',
        },
        {
          type: 'group',
          items: [
            {
              type: 'copy',
              items: [
                "A theme's typography settings allow you to customize how Hydrogen's typography system will generate font sizes and layout whitespace values. By linking the typography setting with a media query defined in your <code>media</code> settings, you can trigger different styles at different breakpoints in order to create the best possible experience for the amount of space available.",
                'You can add as many typography definitions as you need to achieve your intended level of granularity and control.',
              ],
            },
            {
              type: 'list',
              style: 'unordered',
              items: [
                "<code>query_key</code> accepts any of the keys you've defined in your <code>media</code> settings. This will trigger the typography object's settings at that media query. Setting the value to <code>base</code> (or your custom base query key) will set that specific typography setting to be the default setting.",
                "<code>size</code> allows you to set the base font size on the <code>html</code> element. This will then set the foundation for your body copy and subsequent headings. It's recommended that you use a percentage value for this setting to avoid removing control from the user's accessibility options.",
                "<code>line_height</code> will set your body copy's line height and also be used to generate the vertical rhythm and layout whitespace values.",
                "<code>type_scale</code> will tell Hydrogen how to generate heading sizes from <code>h6</code> through <code>h1</code>. The <a href='https://type-scale.com/' title='Learn more about type scales.' target='_blank' rel='noreferrer'>type scale website</a> provides helpful information about type scales and how they work.",
              ],
            },
            {
              type: 'code',
              file: 'hydrogen.config.json',
              lines: [
                '"typography": [',
                '  {',
                '    "query_key": "base",',
                '    "size": "100%",',
                '    "line_height": "1.4",',
                '    "type_scale": "1.25",',
                '  },',
                '  ...',
                '],',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'title',
      label: 'Theme styles',
      id: 'styles',
    },
    {
      type: 'group',
      items: [
        {
          type: 'copy',
          items: [
            'Hydrogen provides a handful of style settings that allow you to define custom, reusable values that you can access inside of Hydrogen attributes. You can think of these theme style settings as design tokens - by configuring these values, you ensure that common values are always used consistently, as well as allowing you to change individual values site-wide by altering your configuration.',
            'Theme style settings have two sets of values: their <code>default</code> settings, and <strong>optional</strong> <code>dark</code> mode settings. By providing custom <code>dark</code> mode styles for a setting, you can granularly control how a specific setting alters its look or layout for that specific mode.',
          ],
        },
        {
          type: 'code',
          file: 'hydrogen.config.json',
          lines: [
            '"setting": [',
            '  {',
            '    "key": "",',
            '    "default": {',
            '      "value": "",',
            '    },',
            '    "dark": {',
            '      "value": "",',
            '    },',
            '  },',
            '],',
          ],
        },
      ],
    },
    {
      type: 'section',
      content: [
        {
          type: 'title',
          label: 'Colors',
          id: 'colors',
        },
        {
          type: 'group',
          items: [
            {
              type: 'copy',
              items: [
                'Colors are one of the most important settings you can configure for a theme. Each color requires a key value and a default CSS color value, but also provides customizable modifier options should you need them.',
              ],
            },
            {
              type: 'list',
              style: 'unordered',
              items: [
                '<code>color</code> accepts any CSS color value (e.g. hex, rgba, etc.).',
                'The modifiers array allows you to define custom modifiers for this color. Modifiers are accessed in code using dot notation. For example: <code>data-h2-color="base(primary.dark)"</code>. By default, Hydrogen generates 6 modifiers for you:',
                [
                  '<code>light</code>',
                  '<code>lighter</code>',
                  '<code>lightest</code>',
                  '<code>dark</code>',
                  '<code>darker</code>',
                  '<code>darkest</code>',
                ],
                'You can overwrite these default modifiers by specifying their key, or you can create your own modifiers using custom keys.',
              ],
            },
            {
              type: 'code',
              file: 'hydrogen.config.json',
              lines: [
                '"colors": [',
                '  {',
                '    "key": "primary",',
                '    "default": {',
                '      "color": "#9D5CFF",',
                '      "modifiers": [',
                '        "key": "myModifier",',
                '        "color": "#B340E8"',
                '      ],',
                '    },',
                '  },',
                '  ...',
                '],',
              ],
            },
          ],
        },
        {
          type: 'title',
          label: 'Containers',
          id: 'containers',
        },
        {
          type: 'group',
          items: [
            {
              type: 'copy',
              items: [
                'Containers allow you to specify consistent, reusable width values that can be helpful in ensuring consistent page or element sizes.',
              ],
            },
            {
              type: 'list',
              style: 'unordered',
              items: [
                "<code>max_width</code> allows you to set the container's width value in any CSS unit.",
              ],
            },
            {
              type: 'code',
              file: 'hydrogen.config.json',
              lines: [
                '"containers": [',
                '  {',
                '    "key": "small",',
                '    "default": {',
                '      "max_width": "39rem",',
                '    },',
                '  },',
                '  ...',
                '],',
              ],
            },
          ],
        },
        {
          type: 'title',
          label: 'Fonts',
          id: 'fonts',
        },
        {
          type: 'group',
          items: [
            {
              type: 'copy',
              items: [
                'The <code>fonts</code> configuration allows you to define reusable font family values.',
              ],
            },
            {
              type: 'list',
              style: 'unordered',
              items: [
                "<code>family</code> accepts any CSS font family value, including comma separated values. Don't forget to include <code>'</code> characters around family names where necessary.",
              ],
            },
            {
              type: 'code',
              file: 'hydrogen.config.json',
              lines: [
                '"fonts": [',
                '  {',
                '    "key": "sans",',
                '    "default": {',
                '      "family": "sans-serif",',
                '    },',
                '  },',
                '  ...',
                '],',
              ],
            },
          ],
        },
        {
          type: 'title',
          label: 'Gradients',
          id: 'gradients',
        },
        {
          type: 'group',
          items: [
            {
              type: 'copy',
              items: [
                'The <code>gradients</code> option allows you to define reusable linear or radial gradient values that can be used in properties such as <code>background</code>.',
              ],
            },
            {
              type: 'list',
              style: 'unordered',
              items: [
                '<code>gradient</code> accepts CSS gradient syntax, including directions and a variable number of color stops.',
              ],
            },
            {
              type: 'code',
              file: 'hydrogen.config.json',
              lines: [
                '"gradients": [',
                '  {',
                '    "key": "linear",',
                '    "default": {',
                '      "gradient": "linear-gradient(to right, purple, blue)",',
                '    },',
                '  },',
                '  ...',
                '],',
              ],
            },
          ],
        },
        {
          type: 'title',
          label: 'Radii',
          id: 'radii',
        },
        {
          type: 'group',
          items: [
            {
              type: 'copy',
              items: [
                'This option allows you to define reusable <code>border-radius</code> values.',
              ],
            },
            {
              type: 'list',
              style: 'unordered',
              items: ['<code>radius</code> accepts any valid CSS unit.'],
            },
            {
              type: 'code',
              file: 'hydrogen.config.json',
              lines: [
                '"radii": [',
                '  {',
                '    "key": "rounded",',
                '    "default": {',
                '      "radius": "5px",',
                '    },',
                '  },',
                '  ...',
                '],',
              ],
            },
          ],
        },
        {
          type: 'title',
          label: 'Shadows',
          id: 'shadows',
        },
        {
          type: 'group',
          items: [
            {
              type: 'copy',
              items: [
                'The <code>shadows</code> option allows you to configure reusable <code>box-shadow</code> values.',
              ],
            },
            {
              type: 'list',
              style: 'unordered',
              items: [
                '<code>shadow</code> accepts any valid CSS <code>box-shadow</code> value.',
              ],
            },
            {
              type: 'copy',
              items: [
                "<strong>Tip:</strong> it's recommended that you experiment with slightly darker shadow values when considering dark mode. This will give them an extra pop and much more visible contrast against your dark mode backgrounds.",
              ],
            },
            {
              type: 'code',
              file: 'hydrogen.config.json',
              lines: [
                '"shadows": [',
                '  {',
                '    "key": "small",',
                '    "default": {',
                '      "shadow": "0 0.1rem 0.2rem 0 rgba(0, 0, 0, .2)",',
                '    },',
                '    "dark": {',
                '      "shadow": "0 0.1rem 0.2rem 0 rgba(0, 0, 0, .5)",',
                '    },',
                '  },',
                '  ...',
                '],',
              ],
            },
          ],
        },
        {
          type: 'title',
          label: 'Transitions',
          id: 'transitions',
        },
        {
          type: 'group',
          items: [
            {
              type: 'copy',
              items: [
                'The <code>transitions</code> configuration is unique in that it provides three different sub-configurations: <code>durations</code>, <code>functions</code>, and <code>delays</code>. These allow you to set reusable values for each, creating more granular control over animation values.',
              ],
            },
            {
              type: 'list',
              style: 'unordered',
              items: [
                '<code>duration</code> accepts a valid CSS time unit.',
                '<code>function</code> accepts a valid CSS transition animation function (e.g. ease, linear, etc.).',
                '<code>delay</code> accepts a valid CSS time unit.',
              ],
            },
            {
              type: 'code',
              file: 'hydrogen.config.json',
              lines: [
                '"transitions": {',
                '  "durations": [',
                '    {',
                '      "key": "short",',
                '      "default": {',
                '        "duration": ".2s",',
                '      },',
                '    },',
                '    ...',
                '  ],',
                '  "functions": [',
                '    {',
                '      "key": "ease",',
                '      "default": {',
                '        "function": "ease",',
                '      },',
                '    },',
                '    ...',
                '  ],',
                '  "delays": [',
                '    {',
                '      "key": "quick",',
                '      "default": {',
                '        "delay": ".1s",',
                '      },',
                '    },',
                '    ...',
                '  ]',
                '}',
              ],
            },
          ],
        },
      ],
    },
  ],
};

function render(data) {
  return data;
}

module.exports = {
  data,
  render,
};