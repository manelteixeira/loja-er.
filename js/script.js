// Número temporário para testes. Confirmar com o responsável antes da publicação.
const WHATSAPP_NUMBER = "557193766226";

// Produtos confirmados até agora. As imagens são provisórias até adicionarmos as fotos originais.
const products = [
  {
    name: "Botons — Insígnias de postos",
    price: "R$ 5,00 cada",
    image: "assets/img/boton-placeholder.svg"
  },
  {
    name: "Pulseira personalizada",
    price: "R$ 15,00",
    image: "assets/img/pulseira-placeholder.svg"
  }
];

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
  button.href = createWhatsappLink(`Olá! Tenho interesse em ${product.name}.`);
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
  products.forEach((product) => {
    productGrid.append(createProductCard(product));
  });
}

generalWhatsapp.href = createWhatsappLink("Olá! Gostaria de saber mais sobre os produtos da Loja ER.");
renderProducts();
