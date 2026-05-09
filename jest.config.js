/** @type {import('jest').Config} */
export default {
  // 測試環境
  testEnvironment: 'node',
  // 只找 __tests__ 資料夾下的測試
  testMatch: ['**/src/__tests__/**/*.test.js'],
  // 覆蓋率設定
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/assets/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};
