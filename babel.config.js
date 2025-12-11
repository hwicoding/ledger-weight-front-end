module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/domain': './src/domain',
            '@/application': './src/application',
            '@/infrastructure': './src/infrastructure',
            '@/presentation': './src/presentation',
            '@/store': './src/store',
          },
        },
      ],
      'react-native-reanimated/plugin', // Reanimated는 마지막에
    ],
  };
};

