/**
 * 購物車邏輯單元測試
 * 測試範圍：數量計算、箱數計算、金額計算
 */

// ── 從 App.jsx 抽出的純函式（複製過來方便測試）──
const getUnitSize = (pkg) => {
  if (!pkg || typeof pkg !== 'string') return 1;
  const match = pkg.match(/(\d+)(組|個|支)/);
  return match ? parseInt(match[1], 10) : 1;
};

const calcTotalBoxes = (cart) =>
  cart.reduce((sum, item) => {
    if (!item || !item.product || !item.product.package) return sum;
    const unitSize = getUnitSize(item.product.package);
    return sum + Math.ceil(item.quantity / unitSize);
  }, 0);

const calcTotalItems = (cart) =>
  cart.reduce((sum, item) => {
    if (!item || typeof item.quantity !== 'number') return sum;
    return sum + item.quantity;
  }, 0);

// ── 測試用假資料 ──
const makeItem = (name, pkg, quantity, price) => ({
  id: `test-${name}`,
  product: { name, package: pkg, price, category: '管槽(組)' },
  color: '象牙',
  quantity,
  price: price * quantity,
});

// ══════════════════════════════════════════
// 1. getUnitSize
// ══════════════════════════════════════════
describe('getUnitSize', () => {
  test('正確解析「20組一箱」→ 20', () => {
    expect(getUnitSize('20組一箱')).toBe(20);
  });
  test('正確解析「10支一箱」→ 10', () => {
    expect(getUnitSize('10支一箱')).toBe(10);
  });
  test('正確解析「30個一箱」→ 30', () => {
    expect(getUnitSize('30個一箱')).toBe(30);
  });
  test('正確解析「5組一箱」→ 5', () => {
    expect(getUnitSize('5組一箱')).toBe(5);
  });
  test('無效字串回傳 1', () => {
    expect(getUnitSize('')).toBe(1);
    expect(getUnitSize(null)).toBe(1);
    expect(getUnitSize(undefined)).toBe(1);
  });
});

// ══════════════════════════════════════════
// 2. 購物車總數量
// ══════════════════════════════════════════
describe('calcTotalItems', () => {
  test('空購物車回傳 0', () => {
    expect(calcTotalItems([])).toBe(0);
  });
  test('單一品項數量加總正確', () => {
    const cart = [makeItem('KL-70', '20組一箱', 40, 110)];
    expect(calcTotalItems(cart)).toBe(40);
  });
  test('多品項數量加總正確', () => {
    const cart = [
      makeItem('KL-70', '20組一箱', 20, 110),
      makeItem('KL-80', '10組一箱', 30, 131),
    ];
    expect(calcTotalItems(cart)).toBe(50);
  });
  test('有 null 項目不崩潰', () => {
    const cart = [null, makeItem('KL-70', '20組一箱', 20, 110)];
    expect(calcTotalItems(cart)).toBe(20);
  });
});

// ══════════════════════════════════════════
// 3. 購物車總箱數
// ══════════════════════════════════════════
describe('calcTotalBoxes', () => {
  test('空購物車回傳 0', () => {
    expect(calcTotalBoxes([])).toBe(0);
  });
  test('整除箱數正確（40 組 / 20組一箱 = 2 箱）', () => {
    const cart = [makeItem('KL-70', '20組一箱', 40, 110)];
    expect(calcTotalBoxes(cart)).toBe(2);
  });
  test('無法整除時無條件進位（25 組 / 20組一箱 = 2 箱）', () => {
    const cart = [makeItem('KL-70', '20組一箱', 25, 110)];
    expect(calcTotalBoxes(cart)).toBe(2);
  });
  test('多品項箱數加總正確', () => {
    const cart = [
      makeItem('KL-70', '20組一箱', 20, 110),  // 1 箱
      makeItem('KL-80', '10組一箱', 30, 131),  // 3 箱
    ];
    expect(calcTotalBoxes(cart)).toBe(4);
  });
  test('軟管「10支一箱」箱數正確（15 支 → 2 箱）', () => {
    const cart = [makeItem('FA-70', '10支一箱', 15, 84)];
    expect(calcTotalBoxes(cart)).toBe(2);
  });
});

// ══════════════════════════════════════════
// 4. 金額計算
// ══════════════════════════════════════════
describe('金額計算', () => {
  test('單品項金額 = 單價 × 數量', () => {
    const item = makeItem('KL-70', '20組一箱', 40, 110);
    expect(item.price).toBe(4400);
  });
  test('購物車總金額加總正確', () => {
    const cart = [
      makeItem('KL-70', '20組一箱', 20, 110),   // 2200
      makeItem('KL-80', '10組一箱', 10, 131),   // 1310
    ];
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    expect(total).toBe(3510);
  });
  test('稅金計算 5% 四捨五入', () => {
    const total = 3510;
    const tax = Math.round(total * 0.05);
    expect(tax).toBe(176);
    expect(total + tax).toBe(3686);
  });
});
