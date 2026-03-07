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

  const categories = await getCategories();

  displayFilters(categories, works);
  displayWorks(works);
}

init();
