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
        <td class="num-col">${order.influencerCommission}</td>
        <td class="num-col">${order.platformCommission}</td>
        <td class="num-col">${order.settlementAmount}</td>
        <td class="num-col">${order.recognizedAmount}</td>
        <td>${order.recognizeTime}</td>
        <td>${renderInvoiceStatus(order.ourInvoice)}</td>
        <td>${renderInvoiceStatus(order.douyinInvoice)}</td>
        <td>${renderSettleStatus(order.isSettled)}</td>
        <td><span class="remark-text">${order.remark}</span></td>
        <td>${order.recognizer || '-'}</td>
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
    return '<span class="status-tag success">已开票</span>';
  } else if (status === '部分开票') {
    return '<span class="status-tag warning">部分开票</span>';
  } else if (status === '未开票') {
    return '<span class="status-tag gray">未开票</span>';
  }
  return status || '-';
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
        <span class="summary-label">总订单号</span>
        <span class="summary-value">${totalOrderNo}</span>
      </div>
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
        <span class="summary-value">¥${order.influencerCommission}</span>
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
      <span>注：达人佣金和平台佣金先从原订单金额扣除</span>
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
  } else if (status === '未开票') {
    return '<span class="status-tag warning">未开票</span>';
  }
  return status || '-';
}

// ===== 操作按钮处理 =====
function handleImportRenkuan() {
  showToast('导入认款功能', 'info');
}

function handleImportInvoice() {
  showToast('导入抖店开票数据功能', 'info');
}

function handleEdit(orderNo) {
  showToast(`编辑订单 ${orderNo}`, 'info');
}

// ===== Toast 提示 =====
function showToast(message, type = 'info') {
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
  }, 2000);
}

// ===== 点击遮罩关闭弹窗 =====
document.addEventListener('click', (e) => {
  if (e.target.id === 'orderDetailModal') {
    closeModal();
  }
});

// ===== ESC 键关闭弹窗 =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderTopTabs();
  renderOrderTable();
});
