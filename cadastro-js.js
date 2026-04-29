document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cadastro');
  const modal = document.getElementById('signupSuccessModal');
  const goToLoginBtn = document.getElementById('goToLoginBtn');

  function showModal() {
    modal.classList.remove('hidden');
  }

  function hideModal() {
    modal.classList.add('hidden');
  }

  function redirectToLogin() {
    window.location.href = 'login.html';
  }

  if (!form) {
    return;
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmar').value;
    const endereco = document.getElementById('endereco').value.trim();
    const complemento = document.getElementById('complemento').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cep = document.getElementById('cep').value.trim();

    if (!nome || !sobrenome || !cpf || !email || !senha || !confirmar || !endereco || !bairro || !cep) {
      alert('Preencha todos os campos obrigatórios antes de continuar.');
      return;
    }

    if (senha !== confirmar) {
      alert('As senhas não coincidem!');
      return;
    }

    const usuarioCadastrado = {
      nome,
      sobrenome,
      cpf,
      email,
      senha,
      endereco,
      complemento,
      bairro,
      cep,
      dataCadastro: new Date().toISOString()
    };

    localStorage.setItem('usuarioCadastrado', JSON.stringify(usuarioCadastrado));

    showModal();
    setTimeout(redirectToLogin, 3000);
  });

  if (goToLoginBtn) {
    goToLoginBtn.addEventListener('click', redirectToLogin);
  }
});
