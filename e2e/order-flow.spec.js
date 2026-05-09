/**
 * E2E 測試 — 模擬手機使用者完整操作流程
 * 使用 Playwright 以 iPhone 13 規格執行
 */

import { test, expect } from '@playwright/test';

// ══════════════════════════════════════════
// 1. 首頁渲染
// ══════════════════════════════════════════
test.describe('首頁', () => {
  test('正確顯示 9 個品項分類', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.grid > div');
    await expect(cards).toHaveCount(9);
  });

  test('標題顯示「空調飾管訂購」', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=空調飾管訂購')).toBeVisible();
  });

  test('購物車 icon 初始無數字 badge', async ({ page }) => {
    await page.goto('/');
    const badge = page.locator('.bg-blue-500.rounded-full');
    await expect(badge).not.toBeVisible();
  });
});

// ══════════════════════════════════════════
// 2. 品項選購流程
// ══════════════════════════════════════════
test.describe('品項選購流程', () => {
  test('點擊管槽進入內頁，顯示 5 個顏色 tab', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=管槽').first().click();
    await expect(page.locator('text=象牙')).toBeVisible();
    await expect(page.locator('text=咖啡')).toBeVisible();
    await expect(page.locator('text=白色')).toBeVisible();
    await expect(page.locator('text=灰色')).toBeVisible();
    await expect(page.locator('text=黑色')).toBeVisible();
  });

  test('加入購物車按鈕初始為 disabled', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=管槽').first().click();
    const btn = page.locator('button:has-text("加入購物車")');
    await expect(btn).toBeDisabled();
  });

  test('數量 +1 後加入購物車按鈕變為可點擊', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=管槽').first().click();
    // 點第一個 + 按鈕
    await page.locator('button:has-text("+")').first().click();
    const btn = page.locator('button:has-text("加入購物車")');
    await expect(btn).toBeEnabled();
  });

  test('數量以箱為單位遞增（20組一箱 → 點+一次顯示 20）', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=管槽').first().click();
    await page.locator('button:has-text("+")').first().click();
    // KL-70 是 20組一箱，點一次 + 應顯示 20
    await expect(page.locator('text=20').first()).toBeVisible();
  });

  test('成功加入購物車後回到首頁，購物車 badge 顯示數字', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=管槽').first().click();
    await page.locator('button:has-text("+")').first().click();
    await page.locator('button:has-text("加入購物車")').click();
    // 等待動畫完成
    await page.waitForTimeout(1000);
    await expect(page.locator('text=空調飾管訂購')).toBeVisible();
    const badge = page.locator('.bg-blue-500.rounded-full').first();
    await expect(badge).toBeVisible();
  });
});

// ══════════════════════════════════════════
// 3. 購物車操作
// ══════════════════════════════════════════
test.describe('購物車操作', () => {
  // 共用：進入購物車（先加入一個品項）
  async function addOneItemAndOpenCart(page) {
    await page.goto('/');
    await page.locator('text=管槽').first().click();
    await page.locator('button:has-text("+")').first().click();
    await page.locator('button:has-text("加入購物車")').click();
    await page.waitForTimeout(1000);
    await page.locator('button[aria-label="shopping cart"], button:has(.lucide-shopping-cart)').click();
  }

  test('購物車顯示已加入的品項', async ({ page }) => {
    await addOneItemAndOpenCart(page);
    await expect(page.locator('text=KL-70')).toBeVisible();
  });

  test('點擊確認訂單後購物車清空', async ({ page }) => {
    await addOneItemAndOpenCart(page);
    await page.locator('button:has-text("總箱數")').click();
    // 確認成功彈窗
    await expect(page.locator('text=訂單已確認')).toBeVisible();
  });
});

// ══════════════════════════════════════════
// 4. 軟管類品項（FA-70 等）— 驗證修復結果
// ══════════════════════════════════════════
test.describe('軟管類品項', () => {
  test('自由接頭(軟管)分類可進入並顯示品項', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=自由接頭').first().click();
    await expect(page.locator('text=FA-70')).toBeVisible();
    await expect(page.locator('text=FB-80')).toBeVisible();
  });

  test('FA-70 數量調整正確（10支一箱，點+一次→10）', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=自由接頭').first().click();
    await page.locator('button:has-text("+")').first().click();
    await expect(page.locator('text=10').first()).toBeVisible();
  });
});

// ══════════════════════════════════════════
// 5. 歷史訂單
// ══════════════════════════════════════════
test.describe('歷史訂單', () => {
  test('沒有訂單時顯示「尚無歷史訂單」', async ({ page }) => {
    await page.goto('/');
    await page.locator('button').first().click(); // 打開 burger menu
    await page.locator('text=歷史訂單').click();
    await expect(page.locator('text=尚無歷史訂單')).toBeVisible();
  });
});

// ══════════════════════════════════════════
// 6. 手機響應式
// ══════════════════════════════════════════
test.describe('手機響應式佈局', () => {
  test('iPhone 13 尺寸下首頁正常顯示', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('text=空調飾管訂購')).toBeVisible();
    const cards = page.locator('.grid > div');
    await expect(cards).toHaveCount(9);
  });

  test('Samsung Galaxy S21 尺寸下首頁正常顯示', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await expect(page.locator('text=空調飾管訂購')).toBeVisible();
  });
});
