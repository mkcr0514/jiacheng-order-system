/**
 * Excel 產品比對邏輯測試
 * 重點測試：模板中有多餘空格的型號（軟管類）能否正確比對到訂單品項
 */

// ── 修復後的比對函式（與 App.jsx 保持一致）──
const matchProduct = (orderItemName, orderItemColor, templateModel, templateColor) => {
  if (orderItemColor !== templateColor) return false;

  const orderName = orderItemName.trim().replace(/\s+/g, ' ');
  const tModel = templateModel ? templateModel.trim().replace(/\s+/g, ' ') : '';

  return (
    tModel === orderName ||
    tModel.startsWith(orderName + ' ') ||
    tModel.startsWith(orderName + '(')
  );
};

// ── 模擬 order.items ──
const makeOrderItem = (name, color) => ({
  product: { name },
  color,
});

// ══════════════════════════════════════════
// 1. 一般型號（無多餘空格）— 應全部通過
// ══════════════════════════════════════════
describe('一般型號比對（無多餘空格）', () => {
  const normalModels = [
    'KL-70', 'KL-80', 'KL-100', 'KL-120', 'KL-140',
    'WA-70', 'WA-80', 'WB-80', 'WS-80', 'WA-100', 'WA-120', 'WA-140',
    'KA-70', 'KA-80', 'KA-100', 'KA-120', 'KA-140',
    'KFA-80', 'KFA-100', 'KFA-120',
    'CA-70', 'CA-80', 'CA-100', 'CA-120', 'CA-140',
    'CFA-80', 'CFA-100', 'CFA-120',
    'JA-70', 'JA-80', 'JA-100', 'JA-120', 'JA-140',
    'PA-80', 'PA-100', 'PA-120', 'PA-140',
    'TA-80', 'TA-100', 'TA-120', 'TA-140',
    'RA-128', 'RA-1008', 'RA-1210', 'RA-1412', 'RA-1408',
    'NA-80', 'NA-120',
    'JB-108', 'JB-128', 'JB-1210',
    'EA-70', 'EA-100',
    'FS-80',
    'CAN-80', 'IFA-100',
  ];

  normalModels.forEach(model => {
    test(`${model} 精確比對成功`, () => {
      const item = makeOrderItem(model, '象牙');
      expect(matchProduct(item.product.name, item.color, model, '象牙')).toBe(true);
    });
  });
});

// ══════════════════════════════════════════
// 2. 軟管類型號（模板中含多餘空格）— 修復前會失敗
// ══════════════════════════════════════════
describe('軟管類型號比對（模板含多餘空格，修復後應通過）', () => {
  const hoseModels = [
    { orderName: 'FA-70',  templateModel: 'FA-70        (83公分)' },
    { orderName: 'FB-80',  templateModel: 'FB-80        (83公分)' },
    { orderName: 'FB-80L', templateModel: 'FB-80L    (120公分)' },
    { orderName: 'FB-100', templateModel: 'FB-100      (83公分)' },
    { orderName: 'FB-120', templateModel: 'FB-120      (83公分)' },
    { orderName: 'FA-140', templateModel: 'FA-140    (100公分)' },
  ];

  hoseModels.forEach(({ orderName, templateModel }) => {
    test(`${orderName} 比對「${templateModel.trim()}」成功`, () => {
      const item = makeOrderItem(orderName, '象牙');
      expect(matchProduct(item.product.name, item.color, templateModel, '象牙')).toBe(true);
    });
  });
});

// ══════════════════════════════════════════
// 3. 顏色不符 — 應全部失敗
// ══════════════════════════════════════════
describe('顏色不符時不應比對', () => {
  const colors = ['象牙', '咖啡', '白色', '灰色', '黑色'];

  colors.forEach(color => {
    const otherColors = colors.filter(c => c !== color);
    otherColors.forEach(wrongColor => {
      test(`訂單顏色「${color}」不應比對到模板顏色「${wrongColor}」`, () => {
        const item = makeOrderItem('KL-70', color);
        expect(matchProduct(item.product.name, item.color, 'KL-70', wrongColor)).toBe(false);
      });
    });
  });
});

// ══════════════════════════════════════════
// 4. 邊界條件
// ══════════════════════════════════════════
describe('邊界條件', () => {
  test('templateModel 為空字串時不崩潰，回傳 false', () => {
    expect(matchProduct('KL-70', '象牙', '', '象牙')).toBe(false);
  });
  test('templateModel 為 null 時不崩潰，回傳 false', () => {
    expect(matchProduct('KL-70', '象牙', null, '象牙')).toBe(false);
  });
  test('型號大小寫不同不應誤比對（KL-70 ≠ kl-70）', () => {
    expect(matchProduct('kl-70', '象牙', 'KL-70', '象牙')).toBe(false);
  });
  test('部分型號不應誤比對（KL-7 ≠ KL-70）', () => {
    expect(matchProduct('KL-7', '象牙', 'KL-70', '象牙')).toBe(false);
  });
});
