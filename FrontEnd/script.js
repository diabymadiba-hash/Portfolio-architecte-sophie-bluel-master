/*************************************************************
 * BLOC 1 — GESTION ET AFFICHAGE DES TRAVAUX (GALERIE PRINCIPALE)
 *************************************************************/

// Stocke tous les travaux récupérés depuis l'API
let allWorks = [];

// Affiche tous les travaux dans la galerie principale
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}


/*************************************************************
 * BLOC 2 — AJOUT D’UN TRAVAIL DANS LA GALERIE PRINCIPALE
 *************************************************************/

// Ajoute un seul projet dans la galerie (après un POST)
function addWorkToGallery(work) {
  const gallery = document.querySelector(".gallery");

  const figure = document.createElement("figure");

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}


/*************************************************************
 * BLOC 3 — RÉCUPÉRATION DES CATÉGORIES
 *************************************************************/

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}


/*************************************************************
 * BLOC 4 — AFFICHAGE DES FILTRES
 *************************************************************/

// Génère les boutons de filtre
function displayFilters(categories, works) {
  const filtersContainer = document.querySelector(".filters");
  filtersContainer.innerHTML = "";

  // Bouton "Tous"
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.classList.add("active");
  allBtn.addEventListener("click", () => {
    setActiveButton(allBtn);
    displayWorks(works);
  });
  filtersContainer.appendChild(allBtn);

  // Boutons par catégorie
  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category.name;

    btn.addEventListener("click", () => {
      setActiveButton(btn);
      const filtered = works.filter(work => work.categoryId === category.id);
      displayWorks(filtered);
    });

    filtersContainer.appendChild(btn);
  });
}

// Gère l'état visuel du bouton actif
function setActiveButton(activeBtn) {
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}


/*************************************************************
 * BLOC 5 — INITIALISATION GLOBALE
 *************************************************************/

async function init() {
  const worksResponse = await fetch("http://localhost:5678/api/works");
  const works = await worksResponse.json();
  allWorks = works;

  const categories = await getCategories();

  displayFilters(categories, works);
  displayWorks(works);
}

init();


/*************************************************************
 * BLOC 6 — MODE ÉDITION (SI TOKEN PRÉSENT)
 *************************************************************/

const token = localStorage.getItem("token");

if (token) {
  document.querySelector(".edition-bar").style.display = "block";

  document.querySelectorAll(".admin-only").forEach(el => {
    el.style.display = "flex";
  });

  const filters = document.querySelector(".filters");
  if (filters) filters.style.display = "none";

  const loginLink = document.querySelector("nav ul li:nth-child(3)");
  loginLink.textContent = "logout";
  loginLink.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });
}


/*************************************************************
 * BLOC 7 — MODALE : OUVERTURE / FERMETURE
 *************************************************************/

const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");

// Ajoute un projet dans la modale
function addWorkToModal(work) {
  const modalGallery = document.querySelector(".modal-gallery");

  const div = document.createElement("div");
  div.classList.add("modal-item");

  div.innerHTML = `
    <img src="${work.imageUrl}">
    <i class="fa-solid fa-trash-can delete-icon" data-id="${work.id}"></i>
  `;

  modalGallery.appendChild(div);
}

// Fermeture via la croix
document.querySelector(".close-modal").addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

// Fermeture en cliquant en dehors
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = "none";
  }
});


/*************************************************************
 * BLOC 8 — NAVIGATION DANS LA MODALE (GALERIE <-> FORMULAIRE)
 *************************************************************/

const galleryScreen = document.querySelector(".modal-gallery-screen");
const formScreen = document.querySelector(".modal-form-screen");

// Galerie → Formulaire
document.querySelector(".add-photo-btn").addEventListener("click", () => {
  galleryScreen.style.display = "none";
  formScreen.style.display = "flex";
});

// Formulaire → Galerie
document.querySelector(".back-arrow").addEventListener("click", () => {
  formScreen.style.display = "none";
  galleryScreen.style.display = "flex";
});


/*************************************************************
 * BLOC 9 — AFFICHAGE DES TRAVAUX DANS LA MODALE
 *************************************************************/

function displayModalGallery(allworks) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  allworks.forEach(work => {
    const div = document.createElement("div");
    div.classList.add("modal-item");

    div.innerHTML = `
      <img src="${work.imageUrl}">
      <i class="fa-solid fa-trash-can delete-icon" data-id="${work.id}"></i>
    `;

    modalGallery.appendChild(div);
  });
}

// Ouverture de la modale
document.getElementById("edit-gallery").addEventListener("click", () => {
  modalOverlay.style.display = "flex";
  displayModalGallery(allWorks);
  galleryScreen.style.display = "flex";
  formScreen.style.display = "none";
});


/*************************************************************
 * BLOC 10 — AJOUT D’UN PROJET (POST API)
 *************************************************************/

const addPhotoForm = document.getElementById("add-photo-form");

addPhotoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const image = document.getElementById("photo-input").files[0];
  const title = document.getElementById("title-input").value;
  const category = document.getElementById("category-input").value;

  // Vérifie que le formulaire est complet
  if (!validateBtn.classList.contains("active")) {
    alert("Merci de remplir tous les champs.");
    return;
  }

  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData
  });

  if (response.ok) {
    const newWork = await response.json();

    addWorkToGallery(newWork);
    addWorkToModal(newWork);
    allWorks.push(newWork);

    addPhotoForm.reset();
    previewImg.src = "";
    previewContainer.style.display = "none";

    formScreen.style.display = "none";
    galleryScreen.style.display = "flex";
  } else {
    alert("Erreur lors de l'ajout.");
  }
});


/*************************************************************
 * BLOC 11 — REMPLISSAGE DU SELECT CATÉGORIES
 *************************************************************/

async function populateCategorySelect() {
  const categories = await getCategories();
  const select = document.getElementById("category-input");

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Sélectionnez une catégorie";
  emptyOption.disabled = true;
  emptyOption.selected = true;
  emptyOption.hidden = true;
  select.appendChild(emptyOption);

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

populateCategorySelect();


/*************************************************************
 * BLOC 12 — PRÉVISUALISATION DE L’IMAGE
 *************************************************************/

const photoInput = document.getElementById("photo-input");
const previewContainer = document.querySelector(".image-preview");
const previewImg = document.getElementById("preview-img");

photoInput.addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    const imgURL = URL.createObjectURL(file);
    previewImg.src = imgURL;
    previewContainer.style.display = "block";
  }
});


/*************************************************************
 * BLOC 13 — VALIDATION DYNAMIQUE DU FORMULAIRE
 *************************************************************/

const titleInput = document.getElementById("title-input");
const categoryInput = document.getElementById("category-input");
const validateBtn = document.querySelector(".validate-btn");

// Active/désactive le bouton selon les champs remplis
function checkForm() {
  const imageOK = photoInput.files.length > 0;
  const titleOK = titleInput.value.trim() !== "";
  const categoryOK = categoryInput.value !== "";

  if (imageOK && titleOK && categoryOK) {
    validateBtn.classList.add("active");
  } else {
    validateBtn.classList.remove("active");
  }
}

photoInput.addEventListener("change", checkForm);
titleInput.addEventListener("input", checkForm);
categoryInput.addEventListener("change", checkForm);


/*************************************************************
 * BLOC 14 — SUPPRESSION D’UN PROJET (DELETE API)
 *************************************************************/

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-icon")) {
    const id = e.target.dataset.id;
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      allWorks = allWorks.filter(work => work.id != id);
      displayWorks(allWorks);
      displayModalGallery(allWorks);
    } else {
      console.log("Erreur DELETE :", response.status);
    }
  }
});
