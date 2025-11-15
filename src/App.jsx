import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Menu, ShoppingCart, X, ArrowLeft, ChevronDown, MoreVertical,
  Download, Trash2, Share2, History, Home as HomeIcon,
  Package, Wrench, Square, Ruler, Move, ArrowRight, Home as HomeIconAlt, GitBranch, MoreHorizontal
} from 'lucide-react';

// 完整产品数据（所有颜色共用同样的产品列表，只有颜色属性不同）
const BASE_PRODUCTS = [
  { category: '管槽(組)', name: 'KL-70', price: 110, package: '20組一件' },
  { category: '管槽(組)', name: 'KL-80', price: 131, package: '10組一件' },
  { category: '管槽(組)', name: 'KL-100', price: 210, package: '5組一件' },
  { category: '管槽(組)', name: 'KL-120', price: 247, package: '5組一件' },
  { category: '管槽(組)', name: 'KL-140', price: 294, package: '5組一件' },
  { category: '自由接頭(軟管)', name: 'FA-70 (83公分)', price: 84, package: '10支一件' },
  { category: '自由接頭(軟管)', name: 'FB-80 (83公分)', price: 105, package: '10支一件' },
  { category: '自由接頭(軟管)', name: 'FB-80L (120公分)', price: 142, package: '10支一件' },
  { category: '自由接頭(軟管)', name: 'FB-100 (83公分)', price: 158, package: '10支一件' },
  { category: '自由接頭(軟管)', name: 'FB-120 (83公分)', price: 168, package: '10支一件' },
  { category: '自由接頭(軟管)', name: 'FA-140 (100公分)', price: 231, package: '10支一件' },
  { category: '豪華璧面接頭', name: 'WA-70', price: 58, package: '10組一件' },
  { category: '簡易壁面接頭', name: 'WA-80', price: 58, package: '10組一件' },
  { category: '簡易壁面接頭', name: 'WB-80', price: 58, package: '10組一件' },
  { category: '簡易壁面接頭', name: 'WS-80', price: 58, package: '10組一件' },
  { category: '簡易壁面接頭', name: 'WA-100', price: 84, package: '10組一件' },
  { category: '簡易壁面接頭', name: 'WA-120', price: 110, package: '10組一件' },
  { category: '簡易壁面接頭', name: 'WA-140', price: 131, package: '10組一件' },
  { category: '平面90°接頭', name: 'KA-70', price: 63, package: '10組一件' },
  { category: '平面90°接頭', name: 'KA-80', price: 68, package: '10組一件' },
  { category: '平面90°接頭', name: 'KA-100', price: 116, package: '10組一件' },
  { category: '平面90°接頭', name: 'KA-120', price: 147, package: '10組一件' },
  { category: '平面90°接頭', name: 'KA-140', price: 173, package: '10組一件' },
  { category: '平面45°接頭', name: 'KFA-80', price: 68, package: '10組一件' },
  { category: '平面45°接頭', name: 'KFA-100', price: 116, package: '10組一件' },
  { category: '平面45°接頭', name: 'KFA-120', price: 147, package: '10組一件' },
  { category: '立面90°接頭', name: 'CA-70', price: 63, package: '10組一件' },
  { category: '立面90°接頭', name: 'CA-80', price: 68, package: '10組一件' },
  { category: '立面90°接頭', name: 'CA-100', price: 116, package: '10組一件' },
  { category: '立面90°接頭', name: 'CA-120', price: 147, package: '10組一件' },
  { category: '立面90°接頭', name: 'CA-140', price: 173, package: '10組一件' },
  { category: '立面45°接頭', name: 'CFA-80', price: 68, package: '10組一件' },
  { category: '立面45°接頭', name: 'CFA-100', price: 116, package: '10組一件' },
  { category: '立面45°接頭', name: 'CFA-120', price: 147, package: '10組一件' },
  { category: '直接頭', name: 'JA-70', price: 32, package: '10組一件' },
  { category: '直接頭', name: 'JA-80', price: 32, package: '10組一件' },
  { category: '直接頭', name: 'JA-100', price: 63, package: '10組一件' },
  { category: '直接頭', name: 'JA-120', price: 79, package: '10組一件' },
  { category: '直接頭', name: 'JA-140', price: 89, package: '10組一件' },
  { category: '天花板接頭(通牆)', name: 'PA-80', price: 79, package: '10組一件' },
  { category: '天花板接頭(通牆)', name: 'PA-100', price: 95, package: '10組一件' },
  { category: '天花板接頭(通牆)', name: 'PA-120', price: 116, package: '10組一件' },
  { category: '天花板接頭(通牆)', name: 'PA-140', price: 137, package: '10組一件' },
  { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-80', price: 116, package: '10組一件' },
  { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-100', price: 158, package: '10組一件' },
  { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-120', price: 179, package: '10組一件' },
  { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-140', price: 221, package: '10組一件' },
  { category: '轉接頭(大小頭)', name: 'RA-128', price: 68, package: '10組一件' },
  { category: '轉接頭(大小頭)', name: 'RA-1008', price: 63, package: '10組一袋' },
  { category: '轉接頭(大小頭)', name: 'RA-1210', price: 63, package: '10組一袋' },
  { category: '轉接頭(大小頭)', name: 'RA-1412', price: 63, package: '10組一袋' },
  { category: '轉接頭(大小頭)', name: 'RA-1408', price: 158, package: '10組一件' },
  { category: '扭轉接頭', name: 'NA-80', price: 95, package: '10組一件' },
  { category: '扭轉接頭', name: 'NA-120', price: 168, package: '10組一件' },
  { category: '異徑直接頭', name: 'JB-108', price: 79, package: '10組一件' },
  { category: '異徑直接頭', name: 'JB-128', price: 95, package: '10組一件' },
  { category: '異徑直接頭', name: 'JB-1210', price: 116, package: '10組一件' },
  { category: '末端接頭', name: 'EA-70', price: 32, package: '10組一件' },
  { category: '末端接頭', name: 'EA-100', price: 68, package: '10組一件' },
  { category: '軟管固定器', name: 'FS-80', price: 18, package: '30個一件' },
  { category: '立面扭轉', name: 'CAN-80', price: 90, package: '10組一件' },
  { category: '段差接頭', name: 'IFA-100', price: 150, package: '10組一件' }
];

const COLORS = ['象牙', '咖啡', '白色', '灰色', '黑色'];

// 首页分类配置
const CATEGORIES = [
  {
    id: 'pipe',
    name: '管槽',
    icon: Package,
    image: '/管槽.png',
    subcategories: ['管槽(組)']
  },
  {
    id: 'hose',
    name: '自由接頭(軟管)',
    icon: Wrench,
    image: '/自由接头.png',
    subcategories: ['自由接頭(軟管)']
  },
  {
    id: 'wall',
    name: '壁面接頭',
    icon: Square,
    image: '/壁面接头.png',
    subcategories: ['豪華璧面接頭', '簡易壁面接頭']
  },
  {
    id: 'flat',
    name: '平面接頭',
    icon: Ruler,
    image: '/平面接头.png',
    subcategories: ['平面90°接頭', '平面45°接頭']
  },
  {
    id: 'vertical',
    name: '立面接頭',
    icon: Move,
    image: '/立面接头.png',
    subcategories: ['立面90°接頭', '立面45°接頭']
  },
  {
    id: 'straight',
    name: '直接頭',
    icon: ArrowRight,
    image: '/直接头.png',
    subcategories: ['直接頭']
  },
  {
    id: 'ceiling',
    name: '天花板接頭(通牆蓋)',
    icon: HomeIconAlt,
    image: '/天花板接头.png',
    subcategories: ['天花板接頭(通牆)']
  },
  {
    id: 't-joint',
    name: 'T型接頭(三通)',
    icon: GitBranch,
    image: '/T型接头.png',
    subcategories: ['T型接頭(三通，不含轉接頭)']
  },
  {
    id: 'others',
    name: '其他',
    icon: MoreHorizontal,
    // 其他分类暂时没有照片，使用图标
    subcategories: ['轉接頭(大小頭)', '扭轉接頭', '異徑直接頭', '末端接頭', '軟管固定器', '立面扭轉', '段差接頭']
  }
];

const App = () => {
  // 页面状态
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColor, setSelectedColor] = useState('象牙');

  // UI 状态
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 数据状态
  const [tempQuantities, setTempQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  // 动画状态
  const [flyingItem, setFlyingItem] = useState(null);

  // 载入历史订单
  useEffect(() => {
    const saved = localStorage.getItem('orderHistory');
    if (saved) {
      try {
        setOrderHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load order history', e);
      }
    }
  }, []);

  // 保存历史订单
  useEffect(() => {
    if (orderHistory.length > 0) {
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    }
  }, [orderHistory]);

  // 计算购物车总件数
  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // 计算每个分类的订购数量
  const getCategoryOrderCount = (categoryId) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return 0;

    return cart.reduce((sum, item) => {
      if (category.subcategories.includes(item.product.category)) {
        return sum + item.quantity;
      }
      return sum;
    }, 0);
  };

  // 获取分类的产品
  const getCategoryProducts = (categoryId) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return [];

    const products = [];

    BASE_PRODUCTS.forEach((product, index) => {
      if (category.subcategories.includes(product.category)) {
        products.push({
          ...product,
          color: selectedColor,
          globalIndex: `${selectedColor}-${index}`
        });
      }
    });

    return products;
  };

  // 提取包装规格中的单位数量
  const getUnitSize = (pkg) => {
    const match = pkg.match(/(\d+)(組|個|支)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  // 处理数量变化
  const handleQuantityChange = (productKey, delta) => {
    const products = getCategoryProducts(selectedCategory.id);
    const product = products.find(p => p.globalIndex === productKey);
    if (!product) return;

    const unitSize = getUnitSize(product.package);
    const current = tempQuantities[productKey] || 0;
    const newValue = Math.max(0, current + (unitSize * delta));

    setTempQuantities({
      ...tempQuantities,
      [productKey]: newValue
    });
  };

  // 加入订单（带动画）
  const handleAddToCart = () => {
    const itemsToAdd = [];

    Object.entries(tempQuantities).forEach(([key, quantity]) => {
      if (quantity > 0) {
        const [color, index] = key.split('-');
        const product = { ...BASE_PRODUCTS[parseInt(index)], color };

        itemsToAdd.push({
          id: `${Date.now()}-${Math.random()}`,
          product,
          color,
          quantity,
          price: product.price * quantity
        });
      }
    });

    if (itemsToAdd.length === 0) return;

    // 触发飞入动画
    setFlyingItem(true);

    setTimeout(() => {
      setCart([...cart, ...itemsToAdd]);
      setTempQuantities({});
      setFlyingItem(false);
      setCurrentPage('home');
    }, 600);
  };

  // 更新购物车商品数量
  const handleUpdateCartItem = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, price: item.product.price * newQuantity }
          : item
      ));
    }
  };

  // 删除购物车商品
  const handleRemoveCartItem = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // 确认订单
  const handleConfirmOrder = () => {
    const orderId = `ORDER-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(orderHistory.length + 1).padStart(3, '0')}`;

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price, 0),
      status: 'completed'
    };

    setOrderHistory([newOrder, ...orderHistory]);
    setCart([]);
    setShowCartDrawer(false);
    setShowConfirmModal(true);
  };

  // 删除历史订单
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('確定要刪除此訂單嗎？')) {
      setOrderHistory(orderHistory.filter(o => o.id !== orderId));
      setShowOrderDetail(null);
      setShowMoreMenu(false);
    }
  };

  // 生成 Excel
  const generateExcelForOrder = (order) => {
    const wb = XLSX.utils.book_new();
    const data = [];

    const today = new Date(order.date);
    const dateStr = `${today.getFullYear()} 年 ${today.getMonth() + 1} 月 ${String(today.getDate()).padStart(2, '0')} 日`;

    data.push(['嘉城工業股份有限公司', '', '', '', '', '', '', '']);
    data.push(['新品推出優惠專案 <訂購單>', '', '', '', '', '', '', '']);
    data.push(['訂購專線：(06)5782904', '', '', `實施日期 ${dateStr}`, '', '', '', '']);
    data.push(['傳真專線：(06)5782924', '', '', `訂單編號：${order.id}`, '', '', '', '']);
    data.push(['單位 新台幣', '', '', '台南市山上區新莊里 62號', '', '', '', '']);
    data.push(['品 名', '型 號', '顏色', '優惠價', '訂購數量', '合計金額', '', '包裝方式']);

    order.items.forEach(item => {
      data.push([
        item.product.category,
        item.product.name,
        item.color,
        item.product.price,
        item.quantity,
        item.price,
        '',
        item.product.package
      ]);
    });

    const tax = Math.round(order.total * 0.05);
    const grandTotal = order.total + tax;

    data.push(['', '', '', '', '', '', '', '']);
    data.push(['◎ 以上報價不含運費、稅金。', '', '', '◎ 訂購金額未達新台幣5000元，運費由客戶支付。', '', '', '', '']);
    data.push(['◎ 每月25日結帳，26日起計次月帳。', '', '', '◎ 貨款票期：當月結，最長 60天票。', '', '', '', '']);
    data.push(['', '', '', '', '', '', '', '']);
    data.push(['總計金額', '', '稅金', '', '應收金額', '', '', '']);
    data.push([order.total, '', tax, '', grandTotal, '', '', '']);

    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [
      { wch: 20 }, { wch: 18 }, { wch: 8 }, { wch: 10 },
      { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, '訂購單');
    return wb;
  };

  // 下载 Excel
  const handleDownloadExcel = (order) => {
    const wb = generateExcelForOrder(order);
    XLSX.writeFile(wb, `嘉城工業訂購單_${order.id}.xlsx`);
    setShowMoreMenu(false);
  };

  // 分享订单
  const handleShareOrder = async (order) => {
    const wb = generateExcelForOrder(order);
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `嘉城工業訂購單_${order.id}.xlsx`;
    const file = new File([blob], fileName, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: '嘉城工業訂購單',
          text: `訂單編號：${order.id}\n訂購金額：NT$ ${order.total.toLocaleString()}`
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          alert('分享失敗，將改為下載檔案');
          handleDownloadExcel(order);
        }
      }
    } else {
      alert('您的瀏覽器不支援分享功能，將改為下載檔案');
      handleDownloadExcel(order);
    }
  };

  // ============ 渲染函数 ============

  // 渲染首页
  const renderHomePage = () => (
    <div className="p-4 pb-20">
      <div className="text-gray-400 text-sm mb-4">請選擇訂購的品項：</div>
      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map(category => {
          const orderCount = getCategoryOrderCount(category.id);
          const IconComponent = category.icon;

          return (
            <div
              key={category.id}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage('category');
              }}
              className="relative aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all active:scale-95"
            >
              {/* 如果有图片就显示图片，否则显示图标 */}
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-20 h-20 mb-3 object-contain"
                />
              ) : (
                <IconComponent className="w-12 h-12 mb-3 text-blue-400" />
              )}
              <div className="text-white text-sm text-center px-2">{category.name}</div>

              {orderCount > 0 && (
                <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                  {orderCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // 渲染品项内页
  const renderCategoryPage = () => {
    const products = getCategoryProducts(selectedCategory.id);
    const groupedProducts = {};

    products.forEach(p => {
      if (!groupedProducts[p.category]) {
        groupedProducts[p.category] = [];
      }
      groupedProducts[p.category].push(p);
    });

    const totalQuantity = Object.values(tempQuantities).reduce((sum, q) => sum + q, 0);
    const totalPrice = Object.entries(tempQuantities).reduce((sum, [key, qty]) => {
      const [color, index] = key.split('-');
      const product = BASE_PRODUCTS[parseInt(index)];
      return sum + (product.price * qty);
    }, 0);

    return (
      <div className="flex flex-col h-screen bg-[#0a0a0a]">
        {/* 颜色页签 */}
        <div className="flex border-b border-white/10 bg-[#0a0a0a] sticky top-[57px] z-40">
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`flex-1 py-3 text-sm transition-all ${
                selectedColor === color
                  ? 'text-white border-b-2 border-blue-400 font-medium bg-white/5'
                  : 'text-gray-500'
              }`}
            >
              {color}
            </button>
          ))}
        </div>

        {/* 产品列表 */}
        <div className="flex-1 overflow-y-auto p-4 pb-32">
          <div className="space-y-6">
            {Object.entries(groupedProducts).map(([subCategory, items]) => (
              <div key={subCategory}>
                <div className="text-gray-400 text-sm mb-3 font-medium">{subCategory}</div>
                <div className="space-y-3">
                  {items.map(product => {
                    const qty = tempQuantities[product.globalIndex] || 0;
                    const unitSize = getUnitSize(product.package);
                    const subtotal = qty * product.price;

                    return (
                      <div
                        key={product.globalIndex}
                        className={`bg-white/5 rounded-xl p-4 border transition-all ${
                          qty > 0 ? 'border-blue-400/50 bg-white/10' : 'border-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="text-white text-lg font-bold mb-1">
                              {product.name}
                            </div>
                            <div className="text-gray-400 text-sm">
                              NT$ {product.price} / {product.package}
                            </div>
                          </div>

                          {subtotal > 0 && (
                            <div className="text-right ml-3">
                              <div className="text-xs text-gray-500">小計</div>
                              <div className="text-blue-400 font-bold text-lg">
                                NT$ {subtotal.toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(product.globalIndex, -1)}
                              disabled={qty === 0}
                              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/10 transition-all active:scale-90"
                            >
                              −
                            </button>
                            <div className="w-16 text-center text-white text-xl font-bold">
                              {qty}
                            </div>
                            <button
                              onClick={() => handleQuantityChange(product.globalIndex, 1)}
                              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90"
                            >
                              +
                            </button>
                          </div>

                          {qty > 0 && (
                            <div className="text-gray-500 text-sm">
                              {Math.ceil(qty / unitSize)} 件
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a] border-t border-white/10">
          <div className="text-white text-center mb-3">
            <span className="text-gray-400">總計：</span>
            <span className="text-xl font-bold mx-2">{totalQuantity}</span>
            <span className="text-gray-400">件</span>
            <span className="mx-2">|</span>
            <span className="text-blue-400 text-xl font-bold">NT$ {totalPrice.toLocaleString()}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={totalQuantity === 0}
            className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-all active:scale-98"
          >
            加入訂單
          </button>
        </div>
      </div>
    );
  };

  // 渲染历史订单页
  const renderHistoryPage = () => (
    <div className="p-4 pb-20">
      <div className="text-white text-lg font-bold mb-4">歷史訂單</div>
      {orderHistory.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <div>尚無歷史訂單</div>
        </div>
      ) : (
        <div className="space-y-3">
          {orderHistory.map(order => (
            <div
              key={order.id}
              onClick={() => {
                setShowOrderDetail(order.id);
                setCurrentPage('home');
              }}
              className="bg-white/5 rounded-xl p-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-all active:scale-98"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-bold text-sm">{order.id}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(order.date).toLocaleString('zh-TW', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="text-blue-400 font-bold text-lg">
                  NT$ {order.total.toLocaleString()}
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // 渲染购物车抽屉
  const renderCartDrawer = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = Math.round(total * 0.05);
    const grandTotal = total + tax;

    return (
      <div
        className="fixed inset-0 z-50 bg-black/50 flex justify-end"
        onClick={() => setShowCartDrawer(false)}
      >
        <div
          className="w-full max-w-md h-full bg-[#0a0a0a] flex flex-col animate-slide-in-right"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-white text-lg font-bold">購物車</h2>
            <button
              onClick={() => setShowCartDrawer(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* 购物车内容 */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-20">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <div>購物車是空的</div>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="text-white font-bold">{item.product.name}</div>
                        <div className="text-gray-400 text-sm mt-1">
                          {item.color} | NT$ {item.product.price}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveCartItem(item.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateCartItem(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                        >
                          −
                        </button>
                        <div className="w-12 text-center text-white font-bold">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-blue-400 font-bold">
                        NT$ {item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 底部结算 */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>小計</span>
                  <span>NT$ {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>稅金 (5%)</span>
                  <span>NT$ {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-white/10">
                  <span>總計</span>
                  <span className="text-blue-400">NT$ {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-98"
              >
                確認訂單
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染确认弹窗
  const renderConfirmModal = () => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-sm w-full animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-white text-xl font-bold mb-2">訂單已確認！</h3>
          <p className="text-gray-400 text-sm">您的訂單已成功建立</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              setShowConfirmModal(false);
              setShowOrderDetail(orderHistory[0]?.id);
            }}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
          >
            查看訂單
          </button>
          <button
            onClick={() => {
              setShowConfirmModal(false);
              setCurrentPage('home');
            }}
            className="w-full py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  );

  // 渲染订单明细
  const renderOrderDetail = () => {
    const order = orderHistory.find(o => o.id === showOrderDetail);
    if (!order) return null;

    const tax = Math.round(order.total * 0.05);
    const grandTotal = order.total + tax;

    // 按颜色分组商品
    const itemsByColor = {};
    order.items.forEach(item => {
      if (!itemsByColor[item.color]) {
        itemsByColor[item.color] = [];
      }
      itemsByColor[item.color].push(item);
    });

    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
        <div className="bg-[#0a0a0a] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in">
          {/* 顶部栏 */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <h2 className="text-white text-lg font-bold">訂單明細</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* 三点选单 */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] rounded-xl border border-white/10 shadow-xl min-w-[160px] overflow-hidden z-10">
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>刪除訂單</span>
                    </button>
                    <button
                      onClick={() => handleDownloadExcel(order)}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>下載 Excel</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setShowOrderDetail(null);
                  setShowMoreMenu(false);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* 订单信息 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
              <div className="text-gray-400 text-sm mb-1">訂單編號</div>
              <div className="text-white font-bold mb-3">{order.id}</div>
              <div className="text-gray-400 text-sm mb-1">訂單時間</div>
              <div className="text-white">
                {new Date(order.date).toLocaleString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* 商品列表（按颜色分组） */}
            <div className="space-y-4">
              {Object.entries(itemsByColor).map(([color, items]) => (
                <div key={color} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-blue-400 font-bold mb-3">{color}</div>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between items-start py-2 border-b border-white/5 last:border-0">
                        <div className="flex-1">
                          <div className="text-white font-medium">{item.product.name}</div>
                          <div className="text-gray-400 text-sm">
                            NT$ {item.product.price} × {item.quantity}
                          </div>
                        </div>
                        <div className="text-white font-bold">
                          NT$ {item.price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 总计 */}
            <div className="bg-white/5 rounded-xl p-4 mt-4 border border-white/10">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>小計</span>
                  <span>NT$ {order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>稅金 (5%)</span>
                  <span>NT$ {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white text-xl font-bold pt-2 border-t border-white/10">
                  <span>總計</span>
                  <span className="text-blue-400">NT$ {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => handleShareOrder(order)}
              className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              <span>分享訂單</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============ 主渲染 ============
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a] border-b border-white/10 px-4 py-4 flex items-center justify-between">
        {/* 左侧 */}
        <div className="flex items-center gap-3">
          {currentPage === 'category' ? (
            <button
              onClick={() => {
                setCurrentPage('home');
                setTempQuantities({});
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={() => setShowBurgerMenu(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* 中间标题 */}
        <div className="text-lg font-bold">
          {currentPage === 'home' && '嘉城產品訂購系統'}
          {currentPage === 'category' && selectedCategory?.name}
          {currentPage === 'history' && '歷史訂單'}
        </div>

        {/* 右侧购物车 */}
        <button
          onClick={() => setShowCartDrawer(true)}
          className="p-2 relative hover:bg-white/10 rounded-lg transition-all"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartTotalItems > 0 && (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-once">
              {cartTotalItems}
            </div>
          )}
        </button>
      </div>

      {/* Burger Menu */}
      {showBurgerMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setShowBurgerMenu(false)}
        >
          <div
            className="w-64 h-full bg-[#1a1a1a] p-6 animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white text-xl font-bold mb-8">選單</div>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setShowBurgerMenu(false);
                }}
                className="w-full flex items-center gap-3 text-white hover:text-blue-400 transition-colors py-2"
              >
                <HomeIcon className="w-5 h-5" />
                <span>首頁</span>
              </button>
              <button
                onClick={() => {
                  setCurrentPage('history');
                  setShowBurgerMenu(false);
                }}
                className="w-full flex items-center gap-3 text-white hover:text-blue-400 transition-colors py-2"
              >
                <History className="w-5 h-5" />
                <span>歷史訂單</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主要内容 */}
      {currentPage === 'home' && renderHomePage()}
      {currentPage === 'category' && renderCategoryPage()}
      {currentPage === 'history' && renderHistoryPage()}

      {/* 抽屉和弹窗 */}
      {showCartDrawer && renderCartDrawer()}
      {showConfirmModal && renderConfirmModal()}
      {showOrderDetail && renderOrderDetail()}

      {/* 飞入动画 */}
      {flyingItem && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-fly-to-cart">
            <Package className="w-12 h-12 text-blue-400" />
          </div>
        </div>
      )}

      {/* 动画样式 */}
      <style>{`
        @keyframes fly-to-cart {
          0% {
            transform: translate(0, 100px) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(150px, -200px) scale(0.7) rotate(45deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(300px, -300px) scale(0.2) rotate(90deg);
            opacity: 0;
          }
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        .animate-fly-to-cart {
          animation: fly-to-cart 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }

        .animate-bounce-once {
          animation: bounce-once 0.4s ease-out;
        }

        .active\\:scale-95:active {
          transform: scale(0.95);
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default App;
