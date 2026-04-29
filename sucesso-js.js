const CART_KEY = 'carrinho';
const ORDERS_KEY = 'pedidos';
const LOGGED_KEY = 'usuarioLogado';

const orderNumberField = document.getElementById('orderNumber');
const orderInfoField = document.getElementById('orderInfo');
const alertMessageField = document.getElementById('alertMessage');

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Erro ao ler carrinho:', error);
    return [];
  }
}

function getLoggedUser() {
  try {
    const raw = localStorage.getItem(LOGGED_KEY);
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

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function generateOrderNumber() {
  return `PE${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
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

function getSavedOrder() {
  const raw = sessionStorage.getItem('ultimoPedidoSalvo');
  return raw ? JSON.parse(raw) : null;
}

function setSavedOrder(order) {
  sessionStorage.setItem('ultimoPedidoSalvo', JSON.stringify(order));
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

function createOrder() {
  const cart = getCart();
  const loggedUser = getLoggedUser();
  if (!cart.length || !loggedUser) {
    return null;
  }

  const total = cart.reduce((sum, item) => sum + Number(item.preco || item.price || 0) * Number(item.quantidade || item.quantity || 1), 0);
  const order = {
    numeroPedido: generateOrderNumber(),
    usuarioEmail: loggedUser.email || '',
    itens: cart,
    total,
    data: new Date().toISOString(),
    status: 'Pagamento aprovado'
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
  setSavedOrder(order);
  return order;
}

function showMessage(message) {
  if (!alertMessageField) return;
  alertMessageField.textContent = message;
}

function initializePage() {
  const existingOrder = getSavedOrder();
  let order = existingOrder;

  if (!order) {
    order = createOrder();
    clearCart();
  }

  if (!order) {
    showMessage('Não foi possível registrar o pedido. Verifique se você está logado e se o carrinho contém itens.');
    if (orderNumberField) {
      orderNumberField.textContent = 'N/A';
    }
    return;
  }

  if (orderNumberField) {
    orderNumberField.textContent = order.numeroPedido;
  }

  if (orderInfoField) {
    orderInfoField.textContent = `Pedido confirmado em ${formatDate(order.data)}.`;
  }
}

document.addEventListener('DOMContentLoaded', initializePage);
