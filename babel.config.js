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
            '@/components': './src/components',
            '@/domain': './src/domain',
            '@/application': './src/application',
            '@/infrastructure': './src/infrastructure',
            '@/presentation': './src/presentation',
            '@/store': './src/store',
            '@/utils': './src/utils',
          },
        },
      ],
      'react-native-reanimated/plugin', // Reanimated는 마지막에
    ],
  };
};

