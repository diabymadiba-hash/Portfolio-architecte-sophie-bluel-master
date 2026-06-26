/*************************************************************
 * BLOC 1 — GESTION ET AFFICHAGE DES TRAVAUX (GALERIE PRINCIPALE)
 * Ce bloc gère l'affichage des projets sur la page d'accueil.
 *************************************************************/

// Variable globale pour stocker tous les travaux récupérés depuis l'API
let allWorks = [];

// Fonction qui affiche tous les travaux dans la galerie principale
function displayWorks(works) {
  const gallery = document.querySelector(".gallery"); // On récupère la galerie
  gallery.innerHTML = ""; // On la vide avant de la remplir

  works.forEach(work => { // On parcourt chaque projet
    const figure = document.createElement("figure"); // On crée un conteneur <figure>

    const img = document.createElement("img"); // On crée une image
    img.src = work.imageUrl; // On met l'URL de l'image
    img.alt = work.title; // On met le titre comme texte alternatif

    const figcaption = document.createElement("figcaption"); // On crée le titre
    figcaption.textContent = work.title; // On met le texte du titre

    figure.appendChild(img); // On ajoute l'image dans la figure
    figure.appendChild(figcaption); // On ajoute le titre dans la figure

    gallery.appendChild(figure); // On ajoute la figure dans la galerie
  });
}


/*************************************************************
 * BLOC 2 — AJOUT D’UN TRAVAIL DANS LA GALERIE PRINCIPALE
 * Utilisé après un POST pour ajouter un projet sans recharger la page.
 *************************************************************/

function addWorkToGallery(work) {/* Cette fonction est utilisée après un POST. */
  const gallery = document.querySelector(".gallery"); // On récupère la galerie

  const figure = document.createElement("figure"); // On crée un conteneur

  const img = document.createElement("img"); // On crée l'image
  img.src = work.imageUrl; // URL renvoyée par l'API
  img.alt = work.title; // Texte alternatif

  const figcaption = document.createElement("figcaption"); // On crée le titre
  figcaption.textContent = work.title;

  figure.appendChild(img); // On assemble img et titre dans la figure
  figure.appendChild(figcaption);

  gallery.appendChild(figure); // On ajoute dans la galerie
}


/*************************************************************
 * BLOC 3 — RÉCUPÉRATION DES CATÉGORIES
 * Appelle l'API pour obtenir la liste des catégories.
 *************************************************************/

async function getCategories() {
  const response = await fetch("https://portfolio-architecte-sophie-bluel-master-4am1.onrender.com/api/categories"); // Appel API
  return await response.json(); // Retourne les catégories
}


/*************************************************************
 * BLOC 4 — AFFICHAGE DES FILTRES DE CATÉGORIES
 * Génère les boutons de filtre dynamiquement.
 *************************************************************/

function displayFilters(categories, works) {/*  fonction affiche les boutons de filtre en fonction des catégories  */
  const filtersContainer = document.querySelector(".filters"); /* On récupère le conteneur des filtres dans le DOM */
  filtersContainer.innerHTML = ""; /* On vide le conteneur avant de le remplir pour éviter les doublons  */

  // Bouton "Tous"
  const allBtn = document.createElement("button");/* Création du bouton "Tous" qui permet d'afficher tous les projets sans filtrage. */
  allBtn.textContent = "Tous";/*/ Texte du bouton*/
  allBtn.classList.add("active"); // Par défaut actif
  allBtn.addEventListener("click", () => {/* Au clic sur le bouton "Tous", on affiche tous les projets sans filtrage. */
    setActiveButton(allBtn); // On active ce bouton
    displayWorks(works); // On affiche tous les travaux
  });
  filtersContainer.appendChild(allBtn);/* On ajoute le bouton "Tous" en premier */

  // Boutons par catégorie
  categories.forEach(category => {/* On parcourt les catégories pour créer un bouton pour chacune */
    const btn = document.createElement("button");/* Création du bouton */
    btn.textContent = category.name; // Nom de la catégorie

    btn.addEventListener("click", () => {/* Au clic sur un bouton de catégorie */
      setActiveButton(btn); // Actbouton cliqué
      const filtered = works.filter(work => work.categoryId === category.id); // Filtre
      displayWorks(filtered); // Affiche les travaux filtrés
    });

    filtersContainer.appendChild(btn);/* On ajoute le bouton dans le conteneur */
  });
}

// Fonction qui gère l'état visuel du bouton actif
function setActiveButton(activeBtn) {/* On reçoit le bouton à activer */
  const buttons = document.querySelectorAll(".filters button"); // Tous les boutons
  buttons.forEach(btn => btn.classList.remove("active")); // On retire l'état actif
  activeBtn.classList.add("active"); // On active celui cliqué
}


