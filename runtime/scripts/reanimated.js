const fs = require('fs');
const path = require('path');

fs.copyFileSync(
  path.resolve(__dirname, '../node_modules/react-native-reanimated/plugin.js'),
  path.resolve(__dirname, '../node_modules/react-native-reanimated/plugin-standalone.js'),
);
