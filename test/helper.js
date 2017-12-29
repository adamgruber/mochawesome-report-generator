// Polyfill matchMedia
window.matchMedia = window.matchMedia || (
  () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  })
);

// Setup Enzyme Adapter
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

// Setup path lookups
const path = require('path');
require('app-module-path').addPath(__dirname);
require('app-module-path').addPath(path.join(__dirname, '..', 'src'));

// CSS Modules Runtime
const cssHook = require('css-modules-require-hook');

cssHook({
  generateScopedName: '[name]-[local]'
});
