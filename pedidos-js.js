const LOGGED_USER_KEY = 'usuarioLogado';
const ORDERS_KEY = 'pedidos';

const ordersContainer = document.getElementById('ordersContainer');

function getLoggedUser() {
  try {
    const raw = localStorage.getItem(LOGGED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Erro ao ler usuário logado:', error);
    return null;
  }
}

function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Erro ao ler pedidos:', error);
    return [];
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString || '-';
  }
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatPrice(value) {
  const amount = Number(value || 0);
  return `R$ ${amount.toFixed(2).replace('.', ',')}`;
}

function redirectToLogin() {
  window.location.href = 'login.html';
}

function renderEmptyMessage() {
  if (!ordersContainer) return;
  ordersContainer.innerHTML = '<div class="empty-message">Você ainda não fez nenhum pedido.</div>';
}

function renderOrders(orders) {
  if (!ordersContainer) return;
  ordersContainer.innerHTML = '';

  orders.forEach((order) => {
    const itemsHtml = (order.itens || []).map((item) => {
      const itemName = item.nome || item.name || 'Produto';
      const itemQty = item.quantidade || item.quantity || 1;
      return `<div class="item-row"><span>${itemName}</span><strong>Qtd: ${itemQty}</strong></div>`;
    }).join('');

    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <div class="order-card-header">
        <div>
          <strong>Pedido ${order.numeroPedido}</strong>
          <span>${formatDate(order.data)}</span>
        </div>
        <div class="order-status">${order.status || 'Aguardando'}</div>
      </div>
      <div class="order-content">
        <div class="order-summary">
          <span>Total</span>
          <strong>${formatPrice(order.total)}</strong>
        </div>
        <div class="order-items-list">
          ${itemsHtml}
        </div>
      </div>
    `;

    ordersContainer.appendChild(card);
  });
}

function initializePage() {
  const loggedUser = getLoggedUser();
  if (!loggedUser || !loggedUser.email) {
    redirectToLogin();
    return;
  }

  const allOrders = getOrders();
  const userOrders = allOrders.filter((order) => order.usuarioEmail === loggedUser.email);

  if (!userOrders.length) {
    renderEmptyMessage();
    return;
  }

  renderOrders(userOrders.slice().reverse());
}

document.addEventListener('DOMContentLoaded', initializePage);
