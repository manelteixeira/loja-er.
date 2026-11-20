import { supabase } from "./supabase.js";

const WHATSAPP_NUMBER = "5571983982533";
const productGrid = document.querySelector("#product-grid");
const categoryFilters = document.querySelector("#category-filters");
const filterStatus = document.querySelector("#filter-status");
const generalWhatsapp = document.querySelector("#general-whatsapp");
let products = [];
let activeCategory = "Todos";

function createWhatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  const imageUrls = product.image_urls?.length ? product.image_urls : (product.image_url ? [product.image_url] : []);
  if (imageUrls.length) {
    const gallery = document.createElement("div");
    gallery.className = "product-gallery";
    const image = document.createElement("img");
    image.className = "product-image";
    image.src = imageUrls[0];
    image.alt = product.name;
    image.loading = "lazy";
    gallery.append(image);

    if (imageUrls.length > 1) {
      const thumbnails = document.createElement("div");
      thumbnails.className = "product-thumbnails";
      imageUrls.forEach((url, index) => {
        const thumbnail = document.createElement("button");
        thumbnail.type = "button";
        thumbnail.className = "product-thumbnail";
        thumbnail.setAttribute("aria-label", `Ver foto ${index + 1} de ${imageUrls.length}`);
        thumbnail.setAttribute("aria-pressed", String(index === 0));
        const thumbnailImage = document.createElement("img");
        thumbnailImage.src = url;
        thumbnailImage.alt = "";
        thumbnail.append(thumbnailImage);
        thumbnail.addEventListener("click", () => {
          image.src = url;
          thumbnails.querySelectorAll(".product-thumbnail").forEach((button, buttonIndex) => {
            button.classList.toggle("is-active", buttonIndex === index);
            button.setAttribute("aria-pressed", String(buttonIndex === index));
          });
        });
        if (index === 0) thumbnail.classList.add("is-active");
        thumbnails.append(thumbnail);
      });
      gallery.append(thumbnails);
    }
    card.append(gallery);
  }
  const info = document.createElement("div");
  info.className = "product-info";
  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent = product.category;
  const name = document.createElement("h3");
  name.textContent = product.name;
  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description || "";
  description.hidden = !product.description;
  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = product.price;
  const stock = document.createElement("p");
  stock.className = "product-stock";
  const quantity = Number(product.stock ?? 0);
  stock.textContent = quantity === 0
    ? "Esgotado"
    : `${quantity} ${quantity === 1 ? "unidade disponível" : "unidades disponíveis"}`;
  const button = document.createElement("a");
  button.className = "product-button";
  button.href = createWhatsappLink(`Olá! Tenho interesse no produto: ${product.name} (${product.price}). Poderia confirmar a disponibilidade?`);
  button.target = "_self";
  button.textContent = "Consultar pelo WhatsApp ↗";
  info.append(category, name);
  if (product.description) info.append(description);
  info.append(price, stock, button);
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
  const visible = products.filter((product) =>
    product.available && (activeCategory === "Todos" || product.category === activeCategory)
  );
  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "empty-products";
    empty.textContent = "Nenhum produto encontrado nesta categoria.";
    productGrid.append(empty);
  } else {
    visible.forEach((product) => productGrid.append(createProductCard(product)));
  }
  filterStatus.textContent = `${visible.length} produtos`;
}

async function initCatalog() {
  generalWhatsapp.href = createWhatsappLink("Olá! Gostaria de saber mais sobre os produtos da Casa do Embaixador do DCER Baiano.");
  const { data, error } = await supabase.from("products").select("id,name,category,price,description,image_url,image_urls,available,stock,sort_order").eq("available", true).order("sort_order").order("name");
  if (error) {
    filterStatus.textContent = "Não foi possível carregar os produtos. Tente novamente mais tarde.";
    return;
  }
  products = data || [];
  renderCategoryFilters();
  renderProducts();
}

initCatalog();
