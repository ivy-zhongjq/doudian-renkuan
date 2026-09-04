// mock.js — 抖店认款系统模拟数据
// 单页应用数据中心，所有页面数据来源于此

const DB = {
  // 当前登录用户
  currentUser: {
    name: '管理员',
    status: '在线'
  },

  // 侧边栏菜单
  sidebarMenus: [
    { label: '认款管理', icon: 'receipt', children: [
      { label: '认款列表', key: 'renkuan-list', active: true },
      { label: '已认款明细', key: 'yirenkuan-mingxi' },
      { label: '新零售已认款订单', key: 'xinlingshou-yirenkuan' },
    ]},
  ],

  // 顶部标签页
  topTabs: [
    { label: '认款列表', key: 'renkuan-list', active: true },
  ],

  // 认款订单列表
  orders: [
    {
      totalOrderNo: '6925165121833041575',
      orderAmount: 198,
      userPaid: 187.5,
      platformSubsidy: 9,
      paymentDiscount: 1.5,
      influencerCommission: 9.9,
      platformCommission: 9.9,
      settlementAmount: 178.2,
      recognizedAmount: 188.1,
      recognizeTime: '2026-09-01',
      ourInvoice: '已开票',
      douyinInvoice: '已开票',
      isSettled: '已结清',
      remark: '平台补贴、支付优惠、达人佣金、平台佣金都有',
      recognizer: ''
    },
    {
      totalOrderNo: '6925180932148788326',
      orderAmount: 198,
      userPaid: 193,
      platformSubsidy: 0,
      paymentDiscount: 5,
      influencerCommission: 9.9,
      platformCommission: 9.9,
      settlementAmount: 178.2,
      recognizedAmount: 188.1,
      recognizeTime: '2026-09-01',
      ourInvoice: '部分开票',
      douyinInvoice: '已开票',
      isSettled: '已结清',
      remark: '只有支付优惠、达人佣金、平台佣金',
      recognizer: ''
    },
    {
      totalOrderNo: '6925150126368325030',
      orderAmount: 198,
      userPaid: 198,
      platformSubsidy: 0,
      paymentDiscount: 0,
      influencerCommission: 0,
      platformCommission: 1.19,
      settlementAmount: 196.81,
      recognizedAmount: 196.81,
      recognizeTime: '2026-09-01',
      ourInvoice: '已开票',
      douyinInvoice: '已开票',
      isSettled: '已结清',
      remark: '（此单只收了平台佣金）',
      recognizer: ''
    },
    {
      totalOrderNo: '6925223516209053190',
      orderAmount: 198,
      userPaid: 166.83,
      platformSubsidy: 31.17,
      paymentDiscount: 0,
      influencerCommission: 0,
      platformCommission: 19.8,
      settlementAmount: 178.2,
      recognizedAmount: 178.2,
      recognizeTime: '2026-09-01',
      ourInvoice: '已开票',
      douyinInvoice: '已开票',
      isSettled: '已结清',
      remark: '只有平台补贴（此单支出合计包含平台服务费和站外推广费，都需平台开票）',
      recognizer: ''
    },
    {
      totalOrderNo: '6951628017741076249',
      orderAmount: 198,
      userPaid: 198,
      platformSubsidy: 0,
      paymentDiscount: 0,
      influencerCommission: 9.9,
      platformCommission: 9.9,
      settlementAmount: 178.2,
      recognizedAmount: 188.1,
      recognizeTime: '2026-09-01',
      ourInvoice: '已开票',
      douyinInvoice: '已开票',
      isSettled: '已结清',
      remark: '只有达人佣金、平台佣金',
      recognizer: ''
    }
  ],

  // 订单详情 - 点击总订单号弹窗展示的关联订单
  orderDetails: {
    '6925165121833041575': [
      {
        relatedOrderNo: '6925165121833041575',
        orderAmount: 187.5,
        recognizeStatus: '已认款',
        recognizedAmount: 167.7,
        fundCategory: '礼品',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '已开票',
        invoiceAmount: 187.5,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925165121833041575-A',
        orderAmount: 9,
        recognizeStatus: '已认款',
        recognizedAmount: 9,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '北京有竹居网络技术有限公司',
        invoiceStatus: '已开票',
        invoiceAmount: 9,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925165121833041575-B',
        orderAmount: 1.5,
        recognizeStatus: '已认款',
        recognizedAmount: 1.5,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '北京字跳网络技术有限公司',
        invoiceStatus: '已开票',
        invoiceAmount: 1.5,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925165121833041575',
        orderAmount: 9.9,
        recognizeStatus: '已认款',
        recognizedAmount: 9.9,
        fundCategory: '信息服务费-待确定\n达人佣金',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '无需开票',
        invoiceAmount: '-',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925165121833041575',
        orderAmount: 9.9,
        recognizeStatus: '-',
        recognizedAmount: '-',
        fundCategory: '信息服务费-待确定\n平台佣金',
        fundMonth: '2026-04',
        customerName: '-',
        invoiceStatus: '抖店已开票',
        invoiceAmount: 9.9,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      }
    ],
    '6925180932148788326': [
      {
        relatedOrderNo: '6925180932148788326',
        orderAmount: 187.5,
        recognizeStatus: '已认款',
        recognizedAmount: 167.7,
        fundCategory: '礼品',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '已开票',
        invoiceAmount: 193,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925180932148788326-B',
        orderAmount: 1.5,
        recognizeStatus: '已认款',
        recognizedAmount: 5,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '北京字跳网络技术有限公司',
        invoiceStatus: '待开票',
        invoiceAmount: '-',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925180932148788326',
        orderAmount: 9.9,
        recognizeStatus: '已认款',
        recognizedAmount: 9.9,
        fundCategory: '信息服务费-待确定\n达人佣金',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '无需开票',
        invoiceAmount: '-',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925180932148788326',
        orderAmount: 9.9,
        recognizeStatus: '-',
        recognizedAmount: '-',
        fundCategory: '信息服务费-待确定\n平台佣金',
        fundMonth: '2026-04',
        customerName: '-',
        invoiceStatus: '抖店已开票',
        invoiceAmount: 9.9,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      }
    ],
    '6925150126368325030': [
      {
        relatedOrderNo: '6925150126368325030',
        orderAmount: 198,
        recognizeStatus: '已认款',
        recognizedAmount: 196.81,
        fundCategory: '礼品',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '已开票',
        invoiceAmount: 198,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925150126368325030',
        orderAmount: 1.19,
        recognizeStatus: '-',
        recognizedAmount: '-',
        fundCategory: '信息服务费-待确定\n平台佣金',
        fundMonth: '2026-04',
        customerName: '-',
        invoiceStatus: '抖店已开票',
        invoiceAmount: 1.19,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      }
    ],
    '6925223516209053190': [
      {
        relatedOrderNo: '6925223516209053190',
        orderAmount: 166.83,
        recognizeStatus: '已认款',
        recognizedAmount: 147.03,
        fundCategory: '卡片',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '已开票',
        invoiceAmount: 166.83,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925223516209053190-A',
        orderAmount: 31.17,
        recognizeStatus: '已认款',
        recognizedAmount: 31.17,
        fundCategory: '信息服务费',
        fundMonth: '2026-04',
        customerName: '北京字跳网络技术有限公司',
        invoiceStatus: '已开票',
        invoiceAmount: 31.17,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6925223516209053190',
        orderAmount: 19.8,
        recognizeStatus: '-',
        recognizedAmount: '-',
        fundCategory: '信息服务费-待确定\n平台佣金',
        fundMonth: '2026-04',
        customerName: '-',
        invoiceStatus: '抖店已开票',
        invoiceAmount: 19.8,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      }
    ],
    '6951628017741076249': [
      {
        relatedOrderNo: '6951628017741076249',
        orderAmount: 198,
        recognizeStatus: '已认款',
        recognizedAmount: 178.2,
        fundCategory: '礼品',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '已开票',
        invoiceAmount: 198,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6951628017741076249',
        orderAmount: 9.9,
        recognizeStatus: '已认款',
        recognizedAmount: 9.9,
        fundCategory: '信息服务费-待确定\n达人佣金的',
        fundMonth: '2026-04',
        customerName: '抖音零售客户',
        invoiceStatus: '无需开票',
        invoiceAmount: '-',
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      },
      {
        relatedOrderNo: '6951628017741076249',
        orderAmount: 9.9,
        recognizeStatus: '-',
        recognizedAmount: '-',
        fundCategory: '信息服务费-待确定\n平台佣金',
        fundMonth: '2026-04',
        customerName: '-',
        invoiceStatus: '抖店已开票',
        invoiceAmount: 9.9,
        recognizeTime: '2026-09-01',
        recognizer: '饶子杰'
      }
    ]
  },

  // 筛选选项
  filterOptions: {
    isSettled: ['全部', '已结清', '未结清'],
    isRecognized: ['全部', '已认款', '未认款'],
    douyinInvoice: ['全部', '已开票', '未开票'],
    ourInvoice: ['全部', '已开票', '部分开票', '未开票']
  }
};
