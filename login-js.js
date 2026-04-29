function validateForm() {
  var email = document.getElementById("email").value;
  var senha = document.getElementById("senha").value;

  if (email.trim() === "") {
    alert("Por favor, insira seu e-mail.");
    return false;
  }

  if (senha.trim() === "") {
    alert("Por favor, insira sua senha.");
    return false;
  }

  return true;
}

document.addEventListener('DOMContentLoaded', function () {
  var loginForm = document.getElementById('login-form');
  var welcomeModal = document.getElementById('loginSuccessModal');
  var welcomeTitle = document.getElementById('welcomeTitle');
  var welcomeMessage = document.getElementById('welcomeMessage');

  function getSavedUser() {
    var userJson = localStorage.getItem('usuarioCadastrado');
    if (!userJson) {
      return null;
    }
    try {
      return JSON.parse(userJson);
    } catch (error) {
      return null;
    }
  }

  function getRedirectTarget() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('redirect') === 'checkout') {
      return 'checkout.html';
    }

    var referrer = document.referrer || '';
    if (referrer.indexOf('checkout.html') !== -1) {
      return 'checkout.html';
    }

    return 'index.html';
  }

  function showWelcomeModal(name) {
    welcomeTitle.textContent = 'Bem-vindo, ' + name + '!';
    welcomeMessage.textContent = 'Login realizado com sucesso. Redirecionando...';
    welcomeModal.classList.remove('hidden');
  }

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    var email = document.getElementById('email').value.trim().toLowerCase();
    var senha = document.getElementById('senha').value;
    var savedUser = getSavedUser();

    if (!savedUser || savedUser.email.toLowerCase() !== email || savedUser.senha !== senha) {
      alert('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
      return;
    }

    var usuarioLogado = {
      nome: savedUser.nome,
      email: savedUser.email,
      loginAt: new Date().toISOString()
    };

    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

    showWelcomeModal(savedUser.nome);

    setTimeout(function () {
      window.location.href = getRedirectTarget();
    }, 2000);
  });
});
