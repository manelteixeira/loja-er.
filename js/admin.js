import { supabase } from "./supabase.js";

const ADMIN_EMAIL = "dcerbaiano@gmail.com";
const form = document.querySelector("#product-form");
const list = document.querySelector("#admin-products");
const categoryFilters = document.querySelector("#admin-category-filters");
const filterStatus = document.querySelector("#admin-filter-status");
const loginForm = document.querySelector("#login-form");
const loginPanel = document.querySelector("#login-panel");
const dashboard = document.querySelector("#dashboard");
const loginMessage = document.querySelector("#login-message");
const adminMessage = document.querySelector("#admin-message");
const imageInput = document.querySelector("#product-image");
const imagePreview = document.querySelector("#image-preview");
const saveButton = document.querySelector("#save-product");
let editingId = null;
let currentImageUrl = null;
let allProducts = [];
let activeCategory = "Todas";

function message(target, text, error = false) {
  target.textContent = text;
  target.classList.toggle("is-error", error);
  target.classList.toggle("is-success", !error && Boolean(text));
}

function showDashboard(user) {
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    loginPanel.hidden = false;
    dashboard.hidden = true;
    message(loginMessage, "Este acesso é exclusivo do administrador autorizado.", true);
    return;
  }
  loginPanel.hidden = true;
  dashboard.hidden = false;
  document.querySelector("#admin-email").textContent = user.email;
  loadProducts();
}

async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) showDashboard(session.user);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  message(loginMessage, "Entrando...");
  const email = document.querySelector("#login-email").value.trim();
  const password = document.querySelector("#login-password").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    message(loginMessage, "Não foi possível entrar. Confira o e-mail e a senha.", true);
    return;
  }
  if (data.user.email?.toLowerCase() !== ADMIN_EMAIL) {
    await supabase.auth.signOut();
    message(loginMessage, "Este e-mail não tem permissão de administrador.", true);
    return;
  }
  message(loginMessage, "");
  showDashboard(data.user);
});

document.querySelector("#logout-button").addEventListener("click", async () => {
  await supabase.auth.signOut();
  dashboard.hidden = true;
  loginPanel.hidden = false;
  form.reset();
  resetEditor();
});

function resetEditor() {
  editingId = null;
  currentImageUrl = null;
  form.reset();
  imagePreview.hidden = true;
  imagePreview.removeAttribute("src");
  document.querySelector("#editor-title").textContent = "Cadastrar produto";
  document.querySelector("#save-product").textContent = "Salvar produto";
}

document.querySelector("#cancel-edit").addEventListener("click", resetEditor);

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    message(adminMessage, "Escolha um arquivo de imagem.", true);
    imageInput.value = "";
    return;
  }
  imagePreview.src = URL.createObjectURL(file);
  imagePreview.hidden = false;
});

async function uploadImage(file) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

async function loadProducts() {
  list.replaceChildren();
  categoryFilters.replaceChildren();
  const { data, error } = await supabase.from("products").select("*").order("sort_order").order("name");
  if (error) {
    message(adminMessage, "Erro ao carregar os produtos. Atualize a página.", true);
    return;
  }
  allProducts = data || [];
  categoryFilters.replaceChildren();
  const categories = ["Todas", ...new Set(allProducts.map((product) => product.category).filter(Boolean).sort((a, b) => a.localeCompare(b, "pt-BR")))];
  if (!categories.includes(activeCategory)) activeCategory = "Todas";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-filter";
    button.textContent = category;
    button.classList.toggle("is-active", category === activeCategory);
    button.setAttribute("aria-pressed", String(category === activeCategory));
    button.addEventListener("click", () => {
      activeCategory = category;
      renderProducts();
    });
    categoryFilters.append(button);
  });
  renderProducts();
}

function renderProducts() {
  list.replaceChildren();
  const filteredProducts = activeCategory === "Todas"
    ? allProducts
    : allProducts.filter((product) => product.category === activeCategory);

  filterStatus.textContent = activeCategory === "Todas"
    ? `Exibindo ${filteredProducts.length} produto(s).`
    : `Exibindo ${filteredProducts.length} de ${allProducts.length} produto(s) em "${activeCategory}".`;

  if (!filteredProducts.length) {
    list.textContent = "Nenhum produto encontrado nesta categoria.";
    return;
  }

  filteredProducts.forEach((product) => {
    const item = document.createElement("article");
    item.className = "admin-product";
    if (product.image_url) {
      const image = document.createElement("img");
      image.src = product.image_url;
      image.alt = "";
      item.append(image);
    }
    const details = document.createElement("div");
    details.className = "admin-product-details";
    const name = document.createElement("strong");
    name.textContent = product.name;
    const meta = document.createElement("span");
    meta.textContent = `${product.category} · ${product.price} · ${product.available ? "Disponível" : "Oculto"}`;
    details.append(name, meta);
    const actions = document.createElement("div");
    actions.className = "admin-product-actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "admin-small-button";
    edit.textContent = "Editar";
    edit.addEventListener("click", () => editProduct(product));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "admin-small-button danger";
    remove.textContent = "Excluir";
    remove.addEventListener("click", () => deleteProduct(product));
    actions.append(edit, remove);
    item.append(details, actions);
    list.append(item);
  });
}
function editProduct(product) {
  editingId = product.id;
  currentImageUrl = product.image_url;
  document.querySelector("#product-name").value = product.name;
  document.querySelector("#product-category").value = product.category;
  document.querySelector("#product-price").value = product.price;
  document.querySelector("#product-description").value = product.description || "";
  document.querySelector("#product-available").checked = product.available;
  imageInput.value = "";
  if (currentImageUrl) {
    imagePreview.src = currentImageUrl;
    imagePreview.hidden = false;
  } else {
    imagePreview.hidden = true;
  }
  document.querySelector("#editor-title").textContent = "Editar produto";
  document.querySelector("#save-product").textContent = "Salvar alterações";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const willBeHidden = !document.querySelector("#product-available").checked;
  if (willBeHidden && !window.confirm("Este produto ficará oculto na vitrine. Deseja continuar?")) {
    return;
  }

  const save = document.querySelector("#save-product");
  save.disabled = true;
  message(adminMessage, "Salvando produto...");
  try {
    const file = imageInput.files?.[0];
    const imageUrl = file ? await uploadImage(file) : currentImageUrl;
    const payload = {
      name: document.querySelector("#product-name").value.trim(),
      category: document.querySelector("#product-category").value.trim(),
      price: document.querySelector("#product-price").value.trim(),
      description: document.querySelector("#product-description").value.trim() || null,
      image_url: imageUrl,
      available: document.querySelector("#product-available").checked
    };
    const result = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId)
      : await supabase.from("products").insert(payload);
    if (result.error) throw result.error;
    message(adminMessage, "Produto salvo com sucesso.");
    resetEditor();
    await loadProducts();
  } catch (error) {
    message(adminMessage, error.message || "Não foi possível salvar o produto.", true);
  } finally {
    save.disabled = false;
  }
});

async function deleteProduct(product) {
  if (!window.confirm(`Deseja excluir "${product.name}"?`)) return;
  const { error } = await supabase.from("products").delete().eq("id", product.id);
  if (error) {
    message(adminMessage, "Não foi possível excluir o produto.", true);
    return;
  }
  message(adminMessage, "Produto excluído.");
  if (editingId === product.id) resetEditor();
  loadProducts();
}

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) showDashboard(session.user);
  else {
    loginPanel.hidden = false;
    dashboard.hidden = true;
  }
});

checkSession();