/*************************************************************
 * BLOC 5 — INITIALISATION GLOBALE
 * Charge les travaux + catégories au démarrage.
 *************************************************************/

async function init() {/* Fonction d'initialisation appelée au chargement de la page */
  const worksResponse = await fetch("https://portfolio-architecte-sophie-bluel-master-4am1.onrender.com/api/works"); // Appel API
  const works = await worksResponse.json(); // Liste des travaux
  allWorks = works; // On stocke globalement

  const categories = await getCategories(); // On récupère les catégories

  displayFilters(categories, works); // On affiche les filtres
  displayWorks(works); // On affiche les travaux
}

init(); // On lance l'initialisation


/*************************************************************
 * BLOC 6 — MODE ÉDITION (SI TOKEN PRÉSENT)
 * Active les fonctionnalités admin si l'utilisateur est connecté.
 *************************************************************/

const token = localStorage.getItem("token"); // On récupère le token

if (token) {/* Si un token est présent, on considère que l'utilisateur est connecté en tant qu'admin */
  document.querySelector(".edition-bar").style.display = "block"; // Barre noire visible

  document.querySelectorAll(".admin-only").forEach(el => {/* On affiche tous les éléments réservés à l'admin */
    el.style.display = "flex"; // Affiche les boutons admin
  });

  const filters = document.querySelector(".filters");/* On récupère les filtres */
  if (filters) filters.style.display = "none"; // Cache les filtres

  const loginLink = document.querySelector("nav ul li:nth-child(3)");/* On récupère le lien de connexion/déconnexion dans la nav */
  loginLink.textContent = "logout"; // Change le texte
  loginLink.addEventListener("click", () => {
    localStorage.removeItem("token"); // Déconnexion
    window.location.reload(); // Recharge la page
  });
}


/*************************************************************
 * BLOC 7 — MODALE : OUVERTURE / FERMETURE
 *************************************************************/

const modalOverlay = document.querySelector(".modal-overlay"); // Fond noir
const modal = document.querySelector(".modal"); // Fenêtre modale

// Fonction qui ajoute un projet dans la modale
function addWorkToModal(work) {/* Cette fonction est utilisée après un POST pour ajouter le projet dans la modale sans recharger. */
  const modalGallery = document.querySelector(".modal-gallery");/* On récupère la galerie de la modale */

  const div = document.createElement("div"); // Conteneur du projet
  div.classList.add("modal-item");/* Classe pour le style de la modale */

  // Structure interne
  div.innerHTML = `
    <img src="${work.imageUrl}">
    <i class="fa-solid fa-trash-can delete-icon" data-id="${work.id}"></i>
  `;/* On affiche l'image et une icône de suppression avec l'ID du projet en data-id pour pouvoir le supprimer ensuite. */

  modalGallery.appendChild(div); // Ajout dans la modale
}

// Fermeture via la croix
document.querySelector(".close-modal").addEventListener("click", () => {/* Au clic sur la croix de fermeture */
  modalOverlay.style.display = "none";/* On cache la modale en mettant le display à none */
});

// Fermeture en cliquant en dehors
modalOverlay.addEventListener("click", (e) => {/* Au clic sur le fond de la modale (en dehors de la fenêtre) */
  if (e.target === modalOverlay) {/* Si la cible du clic est bien le fond (et pas la fenêtre elle-même) */
    modalOverlay.style.display = "none";/* On cache la modale */
  }
});


/*************************************************************
 * BLOC 8 — NAVIGATION DANS LA MODALE (GALERIE <-> FORMULAIRE)
 *************************************************************/

const galleryScreen = document.querySelector(".modal-gallery-screen"); // Vue galerie
const formScreen = document.querySelector(".modal-form-screen"); // Vue formulaire

// Passage galerie → formulaire
document.querySelector(".add-photo-btn").addEventListener("click", () => {/* Au clic sur le bouton "Ajouter une photo" dans la modale */
  galleryScreen.style.display = "none";/* On cache la vue galerie */
  formScreen.style.display = "flex";/* On affiche la vue formulaire */
});

// Retour formulaire → galerie
document.querySelector(".back-arrow").addEventListener("click", () => {/* Au clic sur la flèche de retour dans le formulaire */
  formScreen.style.display = "none";/* On cache la vue formulaire */
  galleryScreen.style.display = "flex";/* On affiche la vue galerie */
});


/*************************************************************
 * BLOC 9 — AFFICHAGE DES TRAVAUX DANS LA MODALE
 *************************************************************/

