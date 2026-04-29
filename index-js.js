const carrossel = document.getElementById("carrossel");
const inputBusca = document.getElementById("busca");
const sugestoes = document.getElementById("sugestoes-busca");
const formBusca = document.getElementById("form-busca");

let produtos = [];

function obterPaginaPorTipo(tipoAnimal) {
  const tipo = String(tipoAnimal || "").toLowerCase();

  if (tipo.includes("gato")) return "gatos.html";
  if (tipo.includes("cachorro") || tipo.includes("cao") || tipo.includes("cão")) return "caes.html";

  return "produto.html";
}

function formatarPreco(valor) {
  return `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;
}

function renderizarProdutos(lista) {
  carrossel.innerHTML = "";

  if (lista.length === 0) {
    carrossel.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  lista.forEach((produto) => {
    const card = document.createElement("div");
    card.className = "card";

    card.onclick = () => {
      window.location.href = obterPaginaPorTipo(produto.tipoAnimal);
    };

    card.innerHTML = `
      <img src="${produto.imagem || "img/c1.jpg"}" alt="${produto.nome}">
      <div class="info">
        <h3>${produto.nome}</h3>
        <p class="price">${formatarPreco(produto.preco)}</p>
        <span class="badge">
  ${produto.tipoAnimal.charAt(0).toUpperCase() + produto.tipoAnimal.slice(1).toLowerCase()}
</span>
      </div>
    `;

    carrossel.appendChild(card);
  });
}

async function carregarProdutos() {
  try {
    const resposta = await fetch("http://localhost:8082/produtos");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar produtos.");
    }

    produtos = await resposta.json();
    renderizarProdutos(produtos);
  } catch (erro) {
    console.error("Erro:", erro);
    carrossel.innerHTML = "<p>Não foi possível carregar os produtos.</p>";
  }
}

inputBusca.addEventListener("input", function () {
  const termo = this.value.trim().toLowerCase();
  sugestoes.innerHTML = "";

  if (!termo) {
    sugestoes.style.display = "none";
    return;
  }

  const resultados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(termo)
  );

  if (resultados.length === 0) {
    sugestoes.style.display = "none";
    return;
  }

  resultados.forEach((produto) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <img src="${produto.imagem || "img/c1.jpg"}" alt="${produto.nome}">
      <div class="info">
        <span class="nome">${produto.nome}</span>
        <span class="preco">${formatarPreco(produto.preco)}</span>
      </div>
    `;

    li.addEventListener("click", () => {
      window.location.href = obterPaginaPorTipo(produto.tipoAnimal);
    });

    sugestoes.appendChild(li);
  });

  sugestoes.style.display = "block";
});

formBusca.addEventListener("submit", function (e) {
  e.preventDefault();

  const termo = inputBusca.value.trim().toLowerCase();

  const resultado = produtos.find((produto) =>
    produto.nome.toLowerCase().includes(termo)
  );

  if (resultado) {
    window.location.href = obterPaginaPorTipo(resultado.tipoAnimal);
  }
});

document.addEventListener("click", function (e) {
  if (!e.target.closest("#box-busca-container")) {
    sugestoes.style.display = "none";
  }
});

function updateAccountLink() {
  const accountLink = document.getElementById('accountLink');
  const logged = localStorage.getItem('usuarioLogado');
  if (accountLink) {
    accountLink.href = logged ? 'minha-conta.html' : 'login.html';
  }
}

updateAccountLink();
carregarProdutos();