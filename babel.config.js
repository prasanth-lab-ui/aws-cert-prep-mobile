module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // react-native-reanimated must be the LAST plugin.
    'react-native-reanimated/plugin',
  ],
};