function displayModalGallery(allworks) {/* Cette fonction affiche tous les projets dans la galerie de la modale. Elle est appelée à l'ouverture de la modale pour afficher les projets, et aussi après une suppression pour mettre à jour la vue. */
  const modalGallery = document.querySelector(".modal-gallery");/* On récupère la galerie de la modale */
  modalGallery.innerHTML = ""; // On vide avant de remplir

  allworks.forEach(work => {/* On parcourt tous les projets pour les afficher dans la modale */
    const div = document.createElement("div");/* Conteneur du projet dans la modale */
    div.classList.add("modal-item");/* Classe pour le style de la modale */

    div.innerHTML = `
      <img src="${work.imageUrl}">
      <i class="fa-solid fa-trash-can delete-icon" data-id="${work.id}"></i>
    `;/* On affiche l'image et une icône de suppression avec l'ID du projet en data-id pour pouvoir le supprimer ensuite. */

    modalGallery.appendChild(div);/* On ajoute le projet dans la galerie de la modale */
  });
}

// Ouverture de la modale
document.getElementById("edit-gallery").addEventListener("click", () => {/* Au clic sur le bouton "Modifier" dans la barre d'édition */
  modalOverlay.style.display = "flex"; // Affiche la modale
  displayModalGallery(allWorks); // Affiche les projets
  galleryScreen.style.display = "flex"; // Vue galerie
  formScreen.style.display = "none"; // Cache le formulaire
});


/*************************************************************
 * BLOC 10 — AJOUT D’UN PROJET (FORMULAIRE + POST API)
 *************************************************************/

const addPhotoForm = document.getElementById("add-photo-form"); // Formulaire

addPhotoForm.addEventListener("submit", async (e) => {/* Au submit du formulaire d'ajout de projet */
  e.preventDefault(); // Empêche le rechargement

  const token = localStorage.getItem("token"); // Récupère le token pour l'authentification

  // Récupère les données du formulaire
  const image = document.getElementById("photo-input").files[0]; /* On récupère le fichier image sélectionné par l'utilisateur dans l'input de type "file". */
  const title = document.getElementById("title-input").value; // Titre
  const category = document.getElementById("category-input").value; // Catégorie

  // Vérifie que le bouton est actif
  if (!validateBtn.classList.contains("active")) {/* Si le bouton n'est pas actif, cela signifie que tous les champs ne sont pas remplis correctement. */
    alert("Merci de remplir tous les champs.");/* On affiche une alerte pour informer l'utilisateur que tous les champs doivent être remplis. */
    return;
  }/* Si le bouton est actif, on continue avec l'envoi de la requête pour ajouter le projet. */

  // Préparation des données
  const formData = new FormData();/* On utilise FormData pour envoyer les données du formulaire */
  formData.append("image", image);/* On ajoute le fichier image au FormData avec la clé "image" */
  formData.append("title", title);/* On ajoute le titre au FormData avec la clé "title". */
  formData.append("category", category);/* On ajoute la catégorie au FormData avec la clé "category*/

  // Envoi API
  const response = await fetch("https://portfolio-architecte-sophie-bluel-master-4am1.onrender.com/api/works", {/* On envoie une requête POST à l'endpoint de création de projet de l'API. */
    method: "POST",/* La méthode est POST car on crée une nouvelle ressource. */
    headers: {/* On ajoute l'en-tête d'autorisation avec le token pour prouver que l'utilisateur est authentifié. */
      "Authorization": `Bearer ${token}`/* L'API attend un token d'authentification dans l'en-tête Authorization sous la forme "Bearer [token]". */
    },
    body: formData/* Le corps de la requête est le FormData que nous avons préparé, contenant l'image, le titre et la catégorie. */
  });

  if (response.ok) {/* Si la réponse de l'API indique que la création du projet a réussi */
    const newWork = await response.json(); // Projet créé

    addWorkToGallery(newWork); // Ajout dans la galerie
    addWorkToModal(newWork); // Ajout dans la modale

    allWorks.push(newWork); // Mise à jour globale

    addPhotoForm.reset(); // Reset du formulaire
    previewImg.src = "";
    previewContainer.style.display = "none";

    formScreen.style.display = "none"; // Retour galerie
    galleryScreen.style.display = "flex";
  }
  else {
    alert("Erreur lors de l'ajout.");/* Si la réponse de l'API indique une erreur, on affiche une alerte pour informer l'utilisateur que l'ajout du projet a échoué. */
  }
});


/*************************************************************
 * BLOC 11 — REMPLISSAGE DU SELECT CATÉGORIES
 *************************************************************/

