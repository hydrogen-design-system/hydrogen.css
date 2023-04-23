var data = {};

function render(data) {
  let get_menu_data = require('../components/menu.11ty');
  return String.raw`
    <div
      class="mobile-menu"
      data-h2-display="
        base(block) 
        l-tablet(none)
        base:children[>div>button>span:first-child](block)
        base:children[>div>button>span:last-child](none)
        base:selectors[.active]:children[>div>button>span:first-of-type](none)
        base:selectors[.active]:children[>div>button>span:last-child](block)"
      data-h2-location="base(auto, auto, -5px, 0)"
      data-h2-width="base(100%)"
      data-h2-layer="base(100, fixed)"
      data-h2-opacity="base:children[>nav >a](0%) base:selectors[.active]:children[>nav >a](100%)"
      data-h2-transform="
        base:children[>nav](translate(0, 100%)) 
        base:selectors[.active]:children[>nav](translate(0, -100%))"
      data-h2-transition="
        base:children[>nav](.5s ease) 
        base:selectors[.active]:children[>nav](.5s ease)
        base:selectors[.active]:children[>nav >a](.2s ease)">
      <div data-h2-padding="base(x.5, 0, 0, 0)">
        <button
          class="mobile-menu-trigger"
          data-h2-background="base:all(code) base:all:focus-visible(focus)"
          data-h2-border="base(none)"
          data-h2-padding="base(x1, x1, calc(x1 + 5px), x1)"
          data-h2-shadow="base(largest)"
          data-h2-overflow="base(hidden)"
          data-h2-width="base(100%)"
          data-h2-outline="base(none)"
          data-h2-display="base:focus-visible:children[>div](none)"
          data-h2-layer="base(2, relative) base:children[>span](2, relative)"
          data-h2-font-weight="base:children[>span](700)"
          data-h2-font-size="base:children[>span](h6)"
          data-h2-text-decoration="base:children[>span](underline)"
          data-h2-color="base:all:children[>span](white) base:all:focus-visible:children[>span](black)"
          onclick="toggle_menu(this)">
          <span>Open menu</span>
          <span>Close menu</span>
        </button>
      </div>
      <nav 
        data-h2-padding="base(x.5, x.5, 0, x.5)"
        data-h2-position="base(absolute)"
        data-h2-layer="base(1)"
        data-h2-location="base(0, auto, auto, 0)"
        data-h2-height="base(x24)"
        data-h2-max-height="base(70vh)"
        data-h2-width="base(100%)"
        aria-hidden="true">
        <div
          data-h2-background="base(foreground)"
          data-h2-shadow="base(largest)"
          data-h2-height="base(100%)"
          data-h2-radius="base(rounded)"
          data-h2-overflow="base(auto)">
          <div
            data-h2-padding="base(x1.5, x2, x2, x2)"
            data-h2-min-height="base(100%)">
            <h1
              data-h2-font-weight="base(800)"
              data-h2-text-align="base(center)"
              data-h2-margin="base(0, 0, x1.5, 0)">
              <a
                href="/${data.locale}/docs"
                title=""
                data-h2-color="base(black) base:hover(primary) base:all:focus-visible(black)"
                data-h2-transition="base:hover(color, .2s, ease, 0s)"
                data-h2-text-decoration="base(none)">
                Hydrogen
              </a>
            </h1>
            ${get_menu_data.render(data)}
          </div>
        </div>
      </nav>
    </div>
  `;
}

module.exports = {
  data,
  render,
};
