// Variable globale pour stocker tous les travaux
let allWorks = [];
// 1) Affichage des travaux
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

function addWorkToGallery(work) {
  const gallery = document.querySelector(".gallery");

  // Création du <figure>
  const figure = document.createElement("figure");

  // Création de l'image
  const img = document.createElement("img");
  img.src = work.imageUrl;   // URL renvoyée par l'API
  img.alt = work.title;      // Titre du projet

  // Création du titre
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  // On assemble les éléments
  figure.appendChild(img);
  figure.appendChild(figcaption);

  // On ajoute le nouveau projet à la galerie
  gallery.appendChild(figure);
}

// 2) Récupération des catégories
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

// 3) Affichage des filtres
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

function setActiveButton(activeBtn) {
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

// 4) Init globale
async function init() {
  const worksResponse = await fetch("http://localhost:5678/api/works");
  const works = await worksResponse.json();
  allWorks = works;
  const categories = await getCategories();

  displayFilters(categories, works);
  displayWorks(works);
}

init();

// 5) Mode édition si token présent
const token = localStorage.getItem("token");

if (token) {
  // Afficher la barre noire
  document.querySelector(".edition-bar").style.display = "block";

  // Afficher tous les éléments admin
  document.querySelectorAll(".admin-only").forEach(el => {
    el.style.display = "flex"; // important pour .edit-btn
  });

  // Cacher les filtres
  const filters = document.querySelector(".filters");
  if (filters) filters.style.display = "none";

  // Transformer login → logout
  const loginLink = document.querySelector("nav ul li:nth-child(3)");
  loginLink.textContent = "logout";
  loginLink.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });
}


/*ouvrir/fermer la modale*/
const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");

// Ouvrir
document.getElementById("edit-gallery").addEventListener("click", () => {
  modalOverlay.style.display = "flex";
  displayModalGallery(allWorks);
});

//fonction ajoute un nouveau projet dans la modale*/
function addWorkToModal(work) {
  const modalGallery = document.querySelector(".modal-gallery");

  // Création du conteneur du projet
  const div = document.createElement("div");
  div.classList.add("modal-item");

  // Structure interne du projet dans la modale
  div.innerHTML = `
    <img src="${work.imageUrl}">
    <i class="fa-solid fa-trash-can delete-icon" data-id="${work.id}"></i>
  `;

  // On ajoute le projet dans la modale
  modalGallery.appendChild(div);
}
// Fermer
document.querySelector(".close-modal").addEventListener("click", () => {
  modalOverlay.style.display = "none";
});

// Fermer en cliquant en dehors
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = "none";
  }
});




/*passer galerie/formulaire*/
const galleryScreen = document.querySelector(".modal-gallery-screen");
const formScreen = document.querySelector(".modal-form-screen");

document.querySelector(".add-photo-btn").addEventListener("click", () => {
  galleryScreen.style.display = "none";
  formScreen.style.display = "flex";  // IMPORTANT
});


/*retout formulaire*/
document.querySelector(".back-arrow").addEventListener("click", () => {
  formScreen.style.display = "none";
  galleryScreen.style.display = "flex"; // IMPORTANT
});

/*Afficher les projets dans la modale*/

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




document.getElementById("edit-gallery").addEventListener("click", () => {
  modalOverlay.style.display = "flex";
  displayModalGallery(allWorks);
  galleryScreen.style.display = "flex";   // on affiche la galerie
  formScreen.style.display = "none";      // on cache le formulaire

});


/* Ajout d’un projet */
const addPhotoForm = document.getElementById("add-photo-form");

addPhotoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const image = document.getElementById("photo-input").files[0];
  const title = document.getElementById("title-input").value;
  const category = document.getElementById("category-input").value;

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
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  if (response.ok) {
  const newWork = await response.json(); // On récupère le projet créé

  addWorkToGallery(newWork);  // Ajout dans la galerie principale
  addWorkToModal(newWork);    // Ajout dans la modale

  allWorks.push(newWork);     // Mise à jour du tableau global

  addPhotoForm.reset();       // On vide le formulaire
  previewImg.src = "";
  previewContainer.style.display = "none";

  formScreen.style.display = "none";   // Retour à la galerie
  galleryScreen.style.display = "flex";
}
 else {
    alert("Erreur lors de l'ajout.");
  }
});


async function populateCategorySelect() {
  const categories = await getCategories();
  const select = document.getElementById("category-input");

  // Option vide par défaut
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
const photoInput = document.getElementById("photo-input");
const previewContainer = document.querySelector(".image-preview");
const previewImg = document.getElementById("preview-img");
const uploadZone = document.querySelector(".upload-zone");

photoInput.addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    const imgURL = URL.createObjectURL(file);

    previewImg.src = imgURL;
    previewContainer.style.display = "block"; // on affiche l'image
    // NE PAS cacher upload-zone
  }
});

const titleInput = document.getElementById("title-input");
const categoryInput = document.getElementById("category-input");
const validateBtn = document.querySelector(".validate-btn");

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

// On écoute les changements
photoInput.addEventListener("change", checkForm);
titleInput.addEventListener("input", checkForm);
categoryInput.addEventListener("change", checkForm);



/*Suppression d’un projet*/
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-icon")) {
    const id = e.target.dataset.id;
    const token = localStorage.getItem("token");

    console.log("Suppression id =", id, "avec token =", token);

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
      // Mise à jour du tableau global
      allWorks = allWorks.filter(work => work.id != id);

      // Mise à jour du DOM
      displayWorks(allWorks);
      displayModalGallery(allWorks);
    } else {
      console.log("Erreur DELETE :", response.status);
    }
  }
});
