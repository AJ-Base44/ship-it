// Expo's babel preset. `babel-preset-expo` automatically adds the
// react-native-worklets babel plugin (Reanimated 4) when the package is
// installed, so we must NOT add it again here — doing so would double-process
// worklets. Reanimated/Moti work in Expo Go with just this preset.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
