const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  // 每個測試最長 30 秒
  timeout: 30000,
  // 失敗時重試一次
  retries: 1,
  // 平行執行
  workers: 2,

  use: {
    // 本地測試時的網址
    baseURL: 'http://localhost:4173',
    // 失敗時自動截圖
    screenshot: 'only-on-failure',
    // 失敗時錄影
    video: 'retain-on-failure',
  },

  projects: [
    // ── 手機瀏覽器（主要測試目標）──
    {
      name: 'iPhone 13',
      use: {
        ...devices['iPhone 13'],
      },
    },
    {
      name: 'iPhone SE',
      use: {
        ...devices['iPhone SE'],
      },
    },
    {
      name: 'Galaxy S9+',
      use: {
        ...devices['Galaxy S9+'],
      },
    },
    // ── 桌面瀏覽器（備用）──
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 測試前自動 build + 啟動 preview server
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