// Remplit le menu déroulant des catégories dans le formulaire d'ajout.
// Cette fonction est appelée au chargement de la page pour garantir que
// toutes les catégories disponibles dans l'API sont bien proposées à l'utilisateur.
async function populateCategorySelect() {

  const categories = await getCategories(); // Récupère les catégories depuis l'API
  const select = document.getElementById("category-input"); // Cible le <select> du formulaire

  // Création d'une option vide affichée par défaut.
  // Elle sert de message d'introduction pour guider l'utilisateur
  // et l'obliger à choisir une vraie catégorie.
  const emptyOption = document.createElement("option");
  emptyOption.value = "";                       // Valeur vide = aucune catégorie
  emptyOption.textContent = "Sélectionnez une catégorie"; // Message affiché
  emptyOption.disabled = true;                  // Empêche de la sélectionner
  emptyOption.selected = true;                  // Affichée par défaut
  emptyOption.hidden = true;                    // Cachée dans la liste déroulante
  select.appendChild(emptyOption);

  // Ajoute chaque catégorie récupérée depuis l'API dans le menu déroulant.
  // Cela permet à l'utilisateur de choisir une catégorie valide pour son projet.
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;                 // ID envoyé à l'API lors du POST
    option.textContent = category.name;         // Nom lisible pour l'utilisateur
    select.appendChild(option);
  });
}


populateCategorySelect(); // On remplit le select


/*************************************************************
 * BLOC 12 — PRÉVISUALISATION DE L’IMAGE AVANT AJOUT
 *************************************************************/

const photoInput = document.getElementById("photo-input"); // Input fichier
const previewContainer = document.querySelector(".image-preview"); // Conteneur
const previewImg = document.getElementById("preview-img"); // Image preview
const uploadZone = document.querySelector(".upload-zone"); // Zone upload

photoInput.addEventListener("change", function () {/* Au changement de l'input fichier, c'est-à-dire lorsque l'utilisateur sélectionne une image, cette fonction est déclenchée pour afficher une prévisualisation de l'image avant de soumettre le formulaire. */
  const file = this.files[0]; // On récupère le fichier

  if (file) {
    const imgURL = URL.createObjectURL(file); // URL temporaire

    previewImg.src = imgURL; // On affiche l'image
    previewContainer.style.display = "block"; // On montre la preview
  }
});


/*************************************************************
 * BLOC 13 — VALIDATION DYNAMIQUE DU FORMULAIRE
 *************************************************************/

const titleInput = document.getElementById("title-input");/* On récupère l'input du titre pour pouvoir vérifier son contenu et activer/désactiver le bouton de validation en fonction de la complétude du formulaire. */
const categoryInput = document.getElementById("category-input");
const validateBtn = document.querySelector(".validate-btn");/* On récupère le bouton de validation pour pouvoir lui ajouter ou retirer la classe "active" qui indique si le formulaire est prêt à être soumis. */

// Vérifie si tous les champs sont remplis
function checkForm() {
  const imageOK = photoInput.files.length > 0;
  const titleOK = titleInput.value.trim() !== "";
  const categoryOK = categoryInput.value !== "";

  if (imageOK && titleOK && categoryOK) {
    validateBtn.classList.add("active"); // Active le bouton
  } else {
    validateBtn.classList.remove("active"); // Désactive
  }
}

// On écoute les changements
photoInput.addEventListener("change", checkForm);/*On ajoute un écouteur d'événement*/
titleInput.addEventListener("input", checkForm);
categoryInput.addEventListener("change", checkForm);


/*************************************************************
 * BLOC 14 — SUPPRESSION D’UN PROJET (DELETE API)
 *************************************************************/

document.addEventListener("click", async (e) => {/* On écoute les clics sur tout le document pour détecter les clics sur les icônes de suppression. */
  if (e.target.classList.contains("delete-icon")) { // Si clic sur poubelle
    const id = e.target.dataset.id; // ID du projet à supprimer
    const token = localStorage.getItem("token"); // Token pour l'authentification

    console.log("Suppression id =", id, "avec token =", token);  // Log utile pour vérifier l'ID et le token

    // Requête DELETE
    const response = await fetch(`https://portfolio-architecte-sophie-bluel-master-4am1.onrender.com/api/works/${id}`, {/* On envoie une requête DELETE à l'endpoint de suppression de projet de l'API, en incluant l'ID du projet dans l'URL. */
      method: "DELETE",/* La méthode est DELETE car on veut supprimer une ressource existante. */
      headers: { "Authorization": `Bearer ${token}` }/* On ajoute l'en-tête d'autorisation avec le token pour prouver que l'utilisateur est authentifié et autorisé à supprimer ce projet. */
    });

    if (response.ok) {
      // Mise à jour du tableau global
      allWorks = allWorks.filter(work => work.id != id);/* Si la suppression a réussi, on met à jour le tableau global allWorks. */

      // Mise à jour du DOM
      displayWorks(allWorks); // Met à jour la galerie principale
      displayModalGallery(allWorks);  // Met à jour la galerie de la modale
    } else {/* Si la réponse de l'API indique une erreur lors de la suppression, on affiche un message d'erreur dans la console . */
      console.log("Erreur DELETE :", response.status);/* On affiche le code d'erreur. */
    }
  }
});
