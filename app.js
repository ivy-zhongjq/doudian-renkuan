// app.js — 抖店认款系统交互逻辑

// ===== 侧边栏菜单渲染 =====
function renderSidebar() {
  const menuEl = document.getElementById('sidebarMenu');
  let html = '';

  DB.sidebarMenus.forEach((group, gIdx) => {
    const isOpen = true; // 默认展开
    html += `
      <div class="menu-group ${isOpen ? 'open' : ''}" data-group="${gIdx}">
        <div class="menu-group-title" onclick="toggleMenuGroup(${gIdx})">
          <span class="menu-icon">${getMenuIcon(group.icon)}</span>
          <span>${group.label}</span>
          <span class="menu-arrow">
            <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
        </div>
        <div class="menu-group-children">
    `;

    group.children.forEach((item) => {
      html += `
          <div class="menu-item ${item.active ? 'active' : ''}" data-key="${item.key}">
            <span class="menu-dot"></span>
            <span>${item.label}</span>
          </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  menuEl.innerHTML = html;
}

function getMenuIcon(iconName) {
  const icons = {
    receipt: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/>
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
      <path d="M12 17V7"/>
    </svg>`
  };
  return icons[iconName] || icons.receipt;
}

function toggleMenuGroup(idx) {
  const group = document.querySelector(`.menu-group[data-group="${idx}"]`);
  if (group) {
    group.classList.toggle('open');
  }
}

// ===== 顶部标签渲染 =====
function renderTopTabs() {
  const tabsEl = document.getElementById('topTabs');
  let html = '';

  DB.topTabs.forEach((tab) => {
    html += `
      <div class="topbar-tab ${tab.active ? 'active' : ''}">
        <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        ${tab.label}
        <span class="tab-close">
          <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </span>
      </div>
    `;
  });

  tabsEl.innerHTML = html;
}

// ===== 订单表格渲染 =====
function renderOrderTable() {
  const tbody = document.getElementById('orderTableBody');
  let html = '';

  DB.orders.forEach((order) => {
    html += `
      <tr>
        <td>
          <span class="order-link" onclick="openOrderDetail('${order.totalOrderNo}')">${formatOrderNo(order.totalOrderNo)}</span>
        </td>
        <td class="num-col">${order.orderAmount}</td>
        <td class="num-col">${order.userPaid}</td>
        <td class="num-col">${order.platformSubsidy}</td>
        <td class="num-col">${order.paymentDiscount}</td>
        <td class="num-col">${order.platformCommission}</td>
        <td class="num-col">${order.influencerServiceFee}</td>
        <td class="num-col">${(order.influencerCommission - order.influencerServiceFee).toFixed(2)}</td>
        <td class="num-col">${order.settlementAmount}</td>
        <td class="num-col"><span class="order-link" onclick="openRecognizedDetail('${order.totalOrderNo}')">${order.recognizedAmount}</span></td>
        <td>${order.recognizeTime}</td>
        <td>${renderInvoiceStatus(order.ourInvoice)}</td>
        <td>${renderInvoiceStatus(order.douyinInvoice)}</td>
        <td>${renderSettleStatus(order.isSettled)}</td>
        <td><span class="remark-text">${order.remark}</span></td>
        <td class="action-col">
          <button class="btn btn-text" onclick="handleEdit('${order.totalOrderNo}')">编辑</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  document.getElementById('totalCount').textContent = DB.orders.length;
}

// 格式化订单号 - 每6个字符换行
function formatOrderNo(orderNo) {
  if (!orderNo) return '-';
  // 按6个字符分段显示
  const parts = [];
  for (let i = 0; i < orderNo.length; i += 6) {
    parts.push(orderNo.slice(i, i + 6));
  }
  return parts.join('\n');
}

// 渲染开票状态
function renderInvoiceStatus(status) {
  if (status === '已开票') {
    return '<span class="status-tag success">已开票</span> <button class="btn-download" onclick="handleDownloadInvoice(event)" title="下载发票"><svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>';
  } else if (status === '部分开票') {
    return '<span class="status-tag warning">部分开票</span> <button class="btn-download" onclick="handleDownloadInvoice(event)" title="下载发票"><svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>';
  } else if (status === '未开票') {
    return '<span class="status-tag gray">未开票</span>';
  }
  return status || '-';
}

// 下载发票
function handleDownloadInvoice(e) {
  e.stopPropagation();
  showToast('发票下载中...', 'info', 2000);
}

// 渲染结清状态
function renderSettleStatus(status) {
  if (status === '已结清') {
    return '<span class="status-tag success">已结清</span>';
  } else if (status === '未结清') {
    return '<span class="status-tag warning">未结清</span>';
  }
  return status || '-';
}

// ===== 订单详情弹窗 =====
function openOrderDetail(totalOrderNo) {
  const details = DB.orderDetails[totalOrderNo];
  if (!details) return;

  const order = DB.orders.find(o => o.totalOrderNo === totalOrderNo);

  // 设置弹窗标题
  document.getElementById('modalTitle').textContent = `订单详情 - ${totalOrderNo}`;

  // 渲染摘要信息
  const summaryEl = document.getElementById('modalSummary');
  if (order) {
    summaryEl.innerHTML = `
      <div class="summary-item">
        <span class="summary-label">订单总金额</span>
        <span class="summary-value">¥${order.orderAmount}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">用户实付</span>
        <span class="summary-value">¥${order.userPaid}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">结算金额</span>
        <span class="summary-value">¥${order.settlementAmount}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">达人佣金</span>
        <span class="summary-value">¥${(order.influencerCommission - order.influencerServiceFee).toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">达人佣金服务费</span>
        <span class="summary-value">¥${order.influencerServiceFee}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">平台佣金</span>
        <span class="summary-value">¥${order.platformCommission}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">已认款</span>
        <span class="summary-value">¥${order.recognizedAmount}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">是否已结清</span>
        <span class="summary-value">${renderSettleStatus(order.isSettled)}</span>
      </div>
    `;
  }

  // 添加说明文字
  const noteHtml = `
    <div class="modal-note">
      <span class="note-icon">
        <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </span>
      <span>注：达人佣金和平台佣金先从原订单金额扣除；达人佣金服务费为达人佣金的10%</span>
    </div>
  `;
  summaryEl.innerHTML += noteHtml;

  // 渲染关联订单表格
  const detailTbody = document.getElementById('detailTableBody');
  let html = '';

  details.forEach((item) => {
    html += `
      <tr>
        <td>${formatOrderNo(item.relatedOrderNo)}</td>
        <td class="num-col">${item.orderAmount}</td>
        <td>${renderRecognizeStatus(item.recognizeStatus)}</td>
        <td class="num-col">${item.recognizedAmount}</td>
        <td><span class="category-text">${item.fundCategory}</span></td>
        <td>${item.fundMonth}</td>
        <td>${item.customerName}</td>
        <td>${renderDetailInvoiceStatus(item.invoiceStatus)}</td>
        <td class="num-col">${item.invoiceAmount}</td>
        <td>${item.remark || '-'}</td>
        <td>${item.recognizeTime}</td>
        <td>${item.recognizer}</td>
      </tr>
    `;
  });

  detailTbody.innerHTML = html;

  // 显示弹窗
  const modal = document.getElementById('orderDetailModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('orderDetailModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// 渲染认款状态
function renderRecognizeStatus(status) {
  if (status === '已认款') {
    return '<span class="status-tag success">已认款</span>';
  } else if (status === '未认款') {
    return '<span class="status-tag warning">未认款</span>';
  }
  return status || '-';
}

// 渲染详情页开票状态
function renderDetailInvoiceStatus(status) {
  if (status === '已开票') {
    return '<span class="status-tag success">已开票</span>';
  } else if (status === '抖店已开票') {
    return '<span class="status-tag info">抖店已开票</span>';
  } else if (status === '无需开票') {
    return '<span class="status-tag gray">无需开票</span>';
  } else if (status === '待开票') {
    return '<span class="status-tag warning">待开票</span>';
  } else if (status === '未开票') {
    return '<span class="status-tag warning">未开票</span>';
  }
  return status || '-';
}

// ===== 已认款明细弹窗 =====
function openRecognizedDetail(totalOrderNo) {
  const order = DB.orders.find(o => o.totalOrderNo === totalOrderNo);
  if (!order) return;

  document.getElementById('recognizedDetailTitle').textContent = `已认款明细 - 交易流水号: 110001900GYKG4GJZW5`;

  const tbody = document.getElementById('recognizedDetailBody');

  // 加载提示
  tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; padding: 24px; color: var(--text-tertiary);">正在努力地加载数据中，请稍候……</td></tr>`;

  const modal = document.getElementById('recognizedDetailModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';

  // 模拟加载延迟后填充数据
  setTimeout(() => {
    const details = DB.orderDetails[totalOrderNo] || [];
    let html = '';
    details.forEach((item) => {
      const payerName = item.remark === '平台佣金' || item.remark === '达人佣金服务费'
        ? '杭州银行-平台商户交易资金待清算账户（抖音）'
        : '江苏银行-平台交易资金专户（抖音）';
      html += `
        <tr>
          <td>2026-03-27</td>
          <td>110001900GYKG4GJZW5</td>
          <td>${payerName}</td>
          <td>${renderRecognizeStatus(item.recognizeStatus)}</td>
          <td class="num-col">${item.recognizedAmount}</td>
          <td>${item.customerName}</td>
          <td>${item.fundCategory}</td>
          <td>${item.remark === '平台佣金' ? 'SYAA-20260327-001' : '-'}</td>
          <td>${item.fundMonth}</td>
          <td>${item.recognizeTime}</td>
          <td>${item.recognizer}</td>
          <td>财务部</td>
        </tr>
      `;
    });
    tbody.innerHTML = html || `<tr><td colspan="12" style="text-align: center; padding: 24px; color: var(--text-tertiary);">暂无数据</td></tr>`;
  }, 800);
}

function closeRecognizedDetailModal() {
  const modal = document.getElementById('recognizedDetailModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// ===== 操作按钮处理 =====
function handleImportRenkuan() {
  const modal = document.getElementById('renkuanImportModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// ===== 导入抖店结算账单 → 自动匹配生成认款板块 =====
function handleBillUpload() {
  showToast('正在解析账单文件...', 'info');

  setTimeout(() => {
    const container = document.getElementById('renkuanBlocksContainer');
    container.innerHTML = '';

    // 按 "客户|款项类型" 分组，同组内合并金额和订单号
    const groups = {};

    DB.mockBillData.forEach((bill) => {
      const paymentType = DB.productIdMap[bill.productId] || '礼品';

      // 1. 抖音零售客户：款项类型由商品ID匹配，金额=用户实付-支出合计+达人佣金
      const amount1 = parseFloat((bill.userPaid - bill.totalExpenditure + bill.influencerCommission).toFixed(2));
      if (amount1 !== 0) {
        const key = 'CUST1001|' + paymentType;
        if (!groups[key]) groups[key] = { custValue: 'CUST1001', custLabel: '抖音零售客户', paymentType: paymentType, amount: 0, orderNos: [], remarks: [] };
        groups[key].amount = parseFloat((groups[key].amount + amount1).toFixed(2));
        groups[key].orderNos.push(bill.orderNo);
        groups[key].remarks.push('用户实付');
      }

      // 2. 北京有竹居：款项类型=信息服务费，金额=平台补贴
      const amount2 = parseFloat(bill.platformSubsidy.toFixed(2));
      if (amount2 !== 0) {
        const key = 'CUST1002|信息服务费';
        if (!groups[key]) groups[key] = { custValue: 'CUST1002', custLabel: '北京有竹居网络技术有限公司', paymentType: '信息服务费', amount: 0, orderNos: [], remarks: [] };
        groups[key].amount = parseFloat((groups[key].amount + amount2).toFixed(2));
        groups[key].orderNos.push(bill.orderNo + '-A');
        groups[key].remarks.push('平台补贴');
      }

      // 3. 字跳科技：款项类型=信息服务费，金额=抖音支付补贴+抖音月付补贴
      const amount3 = parseFloat((bill.douyinPaySubsidy + bill.douyinMonthlySubsidy).toFixed(2));
      if (amount3 !== 0) {
        const key = 'CUST1003|信息服务费';
        if (!groups[key]) groups[key] = { custValue: 'CUST1003', custLabel: '北京字跳网络技术有限公司', paymentType: '信息服务费', amount: 0, orderNos: [], remarks: [] };
        groups[key].amount = parseFloat((groups[key].amount + amount3).toFixed(2));
        groups[key].orderNos.push(bill.orderNo + '-B');
        groups[key].remarks.push('支付优惠');
      }
    });

    // 按分组生成板块，每个板块一行，关联订单号为多选
    const groupKeys = Object.keys(groups);
    if (groupKeys.length === 0) {
      createAutoBlock(1, '', '', '', { amount: 0, orderNos: [], remark: '' });
    } else {
      groupKeys.forEach((key, idx) => {
        const g = groups[key];
        createAutoBlock(idx + 1, g.custValue, g.custLabel, g.paymentType, {
          amount: g.amount,
          orderNos: g.orderNos,
          remark: g.remarks.join('、')
        });
      });
    }

    // 显示删除按钮（除第一个外）
    container.querySelectorAll('.renkuan-block').forEach((block, idx) => {
      const deleteBtn = block.querySelector('button[onclick*="removeRenkuanBlock"]');
      if (deleteBtn) deleteBtn.style.display = idx === 0 ? 'none' : '';
    });

    updateRenkuanSummary();
    showToast(`账单解析完成，已生成 ${container.children.length} 个认款板块`, 'success');
  }, 1500);
}

function createAutoBlock(index, custValue, custLabel, paymentType, data) {
  const container = document.getElementById('renkuanBlocksContainer');

  // 生成关联订单号多选选项
  const orderNos = data.orderNos || [];
  let orderOptionsHtml = '';
  orderNos.forEach((orderNo) => {
    orderOptionsHtml += `<option value="${orderNo}" selected>${orderNo}</option>`;
  });

  const blockHtml = `
    <div class="renkuan-block" data-block-index="${index}" style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px; background: #fafafa;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">认款板块 ${index}</span>
        <button class="btn btn-text" style="color: var(--danger); font-size: 12px; padding: 2px 8px;" onclick="removeRenkuanBlock(this)" title="删除板块">✕ 删除板块</button>
      </div>
      <div class="filter-item" style="gap: 12px; margin-bottom: 12px;">
        <label style="font-size: 13px; color: var(--text-secondary); min-width: 72px; text-align: right;">付款方户名</label>
        <select class="payer-account" style="flex: 1; height: 32px; padding: 0 var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-sm); background-color: #fff; font-size: 13px; color: var(--text-primary); min-width: 200px;" onchange="updatePayerAmount(this)">
          <option value="">请选择</option>
          <option value="杭州银行-平台商户交易资金待清算账户（抖音）——2000">杭州银行-平台商户交易资金待清算账户（抖音）——2000</option>
          <option value="江苏银行-平台交易资金专户（抖音）——3500">江苏银行-平台交易资金专户（抖音）——3500</option>
        </select>
      </div>
      <div class="payer-amount-display" style="margin-top: -4px; margin-bottom: 12px; padding: 8px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-sm); font-size: 13px; color: #15803d; display: none;">
        可认款金额：<span class="payer-amount-value" style="font-weight: 600;">-</span>
      </div>
      <div class="filter-item" style="gap: 12px; margin-bottom: 12px;">
        <label style="font-size: 13px; color: var(--text-secondary); min-width: 72px; text-align: right;">K3客户 <span style="color: var(--danger);">*</span></label>
        <select style="flex: 1; height: 32px; padding: 0 var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-sm); background-color: #fff; font-size: 13px; color: var(--text-primary); min-width: 200px;">
          <option value="">请选择</option>
          <option value="CUST1383" ${custValue === 'CUST1383' ? 'selected' : ''}>CUST1383 —— 阜阳童悦娱乐有限公司</option>
          <option value="CUST1001" ${custValue === 'CUST1001' ? 'selected' : ''}>CUST1001 —— 抖音零售客户</option>
          <option value="CUST1002" ${custValue === 'CUST1002' ? 'selected' : ''}>CUST1002 —— 北京有竹居网络技术有限公司</option>
          <option value="CUST1003" ${custValue === 'CUST1003' ? 'selected' : ''}>CUST1003 —— 北京字跳网络技术有限公司</option>
        </select>
      </div>
      <div class="table-wrap" style="border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: auto;">
        <table class="data-table" style="font-size: 12px;">
          <thead>
            <tr>
              <th>款项类型 <span style="color: var(--danger);">*</span></th>
              <th class="num-col">认领金额 <span style="color: var(--danger);">*</span></th>
              <th>款项月份</th>
              <th>客户名称</th>
              <th>关联订单号（多选）</th>
              <th>款项备注</th>
              <th style="width: 50px;">操作</th>
            </tr>
          </thead>
          <tbody class="renkuan-detail-body">
            <tr>
              <td>
                <select style="width: 100%; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;">
                  <option value="">请选择</option>
                  <option value="机台" ${paymentType === '机台' ? 'selected' : ''}>机台</option>
                  <option value="配件" ${paymentType === '配件' ? 'selected' : ''}>配件</option>
                  <option value="分成" ${paymentType === '分成' ? 'selected' : ''}>分成</option>
                  <option value="卡片" ${paymentType === '卡片' ? 'selected' : ''}>卡片</option>
                  <option value="礼品" ${paymentType === '礼品' ? 'selected' : ''}>礼品</option>
                  <option value="其他" ${paymentType === '其他' ? 'selected' : ''}>其他</option>
                  <option value="押金" ${paymentType === '押金' ? 'selected' : ''}>押金</option>
                  <option value="信息服务" ${paymentType === '信息服务' ? 'selected' : ''}>信息服务</option>
                  <option value="信息服务费" ${paymentType === '信息服务费' ? 'selected' : ''}>信息服务费</option>
                  <option value="游艺安装" ${paymentType === '游艺安装' ? 'selected' : ''}>游艺安装</option>
                  <option value="游艺设计" ${paymentType === '游艺设计' ? 'selected' : ''}>游艺设计</option>
                </select>
              </td>
              <td><input type="number" value="${data.amount || ''}" style="width: 80px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px; text-align: right;" placeholder="0.00" oninput="updateRenkuanTotal()"></td>
              <td><input type="month" value="2026-03" style="width: 110px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;"></td>
              <td><input type="text" value="${custLabel || ''}" style="width: 120px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;" placeholder="客户名称"></td>
              <td>
                <select multiple style="width: 150px; min-height: 60px; padding: 4px 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;">
                  ${orderOptionsHtml || '<option value="">（暂无订单）</option>'}
                </select>
              </td>
              <td><input type="text" value="${data.remark || ''}" style="width: 100px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;" placeholder="备注"></td>
              <td style="text-align: center;"><button style="border: none; background: transparent; color: var(--danger); cursor: pointer; font-size: 16px; padding: 2px 6px;" onclick="removeRenkuanRow(this)" title="删除">✕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btn btn-text" style="margin-top: 8px; color: var(--success); font-size: 13px;" onclick="addRenkuanRow(this)">+ 追加</button>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', blockHtml);
}

function closeRenkuanImportModal() {
  const modal = document.getElementById('renkuanImportModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function updatePayerAmount(selectEl) {
  const block = selectEl.closest('.renkuan-block');
  const display = block.querySelector('.payer-amount-display');
  const valueEl = block.querySelector('.payer-amount-value');

  if (selectEl.value) {
    const amount = selectEl.value.split('——')[1];
    valueEl.textContent = '¥' + amount;
    display.style.display = 'block';
  } else {
    display.style.display = 'none';
  }
  updateRenkuanSummary();
}

function addRenkuanRow(btnEl) {
  const block = btnEl.closest('.renkuan-block');
  const tbody = block.querySelector('.renkuan-detail-body');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <select style="width: 100%; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;">
        <option value="">请选择</option>
        <option value="机台">机台</option>
        <option value="配件">配件</option>
        <option value="分成">分成</option>
        <option value="卡片">卡片</option>
        <option value="礼品">礼品</option>
        <option value="其他">其他</option>
        <option value="押金">押金</option>
        <option value="信息服务">信息服务</option>
        <option value="信息服务费">信息服务费</option>
        <option value="游艺安装">游艺安装</option>
        <option value="游艺设计">游艺设计</option>
      </select>
    </td>
    <td><input type="number" style="width: 80px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px; text-align: right;" placeholder="0.00" oninput="updateRenkuanTotal()"></td>
    <td><input type="month" style="width: 110px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;"></td>
    <td><input type="text" style="width: 120px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;" placeholder="客户名称"></td>
    <td>
      <select multiple style="width: 150px; min-height: 60px; padding: 4px 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;">
        <option value="">（暂无订单）</option>
      </select>
    </td>
    <td><input type="text" style="width: 100px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;" placeholder="备注"></td>
    <td style="text-align: center;"><button style="border: none; background: transparent; color: var(--danger); cursor: pointer; font-size: 16px; padding: 2px 6px;" onclick="removeRenkuanRow(this)" title="删除">✕</button></td>
  `;
  tbody.appendChild(tr);
}

function removeRenkuanRow(btn) {
  const tbody = btn.closest('tbody');
  if (tbody.children.length > 1) {
    btn.closest('tr').remove();
    updateRenkuanTotal();
  }
}

function updateRenkuanTotal() {
  updateRenkuanSummary();
}

function updateRenkuanSummary() {
  let inputTotal = 0;
  document.querySelectorAll('#renkuanBlocksContainer input[type="number"]').forEach(input => {
    const val = parseFloat(input.value) || 0;
    inputTotal += val;
  });
  document.getElementById('renkuanInputTotal').textContent = inputTotal.toFixed(2);
}

function addRenkuanBlock() {
  const container = document.getElementById('renkuanBlocksContainer');
  const blockCount = container.children.length;
  const newIndex = blockCount + 1;

  const blockHtml = `
    <div class="renkuan-block" data-block-index="${newIndex}" style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px; background: #fafafa;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">认款板块 ${newIndex}</span>
        <button class="btn btn-text" style="color: var(--danger); font-size: 12px; padding: 2px 8px;" onclick="removeRenkuanBlock(this)" title="删除板块">✕ 删除板块</button>
      </div>
      <div class="filter-item" style="gap: 12px; margin-bottom: 12px;">
        <label style="font-size: 13px; color: var(--text-secondary); min-width: 72px; text-align: right;">付款方户名</label>
        <select class="payer-account" style="flex: 1; height: 32px; padding: 0 var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-sm); background-color: #fff; font-size: 13px; color: var(--text-primary); min-width: 200px;" onchange="updatePayerAmount(this)">
          <option value="">请选择</option>
          <option value="杭州银行-平台商户交易资金待清算账户（抖音）——2000">杭州银行-平台商户交易资金待清算账户（抖音）——2000</option>
          <option value="江苏银行-平台交易资金专户（抖音）——3500">江苏银行-平台交易资金专户（抖音）——3500</option>
        </select>
      </div>
      <div class="payer-amount-display" style="margin-top: -4px; margin-bottom: 12px; padding: 8px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-sm); font-size: 13px; color: #15803d; display: none;">
        可认款金额：<span class="payer-amount-value" style="font-weight: 600;">-</span>
      </div>
      <div class="filter-item" style="gap: 12px; margin-bottom: 12px;">
        <label style="font-size: 13px; color: var(--text-secondary); min-width: 72px; text-align: right;">K3客户 <span style="color: var(--danger);">*</span></label>
        <select style="flex: 1; height: 32px; padding: 0 var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-sm); background-color: #fff; font-size: 13px; color: var(--text-primary); min-width: 200px;">
          <option value="">请选择</option>
          <option value="CUST1383">CUST1383 —— 阜阳童悦娱乐有限公司</option>
          <option value="CUST1001">CUST1001 —— 抖音零售客户</option>
          <option value="CUST1002">CUST1002 —— 北京有竹居网络技术有限公司</option>
          <option value="CUST1003">CUST1003 —— 北京字跳网络技术有限公司</option>
        </select>
      </div>
      <div class="table-wrap" style="border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: auto;">
        <table class="data-table" style="font-size: 12px;">
          <thead>
            <tr>
              <th>款项类型 <span style="color: var(--danger);">*</span></th>
              <th class="num-col">认领金额 <span style="color: var(--danger);">*</span></th>
              <th>款项月份</th>
              <th>客户名称</th>
              <th>关联订单号（多选）</th>
              <th>款项备注</th>
              <th style="width: 50px;">操作</th>
            </tr>
          </thead>
          <tbody class="renkuan-detail-body">
            <tr>
              <td>
                <select style="width: 100%; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;">
                  <option value="">请选择</option>
                  <option value="机台">机台</option>
                  <option value="配件">配件</option>
                  <option value="分成">分成</option>
                  <option value="卡片">卡片</option>
                  <option value="礼品">礼品</option>
                  <option value="其他">其他</option>
                  <option value="押金">押金</option>
                  <option value="信息服务">信息服务</option>
                  <option value="信息服务费">信息服务费</option>
                  <option value="游艺安装">游艺安装</option>
                  <option value="游艺设计">游艺设计</option>
                </select>
              </td>
              <td><input type="number" style="width: 80px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px; text-align: right;" placeholder="0.00" oninput="updateRenkuanTotal()"></td>
              <td><input type="month" style="width: 110px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;"></td>
              <td><input type="text" style="width: 120px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;" placeholder="客户名称"></td>
              <td>
                <select multiple style="width: 150px; min-height: 60px; padding: 4px 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;">
                  <option value="">（暂无订单）</option>
                </select>
              </td>
              <td><input type="text" style="width: 100px; height: 28px; padding: 0 6px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px;" placeholder="备注"></td>
              <td style="text-align: center;"><button style="border: none; background: transparent; color: var(--danger); cursor: pointer; font-size: 16px; padding: 2px 6px;" onclick="removeRenkuanRow(this)" title="删除">✕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btn btn-text" style="margin-top: 8px; color: var(--success); font-size: 13px;" onclick="addRenkuanRow(this)">+ 追加</button>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', blockHtml);
}

function removeRenkuanBlock(btn) {
  const container = document.getElementById('renkuanBlocksContainer');
  if (container.children.length > 1) {
    btn.closest('.renkuan-block').remove();
    // Renumber blocks
    container.querySelectorAll('.renkuan-block').forEach((block, idx) => {
      block.dataset.blockIndex = idx + 1;
      block.querySelector('span').textContent = `认款板块 ${idx + 1}`;
      const deleteBtn = block.querySelector('button[onclick*="removeRenkuanBlock"]');
      deleteBtn.style.display = idx === 0 ? 'none' : '';
    });
    updateRenkuanSummary();
  }
}

function submitRenkuanImport() {
  closeRenkuanImportModal();
  showToast('认款导入成功', 'success');
}

function handleImportInvoice() {
  const modal = document.getElementById('invoiceImportModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeInvoiceImportModal() {
  const modal = document.getElementById('invoiceImportModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function submitInvoiceImport() {
  const linkInput = document.getElementById('invoiceLinkInput').value.trim();
  closeInvoiceImportModal();
  showToast('导入成功，开票状态已更新', 'success');
}

function handleEdit(orderNo) {
  const order = DB.orders.find(o => o.totalOrderNo === orderNo);
  if (!order) return;

  // 设置弹窗标题和订单号
  document.getElementById('remarkOrderNo').textContent = orderNo;
  // 填充当前备注内容
  document.getElementById('remarkInput').value = order.remark || '';

  // 显示弹窗
  const modal = document.getElementById('remarkModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeRemarkModal() {
  const modal = document.getElementById('remarkModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function saveRemark() {
  const orderNo = document.getElementById('remarkOrderNo').textContent;
  const remarkValue = document.getElementById('remarkInput').value.trim();

  // 更新数据
  const order = DB.orders.find(o => o.totalOrderNo === orderNo);
  if (order) {
    order.remark = remarkValue;
  }

  // 关闭弹窗
  closeRemarkModal();

  // 重新渲染表格
  renderOrderTable();

  // 提示
  showToast('备注已保存', 'success');
}

// ===== Toast 提示 =====
function showToast(message, type = 'info', duration = 2000) {
  // 创建 toast 元素
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    padding: 12px 24px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-size: 14px;
    color: #111827;
    z-index: 2000;
    opacity: 0;
    transition: all 0.3s ease;
    border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  // 显示动画
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  // 自动消失
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

// ===== 点击遮罩关闭弹窗 =====
document.addEventListener('click', (e) => {
  if (e.target.id === 'orderDetailModal') {
    closeModal();
  }
  if (e.target.id === 'recognizedDetailModal') {
    closeRecognizedDetailModal();
  }
  if (e.target.id === 'remarkModal') {
    closeRemarkModal();
  }
  if (e.target.id === 'renkuanImportModal') {
    closeRenkuanImportModal();
  }
  if (e.target.id === 'invoiceImportModal') {
    closeInvoiceImportModal();
  }
});

// ===== ESC 键关闭弹窗 =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeRecognizedDetailModal();
    closeRemarkModal();
    closeInvoiceImportModal();
    closeRenkuanImportModal();
  }
});

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderTopTabs();
  renderOrderTable();
});
