import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';

// 產品數據保持不變
const ProductOrderSystem = () => {
  const products = [
    { category: '管槽(組)', name: 'KL-70', color: '象牙', price: 110, package: '20組一件' },
    { category: '管槽(組)', name: 'KL-80', color: '象牙', price: 131, package: '10組一件' },
    { category: '管槽(組)', name: 'KL-100', color: '象牙', price: 210, package: '5組一件' },
    { category: '管槽(組)', name: 'KL-120', color: '象牙', price: 247, package: '5組一件' },
    { category: '管槽(組)', name: 'KL-140', color: '象牙', price: 294, package: '5組一件' },
    { category: '自由接頭(軟管)', name: 'FA-70 (83公分)', color: '象牙', price: 84, package: '10支一件' },
    { category: '自由接頭(軟管)', name: 'FB-80 (83公分)', color: '象牙', price: 105, package: '10支一件' },
    { category: '自由接頭(軟管)', name: 'FB-80L (120公分)', color: '象牙', price: 142, package: '10支一件' },
    { category: '自由接頭(軟管)', name: 'FB-100 (83公分)', color: '象牙', price: 158, package: '10支一件' },
    { category: '自由接頭(軟管)', name: 'FB-120 (83公分)', color: '象牙', price: 168, package: '10支一件' },
    { category: '自由接頭(軟管)', name: 'FA-140 (100公分)', color: '象牙', price: 231, package: '10支一件' },
    { category: '豪華璧面接頭', name: 'WA-70', color: '象牙', price: 58, package: '10組一件' },
    { category: '簡易壁面接頭', name: 'WA-80', color: '象牙', price: 58, package: '10組一件' },
    { category: '簡易壁面接頭', name: 'WB-80', color: '象牙', price: 58, package: '10組一件' },
    { category: '簡易壁面接頭', name: 'WS-80', color: '象牙', price: 58, package: '10組一件' },
    { category: '簡易壁面接頭', name: 'WA-100', color: '象牙', price: 84, package: '10組一件' },
    { category: '簡易壁面接頭', name: 'WA-120', color: '象牙', price: 110, package: '10組一件' },
    { category: '簡易壁面接頭', name: 'WA-140', color: '象牙', price: 131, package: '10組一件' },
    { category: '平面90°接頭', name: 'KA-70', color: '象牙', price: 63, package: '10組一件' },
    { category: '平面90°接頭', name: 'KA-80', color: '象牙', price: 68, package: '10組一件' },
    { category: '平面90°接頭', name: 'KA-100', color: '象牙', price: 116, package: '10組一件' },
    { category: '平面90°接頭', name: 'KA-120', color: '象牙', price: 147, package: '10組一件' },
    { category: '平面90°接頭', name: 'KA-140', color: '象牙', price: 173, package: '10組一件' },
    { category: '平面45°接頭', name: 'KFA-80', color: '象牙', price: 68, package: '10組一件' },
    { category: '平面45°接頭', name: 'KFA-100', color: '象牙', price: 116, package: '10組一件' },
    { category: '平面45°接頭', name: 'KFA-120', color: '象牙', price: 147, package: '10組一件' },
    { category: '立面90°接頭', name: 'CA-70', color: '象牙', price: 63, package: '10組一件' },
    { category: '立面90°接頭', name: 'CA-80', color: '象牙', price: 68, package: '10組一件' },
    { category: '立面90°接頭', name: 'CA-100', color: '象牙', price: 116, package: '10組一件' },
    { category: '立面90°接頭', name: 'CA-120', color: '象牙', price: 147, package: '10組一件' },
    { category: '立面90°接頭', name: 'CA-140', color: '象牙', price: 173, package: '10組一件' },
    { category: '立面45°接頭', name: 'CFA-80', color: '象牙', price: 68, package: '10組一件' },
    { category: '立面45°接頭', name: 'CFA-100', color: '象牙', price: 116, package: '10組一件' },
    { category: '立面45°接頭', name: 'CFA-120', color: '象牙', price: 147, package: '10組一件' },
    { category: '直接頭', name: 'JA-70', color: '象牙', price: 32, package: '10組一件' },
    { category: '直接頭', name: 'JA-80', color: '象牙', price: 32, package: '10組一件' },
    { category: '直接頭', name: 'JA-100', color: '象牙', price: 63, package: '10組一件' },
    { category: '直接頭', name: 'JA-120', color: '象牙', price: 79, package: '10組一件' },
    { category: '直接頭', name: 'JA-140', color: '象牙', price: 89, package: '10組一件' },
    { category: '天花板接頭(通牆)', name: 'PA-80', color: '象牙', price: 79, package: '10組一件' },
    { category: '天花板接頭(通牆)', name: 'PA-100', color: '象牙', price: 95, package: '10組一件' },
    { category: '天花板接頭(通牆)', name: 'PA-120', color: '象牙', price: 116, package: '10組一件' },
    { category: '天花板接頭(通牆)', name: 'PA-140', color: '象牙', price: 137, package: '10組一件' },
    { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-80', color: '象牙', price: 116, package: '10組一件' },
    { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-100', color: '象牙', price: 158, package: '10組一件' },
    { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-120', color: '象牙', price: 179, package: '10組一件' },
    { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-140', color: '象牙', price: 221, package: '10組一件' },
    { category: '轉接頭(大小頭)', name: 'RA-128', color: '象牙', price: 68, package: '10組一件' },
    { category: '轉接頭(大小頭)', name: 'RA-1008', color: '象牙', price: 63, package: '10組一袋' },
    { category: '轉接頭(大小頭)', name: 'RA-1210', color: '象牙', price: 63, package: '10組一袋' },
    { category: '轉接頭(大小頭)', name: 'RA-1412', color: '象牙', price: 63, package: '10組一袋' },
    { category: '轉接頭(大小頭)', name: 'RA-1408', color: '象牙', price: 158, package: '10組一件' },
    { category: '扭轉接頭', name: 'NA-80', color: '象牙', price: 95, package: '10組一件' },
    { category: '扭轉接頭', name: 'NA-120', color: '象牙', price: 168, package: '10組一件' },
    { category: '異徑直接頭', name: 'JB-108', color: '象牙', price: 79, package: '10組一件' },
    { category: '異徑直接頭', name: 'JB-128', color: '象牙', price: 95, package: '10組一件' },
    { category: '異徑直接頭', name: 'JB-1210', color: '象牙', price: 116, package: '10組一件' },
    { category: '末端接頭', name: 'EA-70', color: '象牙', price: 32, package: '10組一件' },
    { category: '末端接頭', name: 'EA-100', color: '象牙', price: 68, package: '10組一件' },
    { category: '軟管固定器', name: 'FS-80', color: '象牙', price: 18, package: '30個一件' },
    { category: '立面扭轉', name: 'CAN-80', color: '象牙', price: 90, package: '10組一件' },
    { category: '段差接頭', name: 'IFA-100', color: '象牙', price: 150, package: '10組一件' }
  ];

  const [orders, setOrders] = useState({});
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(() => {
    const initial = {};
    Object.keys(products.reduce((acc, p) => ({ ...acc, [p.category]: true }), {})).forEach(cat => {
      initial[cat] = true;
    });
    return initial;
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 處理邏輯函數保持不變...
  const handleQuantityChange = (index, value) => {
     setOrders(prev => ({
       ...prev,
       [index]: { ...prev[index], quantity: value === '' ? '' : parseInt(value) || 0 }
     }));
   };
 
   const handleDiscountChange = (index, value) => {
     setOrders(prev => ({
       ...prev,
       [index]: { ...prev[index], discount: value === '' ? '' : parseInt(value) || 0 }
     }));
   };
 
   const toggleCategory = (category) => {
     setOpenCategories(prev => ({
       ...prev,
       [category]: !prev[category]
     }));
   };
 
   const scrollToTop = () => {
     window.scrollTo({ top: 0, behavior: 'smooth' });
   };
 
   useEffect(() => {
     const handleScroll = () => {
       setShowScrollTop(window.scrollY > 300);
     };
     window.addEventListener('scroll', handleScroll);
     return () => window.removeEventListener('scroll', handleScroll);
   }, []);
 
   const calculations = useMemo(() => {
     let total = 0;
     let discountTotal = 0;
     
     products.forEach((product, index) => {
       const order = orders[index];
       if (order && order.quantity > 0) {
         const amount = product.price * order.quantity;
         total += amount;
         if (order.discount > 0) {
           discountTotal += order.discount;
         }
       }
     });
 
     const finalTotal = discountTotal > 0 ? discountTotal : total;
     const tax = Math.round(finalTotal * 0.05);
     const grandTotal = finalTotal + tax;
 
     return { total, discountTotal, tax, grandTotal };
   }, [orders, products]);
 
   const generateExcelBlob = () => {
     const wb = XLSX.utils.book_new();
     
     const data = [];
     
     const today = new Date();
     const dateStr = `${today.getFullYear()} 年 ${today.getMonth() + 1} 月 ${String(today.getDate()).padStart(2, '0')} 日`;
     
     data.push(['嘉城工業股份有限公司', '', '', '', '', '', '', '']);
     data.push(['新品推出優惠專案 <訂購單>', '', '', '', '', '', '', '']);
     data.push(['訂購專線：(06)5782904', '', '', `實施日期 ${dateStr}`, '', '', '', '']);
     data.push(['傳真專線：(06)5782924', '', '', '', '', '', '', '']);
     data.push(['單位 新台幣', '', '', '台南市山上區新莊里 62號', '', '', '', '']);
     data.push(['品 名', '型 號', '顏色', '優惠價', '訂購數量', '合計金額', '折扣後金額', '包裝方式']);
     
     products.forEach((product, index) => {
       const order = orders[index];
       const qty = order?.quantity || '';
       const amount = qty ? product.price * qty : '';
       const discount = order?.discount || '';
       
       data.push([
         product.category,
         product.name,
         product.color,
         product.price,
         qty,
         amount,
         discount,
         product.package
       ]);
     });
     
     data.push(['◎ 以上報價不含運費、稅金。', '', '', '◎ 訂購金額未達新台幣5000元，運費由客戶支付。', '', '', '', '']);
     data.push(['◎ 每月25日結帳，26日起計次月帳。', '', '', '◎ 貨款票期：當月結，最長 60天票。', '', '', '', '']);
     
     data.push(['總計金額', '折扣價', '稅金', '應收金額', '', '', '', '']);
     data.push([
       calculations.total,
       calculations.discountTotal > 0 ? calculations.discountTotal : '',
       calculations.tax,
       calculations.grandTotal,
       '', '', '', ''
     ]);
     
     data.push(['出貨日期', '', '送貨地址', '', '', '', '', '']);
     data.push(['客戶 簽章', '', '', '', '', '', '', '']);
     data.push(['(若未簽回', '', '', '', '', '', '', '']);
     data.push(['視同確認)', '', '', '', '', '', '', '']);
     
     data.push(['出貨日期', '', '', '', '', '', '', '']);
     data.push(['客戶名稱：', '', '', '', '預定出貨時間', '', '', '']);
     data.push(['送貨地址：', '', '', '', '', '', '', '']);
     data.push(['品 名', '型 號', '顏色', '數量', '贈送(支)', '箱', '件', '']);
     
     for (let i = 0; i < 10; i++) {
       data.push(['', '', '', '', '', '', '', '']);
     }
     
     data.push(['出貨日期', '', '', '', '', '', '', '']);
     data.push(['客戶名稱：', '', '', '', '預定出貨時間', '', '', '']);
     data.push(['送貨地址：', '', '', '', '', '', '', '']);
     data.push(['電話：', '', '', '', '', '', '', '']);
     data.push(['品 名', '型 號', '顏色', '數量', 'BOX', '', '', '']);
     
     for (let i = 0; i < 10; i++) {
       data.push(['', '', '', '', '', '', '', '']);
     }
     
     const ws = XLSX.utils.aoa_to_sheet(data);
     
     ws['!cols'] = [
       { wch: 20 },
       { wch: 18 },
       { wch: 8 },
       { wch: 10 },
       { wch: 10 },
       { wch: 12 },
       { wch: 12 },
       { wch: 15 }
     ];
     
     XLSX.utils.book_append_sheet(wb, ws, '訂購單');
     return wb;
   };
 
   const exportToExcel = () => {
     const wb = generateExcelBlob();
     XLSX.writeFile(wb, `嘉城工業訂購單_${new Date().toISOString().split('T')[0]}.xlsx`);
   };
 
   const shareToLine = async () => {
     const wb = generateExcelBlob();
     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
     const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
     const fileName = `嘉城工業訂購單_${new Date().toISOString().split('T')[0]}.xlsx`;
     const file = new File([blob], fileName, { 
       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
     });
 
     if (navigator.share && navigator.canShare({ files: [file] })) {
       try {
         await navigator.share({
           files: [file],
           title: '嘉城工業訂購單',
           text: `訂購金額：NT$ ${calculations.grandTotal.toLocaleString()}`
         });
       } catch (error) {
         if (error.name !== 'AbortError') {
           alert('分享失敗，請使用下載功能後手動分享');
           exportToExcel();
         }
       }
     } else {
       alert('您的瀏覽器不支援分享功能，將改為下載檔案');
       exportToExcel();
     }
   };

  const groupedProducts = products.reduce((acc, product, index) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push({ ...product, index });
    return acc;
  }, {});

  return (
    // 主背景：使用極深色背景（請確保您的 body 設置了 #0a0a0a 或 bg-black）
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* 標題區塊：置中 */}
        <div className="p-4 pb-6 text-center">
            <h1 className="text-3xl font-extrabold text-white mb-1">嘉城產品訂購系統</h1>
        </div>

        {/* 頂部總覽卡片 - 使用 glass-card 增加明顯區隔 */}
        <div className="glass-card rounded-3xl shadow-2xl p-6 mb-6">
          
          {/* 總計金額區塊 - 獨立的玻璃卡片，加強邊框強調 */}
          <div className="glass-card p-5 rounded-2xl mb-6 text-center border border-blue-400/30">
            <div className="text-sm text-gray-400">應付總額 (含稅)</div>
            <div className="text-4xl font-extrabold text-blue-400">NT$ {calculations.grandTotal.toLocaleString()}</div>
          </div>

          {/* 訂購明細區塊 - 摺疊設計，內建玻璃卡片 */}
          {Object.keys(orders).some(key => orders[key]?.quantity > 0) && (
            <div className="glass-card rounded-2xl mb-6 overflow-hidden"> {/* 外框已經有 glass-card */}
              <button
                onClick={() => setIsDetailOpen(!isDetailOpen)}
                // 使用 primary-button-style 的背景，但略微柔和
                className="w-full p-4 flex justify-between items-center transition bg-white/5 hover:bg-white/10 border-b border-white/10"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">訂購明細</h3>
                  <span className="bg-blue-500/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/50">
                    {Object.keys(orders).filter(key => orders[key]?.quantity > 0).length} 項
                  </span>
                </div>
                <svg 
                  className={`w-6 h-6 text-blue-400 transition-transform ${isDetailOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDetailOpen && (
                // 明細內容區塊，使用深色背景作為內容區隔
                <div className="px-4 py-4 max-h-96 overflow-y-auto bg-black/50 space-y-3">
                  {Object.entries(
                    products.reduce((acc, product, index) => {
                      const order = orders[index];
                      if (order && order.quantity > 0) {
                        if (!acc[product.category]) {
                          acc[product.category] = [];
                        }
                        acc[product.category].push({ ...product, index, order });
                      }
                      return acc;
                    }, {})
                  ).map(([category, items]) => (
                    <div key={category} className="mt-3">
                      <div className="text-sm font-semibold text-gray-400 mb-2 px-2">{category}</div>
                      <div className="space-y-2">
                        {items.map(({ name, price, order, index }) => {
                          const amount = order.discount > 0 ? order.discount : price * order.quantity;
                          return (
                            // 單項明細卡片: 使用 glass-button 樣式作為獨立物件
                            <div key={index} className="glass-button p-3 rounded-xl hover:border-blue-400/50">
                              <div className="flex justify-between items-start mb-1">
                                <div className="font-semibold text-white text-base flex-1">{name}</div>
                                <div className="text-xl font-bold text-blue-400 ml-3">×{order.quantity}</div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-400">單價 NT$ {price.toLocaleString()}</div>
                                <div className="font-bold text-white text-base">NT$ {amount.toLocaleString()}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 動作按鈕區塊 - 使用 primary-button-style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={shareToLine}
              className="primary-button-style font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652.175 4.218-.632 4.59-4.472 8.237 6.086 0 8.935-3.398 9.876-4.512.702.098 1.426.179 2.124.179 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0z"/>
              </svg>
              分享訂單
            </button>
            <button
              onClick={exportToExcel}
              className="glass-button font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 border border-blue-400/30 hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下載 Excel
            </button>
          </div>
        </div>

        {/* 商品清單主區塊 - 使用 glass-card */}
        <div className="glass-card rounded-3xl shadow-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">商品清單</h3>
          
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category} className="mb-4">
              <button
                onClick={() => toggleCategory(category)}
                // 類別標題按鈕，使用 glass-button 作為獨立元件
                className="w-full flex justify-between items-center text-base font-semibold text-white glass-button p-4 rounded-2xl mb-3 transition hover:border-white/20"
              >
                <span className="text-blue-400">{category}</span>
                <svg 
                  className={`w-5 h-5 text-white transition-transform ${openCategories[category] ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openCategories[category] && (
                // 增加 list item 的間距 (space-y-3)
                <div className="space-y-3">
                  {items.map(({ index, name, color, price, package: pkg }) => {
                    const order = orders[index] || {};
                    const amount = order.quantity ? price * order.quantity : 0;
                    
                    return (
                      // 單項商品卡片 - 使用 glass-card 類別來提供背景模糊和邊框
                      <div key={index} className="glass-card rounded-xl p-4 transition-all hover:border-blue-500/50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-medium text-white text-lg">{name}</div>
                            <div className="text-sm text-gray-400">NT$ {price} / <span className='text-gray-500'>{pkg}</span></div>
                          </div>
                          {amount > 0 && (
                            <div className="text-right ml-2">
                              <div className="text-xs text-gray-500">小計</div>
                              <div className="font-semibold text-blue-400 text-lg">NT$ {amount.toLocaleString()}</div>
                            </div>
                          )}
                        </div>
                        {/* 數量輸入區塊 */}
                        <div className="flex items-center gap-3 mt-3">
                          <label className="text-sm text-gray-400 font-medium whitespace-nowrap">訂購數量</label>
                          <input
                            type="number"
                            min="0"
                            value={order.quantity || ''}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            // 輸入框使用深色半透明背景
                            className="flex-1 px-4 py-3 bg-black/50 text-white border border-gray-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-mono outline-none"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 回到頂部按鈕 */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-4 primary-button-style rounded-full shadow-2xl transition-all transform hover:scale-110 z-50 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
            aria-label="回到頂部"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductOrderSystem;