// --- Adicione estas duas linhas no início do seu arquivo produto-js.js ---

const form = document.getElementById('form-cadastro');
const mensagemAviso = document.getElementById('mensagem-aviso');

// --- Resto do seu código JavaScript abaixo ---

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validação dos campos obrigatórios
  const nome = form['nome'].value.trim();
  const tipoProduto = form['tipo-produto'].value;
  const tipoAnimal = form['tipo-animal'].value;
  const preco = form['preco'].value.trim();
  const codigoBarras = form['codigo-barras'].value.trim();

  if (!nome || !tipoProduto || !tipoAnimal || !preco
    || !codigoBarras)
    {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  if (isNaN(preco) || Number(preco) < 0) {
    alert('Informe um valor válido para o preço.');
    return;
  }

  const produto = {
  nome,
  tipoProduto,
  tipoAnimal,
  // Melhor enviar preco como número para o DB se a coluna for REAL/NUMERIC
  preco: Number(preco), // Remova .toFixed(2) aqui, faça na exibição se necessário
  codigoBarras,
  descricao: form['descricao'].value.trim(),
  imagem: form['imagem'].value.trim()
};

  fetch('/cadastrar-produto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto)
  })
    .then(response => response.json())
    .then(data => {
      if (data.sucesso) {
        mensagemAviso.textContent = "Produto cadastrado com sucesso, agora nossa empresa irá analisá-lo e logo o postaremos";
        mensagemAviso.classList.add('show');
        form.reset();
        setTimeout(() => mensagemAviso.classList.remove('show'), 4000);
      } else {
        alert('Erro ao cadastrar produto: ' + data.erro);
      }
    })
    .catch((error) => { // Adicione 'error' para logar o erro real
        console.error('Erro ao conectar com o servidor:', error); // Log para depuração
        alert('Erro ao conectar com o servidor. Verifique a conexão ou o console para mais detalhes.');
    });
});