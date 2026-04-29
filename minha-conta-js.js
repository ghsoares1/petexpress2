const savedUserKey = 'usuarioCadastrado';
const loggedUserKey = 'usuarioLogado';

const accountForm = document.getElementById('accountForm');
const logoutBtn = document.getElementById('logoutBtn');
const accountFeedback = document.getElementById('accountFeedback');

function getSavedUser() {
  try {
    const raw = localStorage.getItem(savedUserKey);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function getLoggedUser() {
  try {
    const raw = localStorage.getItem(loggedUserKey);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function redirectToLogin() {
  window.location.href = 'login.html';
}

function populateAccountDetails() {
  const savedUser = getSavedUser();
  if (!savedUser) return;

  document.getElementById('nome').value = savedUser.nome || '';
  document.getElementById('sobrenome').value = savedUser.sobrenome || '';
  document.getElementById('email').value = savedUser.email || '';
  document.getElementById('cpf').value = savedUser.cpf || '';
  document.getElementById('endereco').value = savedUser.endereco || '';
  document.getElementById('complemento').value = savedUser.complemento || '';
  document.getElementById('bairro').value = savedUser.bairro || '';
  document.getElementById('cep').value = savedUser.cep || '';
}

function saveUserData(event) {
  event.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const sobrenome = document.getElementById('sobrenome').value.trim();
  const email = document.getElementById('email').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const complemento = document.getElementById('complemento').value.trim();
  const bairro = document.getElementById('bairro').value.trim();
  const cep = document.getElementById('cep').value.trim();

  if (!nome || !sobrenome || !email || !cpf || !endereco || !bairro || !cep) {
    accountFeedback.textContent = 'Preencha todos os campos obrigatórios antes de salvar.';
    accountFeedback.style.color = '#d12f24';
    return;
  }

  const savedUser = getSavedUser() || {};
  const updatedUser = {
    ...savedUser,
    nome,
    sobrenome,
    email,
    cpf,
    endereco,
    complemento,
    bairro,
    cep
  };

  localStorage.setItem(savedUserKey, JSON.stringify(updatedUser));

  const loggedUser = getLoggedUser();
  if (loggedUser) {
    const updatedLogged = {
      ...loggedUser,
      nome,
      email
    };
    localStorage.setItem(loggedUserKey, JSON.stringify(updatedLogged));
  }

  accountFeedback.textContent = 'Dados salvos com sucesso.';
  accountFeedback.style.color = '#1f7a33';
}

function logout() {
  localStorage.removeItem(loggedUserKey);
  window.location.href = 'index.html';
}

function initializePage() {
  const loggedUser = getLoggedUser();
  if (!loggedUser) {
    redirectToLogin();
    return;
  }

  populateAccountDetails();
}

accountForm.addEventListener('submit', saveUserData);
logoutBtn.addEventListener('click', logout);

initializePage();
