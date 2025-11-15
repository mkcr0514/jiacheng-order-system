import React, { useState, useMemo, useEffect, Component } from 'react';
import * as XLSX from 'xlsx';
import {
  Menu, ShoppingCart, X, ArrowLeft, ChevronDown, MoreVertical,
  Download, Trash2, Share2, History, Home as HomeIcon,
  Package, Wrench, Square, Ruler, Move, ArrowRight, Home as HomeIconAlt, GitBranch, MoreHorizontal
} from 'lucide-react';
import { EXCEL_TEMPLATE_PRODUCTS } from './templateProducts.js';

// 错误边界组件
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-lg">
            <h2 className="text-red-400 text-xl font-bold mb-4">發生錯誤</h2>
            <p className="text-white mb-4">應用程序遇到了問題。請刷新頁面重試。</p>
            <pre className="text-xs text-gray-400 bg-black/50 p-3 rounded overflow-auto max-h-40">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              刷新頁面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 完整产品数据（所有颜色共用同样的产品列表，只有颜色属性不同）
const BASE_PRODUCTS = [
  { category: '管槽(組)', name: 'KL-70', price: 110, package: '20組一箱' },
  { category: '管槽(組)', name: 'KL-80', price: 131, package: '10組一箱' },
  { category: '管槽(組)', name: 'KL-100', price: 210, package: '5組一箱' },
  { category: '管槽(組)', name: 'KL-120', price: 247, package: '5組一箱' },
  { category: '管槽(組)', name: 'KL-140', price: 294, package: '5組一箱' },
  { category: '自由接頭(軟管)', name: 'FA-70 (83公分)', price: 84, package: '10支一箱' },
  { category: '自由接頭(軟管)', name: 'FB-80 (83公分)', price: 105, package: '10支一箱' },
  { category: '自由接頭(軟管)', name: 'FB-80L (120公分)', price: 142, package: '10支一箱' },
  { category: '自由接頭(軟管)', name: 'FB-100 (83公分)', price: 158, package: '10支一箱' },
  { category: '自由接頭(軟管)', name: 'FB-120 (83公分)', price: 168, package: '10支一箱' },
  { category: '自由接頭(軟管)', name: 'FA-140 (100公分)', price: 231, package: '10支一箱' },
  { category: '豪華璧面接頭', name: 'WA-70', price: 58, package: '10組一箱' },
  { category: '簡易壁面接頭', name: 'WA-80', price: 58, package: '10組一箱' },
  { category: '簡易壁面接頭', name: 'WB-80', price: 58, package: '10組一箱' },
  { category: '簡易壁面接頭', name: 'WS-80', price: 58, package: '10組一箱' },
  { category: '簡易壁面接頭', name: 'WA-100', price: 84, package: '10組一箱' },
  { category: '簡易壁面接頭', name: 'WA-120', price: 110, package: '10組一箱' },
  { category: '簡易壁面接頭', name: 'WA-140', price: 131, package: '10組一箱' },
  { category: '平面90°接頭', name: 'KA-70', price: 63, package: '10組一箱' },
  { category: '平面90°接頭', name: 'KA-80', price: 68, package: '10組一箱' },
  { category: '平面90°接頭', name: 'KA-100', price: 116, package: '10組一箱' },
  { category: '平面90°接頭', name: 'KA-120', price: 147, package: '10組一箱' },
  { category: '平面90°接頭', name: 'KA-140', price: 173, package: '10組一箱' },
  { category: '平面45°接頭', name: 'KFA-80', price: 68, package: '10組一箱' },
  { category: '平面45°接頭', name: 'KFA-100', price: 116, package: '10組一箱' },
  { category: '平面45°接頭', name: 'KFA-120', price: 147, package: '10組一箱' },
  { category: '立面90°接頭', name: 'CA-70', price: 63, package: '10組一箱' },
  { category: '立面90°接頭', name: 'CA-80', price: 68, package: '10組一箱' },
  { category: '立面90°接頭', name: 'CA-100', price: 116, package: '10組一箱' },
  { category: '立面90°接頭', name: 'CA-120', price: 147, package: '10組一箱' },
  { category: '立面90°接頭', name: 'CA-140', price: 173, package: '10組一箱' },
  { category: '立面45°接頭', name: 'CFA-80', price: 68, package: '10組一箱' },
  { category: '立面45°接頭', name: 'CFA-100', price: 116, package: '10組一箱' },
  { category: '立面45°接頭', name: 'CFA-120', price: 147, package: '10組一箱' },
  { category: '直接頭', name: 'JA-70', price: 32, package: '10組一箱' },
  { category: '直接頭', name: 'JA-80', price: 32, package: '10組一箱' },
  { category: '直接頭', name: 'JA-100', price: 63, package: '10組一箱' },
  { category: '直接頭', name: 'JA-120', price: 79, package: '10組一箱' },
  { category: '直接頭', name: 'JA-140', price: 89, package: '10組一箱' },
  { category: '天花板接頭(通牆)', name: 'PA-80', price: 79, package: '10組一箱' },
  { category: '天花板接頭(通牆)', name: 'PA-100', price: 95, package: '10組一箱' },
  { category: '天花板接頭(通牆)', name: 'PA-120', price: 116, package: '10組一箱' },
  { category: '天花板接頭(通牆)', name: 'PA-140', price: 137, package: '10組一箱' },
  { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-80', price: 116, package: '10組一箱' },
  { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-100', price: 158, package: '10組一箱' },
  { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-120', price: 179, package: '10組一箱' },
  { category: 'T型接頭(三通，不含轉接頭)', name: 'TA-140', price: 221, package: '10組一箱' },
  { category: '轉接頭(大小頭)', name: 'RA-128', price: 68, package: '10組一箱' },
  { category: '轉接頭(大小頭)', name: 'RA-1008', price: 63, package: '10組一袋' },
  { category: '轉接頭(大小頭)', name: 'RA-1210', price: 63, package: '10組一袋' },
  { category: '轉接頭(大小頭)', name: 'RA-1412', price: 63, package: '10組一袋' },
  { category: '轉接頭(大小頭)', name: 'RA-1408', price: 158, package: '10組一箱' },
  { category: '扭轉接頭', name: 'NA-80', price: 95, package: '10組一箱' },
  { category: '扭轉接頭', name: 'NA-120', price: 168, package: '10組一箱' },
  { category: '異徑直接頭', name: 'JB-108', price: 79, package: '10組一箱' },
  { category: '異徑直接頭', name: 'JB-128', price: 95, package: '10組一箱' },
  { category: '異徑直接頭', name: 'JB-1210', price: 116, package: '10組一箱' },
  { category: '末端接頭', name: 'EA-70', price: 32, package: '10組一箱' },
  { category: '末端接頭', name: 'EA-100', price: 68, package: '10組一箱' },
  { category: '軟管固定器', name: 'FS-80', price: 18, package: '30個一箱' },
  { category: '立面扭轉', name: 'CAN-80', price: 90, package: '10組一箱' },
  { category: '段差接頭', name: 'IFA-100', price: 150, package: '10組一箱' }
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
    image: '/其他.png',
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
  const [removingItems, setRemovingItems] = useState(new Set());

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

  // 提取包装规格中的单位数量（移到前面，避免引用错误）
  const getUnitSize = (pkg) => {
    if (!pkg || typeof pkg !== 'string') return 1;
    const match = pkg.match(/(\d+)(組|個|支)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  // 计算购物车总数量和总箱数
  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => {
      if (!item || typeof item.quantity !== 'number') return sum;
      return sum + item.quantity;
    }, 0);
  }, [cart]);

  const cartTotalBoxes = useMemo(() => {
    return cart.reduce((sum, item) => {
      if (!item || !item.product || !item.product.package) return sum;
      const unitSize = getUnitSize(item.product.package);
      return sum + Math.ceil(item.quantity / unitSize);
    }, 0);
  }, [cart]);

  // 计算每个分类的订购数量
  const getCategoryOrderCount = (categoryId) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return 0;

    return cart.reduce((sum, item) => {
      if (!item || !item.product || !item.product.category) return sum;
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
    try {
      const itemsToAdd = [];

      Object.entries(tempQuantities).forEach(([key, quantity]) => {
        if (quantity > 0) {
          const [color, index] = key.split('-');
          const indexNum = parseInt(index);

          // 检查索引是否有效
          if (isNaN(indexNum) || indexNum < 0 || indexNum >= BASE_PRODUCTS.length) {
            console.error(`Invalid product index: ${index}`);
            return;
          }

          const baseProduct = BASE_PRODUCTS[indexNum];

          // 确保产品存在且有必要的字段
          if (!baseProduct || !baseProduct.name || !baseProduct.price) {
            console.error(`Invalid product at index ${index}:`, baseProduct);
            return;
          }

          const product = { ...baseProduct };

          itemsToAdd.push({
            id: `${Date.now()}-${Math.random()}`,
            product,
            color,
            quantity,
            price: product.price * quantity
          });
        }
      });

      if (itemsToAdd.length === 0) {
        console.log('No items to add to cart');
        return;
      }

      console.log('Adding items to cart:', itemsToAdd);

      // 触发飞入动画
      setFlyingItem(true);

      setTimeout(() => {
        try {
          setCart(prevCart => [...prevCart, ...itemsToAdd]);
          setTempQuantities({});
          setFlyingItem(false);
          setCurrentPage('home');
        } catch (error) {
          console.error('Error updating cart:', error);
          setFlyingItem(false);
          alert('加入購物車失敗，請重試');
        }
      }, 800);
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
      alert('加入購物車失敗，請重試');
    }
  };

  // 更新购物车商品数量（按箱调整）
  const handleUpdateCartItem = (itemId, delta) => {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    const unitSize = getUnitSize(item.product.package);
    const newQuantity = item.quantity + (unitSize * delta);

    if (newQuantity <= 0) {
      // 数量为0时，弹出确认删除
      if (window.confirm(`確定要從購物車移除「${item.product.name} (${item.color})」嗎？`)) {
        // 触发移除动画
        setRemovingItems(prev => new Set([...prev, itemId]));

        // 动画完成后移除商品
        setTimeout(() => {
          setCart(cart.filter(i => i.id !== itemId));
          setRemovingItems(prev => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        }, 400);
      }
    } else {
      setCart(cart.map(i =>
        i.id === itemId
          ? { ...i, quantity: newQuantity, price: item.product.price * newQuantity }
          : i
      ));
    }
  };

  // 删除购物车商品（弹出确认）
  const handleRemoveCartItem = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    if (window.confirm(`確定要從購物車移除「${item.product.name} (${item.color})」嗎？`)) {
      // 触发移除动画
      setRemovingItems(prev => new Set([...prev, itemId]));

      // 动画完成后移除商品
      setTimeout(() => {
        setCart(cart.filter(i => i.id !== itemId));
        setRemovingItems(prev => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }, 400);
    }
  };

  // 确认订单
  const handleConfirmOrder = () => {
    try {
      const orderId = `ORDER-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(orderHistory.length + 1).padStart(3, '0')}`;

      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        items: cart,
        total: cart.reduce((sum, item) => {
          if (!item || typeof item.price !== 'number') return sum;
          return sum + item.price;
        }, 0),
        status: 'completed'
      };

      setOrderHistory([newOrder, ...orderHistory]);
      setCart([]);
      setShowCartDrawer(false);
      setShowConfirmModal(true);
    } catch (error) {
      console.error('确认订单时出错:', error);
      alert('訂單確認失敗，請重試');
    }
  };

  // 删除历史订单
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('確定要刪除此訂單嗎？')) {
      setOrderHistory(orderHistory.filter(o => o.id !== orderId));
      setShowOrderDetail(null);
      setShowMoreMenu(false);
    }
  };

  // 生成 Excel（每个颜色一个页签，严格按照模板格式）
  const generateExcelForOrder = (order) => {
    const wb = XLSX.utils.book_new();

    const today = new Date(order.date);
    const dateStr = `${today.getFullYear()} 年 ${today.getMonth() + 1} 月 ${String(today.getDate()).padStart(2, '0')} 日`;

    // 为每个颜色创建一个页签
    COLORS.forEach(color => {
      const data = [];

      // 表头（严格按照模板格式，列数29列）
      data.push(['嘉 城 工 業 股 份 有 限 公 司', '', '', '', '', '新品推出優惠專案 <訂購單>', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      data.push(['訂購專線：(06)5782904', '', '', '', '', `實施日期  ${dateStr}`, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      data.push(['傳真專線：(06)5782924', '', '', '單位', '新台幣', '          台南市山上區新莊里 62號', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      data.push(['品    名', '型    號', '', '顏色', '優惠價', '訂購數量', '合計金額', '折扣後金額', '     包裝方式', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

      let colorTotal = 0;
      const templateProducts = EXCEL_TEMPLATE_PRODUCTS[color] || [];

      // 遍历模板中该颜色的所有产品
      templateProducts.forEach(templateProduct => {
        // 查找订单中匹配的产品
        // 使用部分匹配：订单中的产品名称可能是"KL-80"，模板中可能是"KL-80 (83公分)"
        const orderItem = order.items.find(item => {
          if (!item || !item.product || !item.product.name || item.color !== color) return false;

          // 精确匹配或部分匹配
          const orderName = item.product.name.trim();
          const templateModel = templateProduct.model ? templateProduct.model.trim() : '';

          return templateModel === orderName ||
                 templateModel.startsWith(orderName + ' ') ||
                 templateModel.startsWith(orderName + '  ');
        });

        const quantity = orderItem ? orderItem.quantity : '';
        const itemTotal = orderItem ? orderItem.price : '';
        const discountedTotal = orderItem ? 0 : ''; // 折扣后金额

        if (orderItem) {
          colorTotal += orderItem.price;
        }

        // 拆分型号（处理包含规格的型号，如"KL-80 (83公分)"）
        let model1 = templateProduct.model;
        let model2 = '';

        // 检查是否包含括号
        const match = templateProduct.model.match(/^(.+?)\s+(\(.+\))$/);
        if (match) {
          model1 = match[1];
          model2 = match[2];
        }

        data.push([
          templateProduct.category,
          model1,
          model2,
          color,
          templateProduct.price,
          quantity,
          itemTotal,
          discountedTotal,
          templateProduct.packaging,
          '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
        ]);
      });

      // 底部总计（只在该颜色有订单时显示）
      if (colorTotal > 0) {
        data.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        data.push(['◎ 以上報價不含運費、稅金。', '', '', '◎ 訂購金額未達新台幣5000元，運費由客戶支付。', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        data.push(['◎ 每月25日結帳，26日起計次月帳。', '', '', '◎ 貨款票期：當月結，最長 60天票。', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        data.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

        const tax = Math.round(colorTotal * 0.05);
        const grandTotal = colorTotal + tax;

        data.push(['總計金額', '', '稅金', '', '應收金額', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        data.push([colorTotal, '', tax, '', grandTotal, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      }

      const ws = XLSX.utils.aoa_to_sheet(data);

      // 设置列宽（29列）
      ws['!cols'] = [
        { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 10 },
        { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 8 },
        { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 },
        { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 },
        { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 },
        { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, color);
    });

    return wb;
  };

  // 下载 Excel
  const handleDownloadExcel = (order) => {
    const wb = generateExcelForOrder(order);
    const orderDate = new Date(order.date);
    const dateStr = `${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}`;
    XLSX.writeFile(wb, `嘉城工業訂購單_大金材料-${dateStr}.xlsx`);
    setShowMoreMenu(false);
  };

  // 分享订单
  const handleShareOrder = async (order) => {
    const wb = generateExcelForOrder(order);
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const orderDate = new Date(order.date);
    const dateStr = `${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}`;
    const fileName = `嘉城工業訂購單_大金材料-${dateStr}.xlsx`;
    const file = new File([blob], fileName, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: '嘉城工業訂購單',
          text: `客戶：大金材料\n訂購日期：${dateStr}\n訂購金額：NT$ ${order.total.toLocaleString()}`
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
    const totalBoxes = Object.entries(tempQuantities).reduce((sum, [key, qty]) => {
      const [color, index] = key.split('-');
      const product = BASE_PRODUCTS[parseInt(index)];
      const unitSize = getUnitSize(product.package);
      return sum + Math.ceil(qty / unitSize);
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
                              {Math.ceil(qty / unitSize)} 箱
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
            <span className="text-gray-400">總數量：</span>
            <span className="text-xl font-bold mx-2">{totalQuantity}</span>
            <span className="mx-2">|</span>
            <span className="text-gray-400">總箱數：</span>
            <span className="text-xl font-bold mx-2">{totalBoxes}</span>
            <span className="text-gray-400">箱</span>
            <span className="mx-2">|</span>
            <span className="text-blue-400 text-xl font-bold">NT$ {totalPrice.toLocaleString()}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={totalQuantity === 0}
            className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-all active:scale-98"
          >
            加入購物車
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
                共 {order.items.reduce((sum, item) => {
                  const unitSize = getUnitSize(item.product.package);
                  return sum + Math.ceil(item.quantity / unitSize);
                }, 0)} 箱商品
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
              <div className="space-y-6">
                {/* 按品项分类分组 */}
                {Object.entries(
                  cart.reduce((groups, item) => {
                    const category = item.product.category;
                    if (!groups[category]) groups[category] = [];
                    groups[category].push(item);
                    return groups;
                  }, {})
                ).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    {/* 品项标题 */}
                    <div className="text-blue-400 font-bold text-sm px-2 py-1 bg-blue-500/10 rounded-lg inline-block">
                      {category}
                    </div>

                    {/* 该品项下的商品 */}
                    {items.map(item => (
                      <div
                        key={item.id}
                        className={`bg-white/5 rounded-xl p-4 border border-white/10 transition-all duration-400 ${
                          removingItems.has(item.id) ? 'animate-remove-item' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            {/* 规格名称 */}
                            <div className="text-white font-bold text-lg mb-2">{item.product.name}</div>
                            {/* 颜色 - 强调显示 */}
                            <div className="inline-block px-3 py-1.5 rounded-lg text-base font-bold"
                              style={{
                                backgroundColor:
                                  item.color === '象牙' ? '#FFF8DC' :
                                  item.color === '咖啡' ? '#8B4513' :
                                  item.color === '白色' ? '#FFFFFF' :
                                  item.color === '灰色' ? '#808080' :
                                  '#000000',
                                color:
                                  item.color === '白色' || item.color === '象牙' ? '#000000' : '#FFFFFF'
                              }}
                            >
                              {item.color}
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
                          {/* 数量调整器 */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateCartItem(item.id, -1)}
                              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                            >
                              −
                            </button>
                            <div className="min-w-[60px] text-center">
                              <div className="text-white font-bold text-lg">{item.quantity}</div>
                              <div className="text-xs text-gray-400">數量</div>
                            </div>
                            <button
                              onClick={() => handleUpdateCartItem(item.id, 1)}
                              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                            >
                              +
                            </button>
                          </div>

                          {/* 箱数和金额 */}
                          <div className="text-right">
                            <div className="text-gray-400 text-sm mb-1">
                              {Math.ceil(item.quantity / getUnitSize(item.product.package))} 箱
                            </div>
                            <div className="text-blue-400 font-bold text-lg">
                              NT$ {item.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 底部结算 */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
              <button
                onClick={handleConfirmOrder}
                className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-98"
              >
                <div className="flex items-center justify-center gap-4">
                  <span>總箱數：{cartTotalBoxes} 箱</span>
                  <span>|</span>
                  <span>總金額：NT$ {total.toLocaleString()}</span>
                </div>
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

    // 按分类分组商品
    const itemsByCategory = {};
    order.items.forEach(item => {
      const category = item.product.category;
      if (!itemsByCategory[category]) {
        itemsByCategory[category] = [];
      }
      itemsByCategory[category].push(item);
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

            {/* 商品列表（按分类分组） */}
            <div className="space-y-4">
              {Object.entries(itemsByCategory).map(([category, items]) => (
                <div key={category} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-blue-400 font-bold mb-3">{category}</div>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="bg-white/5 rounded-lg p-3 border border-white/5">
                        {/* 主要信息：规格、数量、颜色 */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-white text-lg font-bold">{item.product.name}</div>
                            <div className="text-blue-400 text-lg font-bold">× {item.quantity}</div>
                            <div className="text-gray-300 text-sm px-2 py-1 bg-white/10 rounded">
                              {item.color}
                            </div>
                          </div>
                        </div>
                        {/* 次要信息：单价、小计 */}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div>單價 NT$ {item.product.price}</div>
                          <div>|</div>
                          <div>小計 <span className="text-white font-medium">NT$ {item.price.toLocaleString()}</span></div>
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
          {currentPage === 'home' && '空調飾管訂購'}
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
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center animate-bounce-once">
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
            transform: translate(0, 50px) scale(1) rotate(0deg);
            opacity: 1;
          }
          30% {
            transform: translate(100px, -100px) scale(0.8) rotate(20deg);
            opacity: 1;
          }
          70% {
            transform: translate(250px, -250px) scale(0.4) rotate(45deg);
            opacity: 0.6;
          }
          100% {
            transform: translate(350px, -350px) scale(0.1) rotate(60deg);
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

        @keyframes remove-item {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
            max-height: 500px;
          }
          50% {
            opacity: 0.5;
            transform: translateX(20px) scale(0.95);
          }
          100% {
            opacity: 0;
            transform: translateX(100px) scale(0.8);
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            margin-top: 0;
            margin-bottom: 0;
            border-width: 0;
          }
        }

        .animate-fly-to-cart {
          animation: fly-to-cart 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-remove-item {
          animation: remove-item 0.4s ease-out forwards;
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

// 用错误边界包裹App组件
const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
