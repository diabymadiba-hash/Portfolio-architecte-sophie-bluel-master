async function init() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  console.log(works);
}

init();
