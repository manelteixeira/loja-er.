const WHATSAPP_NUMBER = "5571985032075";

const products = [
  { name: "Panfleto Para Ser Embaixador", category: "Manuais", price: "R$ 0,60 / unidade" },
  { name: "Embaixador Escudeiro", category: "Manuais", price: "R$ 10,00" },
  { name: "Embaixador Arauto", category: "Manuais", price: "R$ 11,00" },
  { name: "Embaixador Sênior", category: "Manuais", price: "R$ 12,00" },

  { name: "Revista O Embaixador", category: "Revistas e livros", price: "R$ 14,00" },
  { name: "Revista Homem Batista", category: "Revistas e livros", price: "R$ 15,00" },
  { name: "Livro Sempre Embaixador", category: "Revistas e livros", price: "R$ 26,00" },
  { name: "Livro Vivendo o Compromisso", category: "Revistas e livros", price: "R$ 20,00" },
  { name: "Livro Vivendo o Cinco Ideais", category: "Revistas e livros", price: "R$ 22,00" },

  { name: "Bíblia ER Letra Normal - NAA", category: "Bíblias", price: "R$ 60,00" },
  { name: "Bíblia ER Letra Grande - NAA", category: "Bíblias", price: "R$ 80,00" },

  { name: "Bandeira da Bahia", category: "Bandeiras", price: "R$ 130,00" },
  { name: "Bandeira do Brasil", category: "Bandeiras", price: "R$ 130,00" },
  { name: "Bandeira Cristã Sublimada", category: "Bandeiras", price: "R$ 190,00" },
  { name: "Bandeira Cristã Bordada", category: "Bandeiras", price: "R$ 230,00" },
  { name: "Bandeira ER Sublimada", category: "Bandeiras", price: "R$ 190,00" },
  { name: "Bandeira ER Bordada", category: "Bandeiras", price: "R$ 230,00" },
  { name: "Bandeira GAM", category: "Bandeiras", price: "R$ 190,00" },
  { name: "Bandeira SHMB", category: "Bandeiras", price: "R$ 190,00" },

  { name: "Pulseira silicone ER e MR", category: "Brindes, vestuário e acessórios", price: "R$ 10,00" },
  { name: "Botton Metal Postos/Pastor", category: "Brindes, vestuário e acessórios", price: "R$ 14,00" },
  { name: "Botton Metal Envelhecido", category: "Brindes, vestuário e acessórios", price: "R$ 11,00" },
  { name: "Botton Redondo ER/MR/Postos", category: "Brindes, vestuário e acessórios", price: "R$ 5,00" },
  { name: "Imã de geladeira", category: "Brindes, vestuário e acessórios", price: "R$ 5,00" },
  { name: "Bonés ER", category: "Brindes, vestuário e acessórios", price: "R$ 35,00" },
  { name: "Camisa ER Somos Embaixadores por Cristo", category: "Brindes, vestuário e acessórios", price: "R$ 60,00" },
  { name: "Camisa ER Pólo", category: "Brindes, vestuário e acessórios", price: "R$ 90,00" },
  { name: "Camisa Conselheiro (a)", category: "Brindes, vestuário e acessórios", price: "R$ 40,00" },
  { name: "Camisa ER diversas estampas", category: "Brindes, vestuário e acessórios", price: "R$ 40,00" },
  { name: "Camisa UMHBBa Gola Careca", category: "Brindes, vestuário e acessórios", price: "R$ 35,00" },
  { name: "Camisa UMHBBa Pólo", category: "Brindes, vestuário e acessórios", price: "R$ 60,00" }
];

const productGrid = document.querySelector("#product-grid");
const categoryFilters = document.querySelector("#category-filters");
const filterStatus = document.querySelector("#filter-status");
let activeCategory = "Todos";
const generalWhatsapp = document.querySelector("#general-whatsapp");

function createWhatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const info = document.createElement("div");
  info.className = "product-info";

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent = product.category;

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = product.price;

  const stock = document.createElement("p");
  stock.className = "product-stock";
  stock.textContent = "Estoque: a confirmar";

  const button = document.createElement("a");
  button.className = "product-button";
  button.href = createWhatsappLink(`Olá! Tenho interesse no produto: ${product.name} (${product.price}). Poderia confirmar a disponibilidade?`);
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.textContent = "Consultar pelo WhatsApp ↗";

  info.append(category, name, price, stock, button);
  card.append(info);
  return card;
}

function renderCategoryFilters() {
  categoryFilters.replaceChildren();
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];

  categories.forEach((categoryName) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-filter";
    button.textContent = categoryName;
    button.setAttribute("aria-pressed", String(categoryName === activeCategory));
    if (categoryName === activeCategory) button.classList.add("is-active");

    button.addEventListener("click", () => {
      activeCategory = categoryName;
      renderCategoryFilters();
      renderProducts();
    });

    categoryFilters.append(button);
  });
}

function renderProducts() {
  productGrid.replaceChildren();
  const visibleProducts = activeCategory === "Todos"
    ? products
    : products.filter((product) => product.category === activeCategory);

  visibleProducts.forEach((product) => {
    productGrid.append(createProductCard(product));
  });

  filterStatus.textContent = activeCategory === "Todos"
    ? `${visibleProducts.length} produtos`
    : `${visibleProducts.length} produtos em ${activeCategory}`;
}

generalWhatsapp.href = createWhatsappLink("Olá! Gostaria de saber mais sobre os produtos da Loja ER do DCER Baiano.");
renderCategoryFilters();
renderProducts();
