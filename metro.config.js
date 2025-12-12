// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 로그 출력 강화
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // 모든 요청 로깅
      if (__DEV__) {
        console.log(`[Metro] ${req.method} ${req.url}`);
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;

