const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

// On cache le message d'erreur au chargement
errorMessage.style.display = "none";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } else {
    errorMessage.style.display = "block";
  }
});
