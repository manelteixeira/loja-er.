// Número temporário para testes. Atualizar antes de publicar a loja.
const WHATSAPP_NUMBER = "5571993766226";

// Cadastre os produtos aqui quando recebermos fotos, nomes e preços.
const products = [];

const productGrid = document.querySelector("#product-grid");
const generalWhatsapp = document.querySelector("#general-whatsapp");

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";

  const info = document.createElement("div");
  info.className = "product-info";

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = product.price;

  const button = document.createElement("a");
  button.className = "product-button";
  button.href = createWhatsappLink(`Olá! Tenho interesse no produto: ${product.name}.`);
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.textContent = "Pedir pelo WhatsApp ↗";

  info.append(name, price, button);
  card.append(image, info);
  return card;
}

function createWhatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderProducts() {
  if (!products.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <div class="empty-icon" aria-hidden="true">✦</div>
      <h3>Em breve, novidades por aqui!</h3>
      <p>Estamos preparando nossa vitrine. Os produtos estarão disponíveis em breve.</p>
    `;
    productGrid.append(emptyState);
    return;
  }

  products.forEach((product) => {
    productGrid.append(createProductCard(product));
  });
}

generalWhatsapp.href = createWhatsappLink("Olá! Gostaria de saber mais sobre os produtos da Loja ER.");
renderProducts();
