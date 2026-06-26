/*************************************************************
 * SCRIPT LOGIN — GESTION DE LA CONNEXION UTILISATEUR
 * Ce script envoie l'email + mot de passe à l'API et stocke
 * le token si la connexion est réussie.
 *************************************************************/

// On récupère le formulaire et le message d'erreur
const form = document.getElementById("login-form");/* On cible le formulaire de connexion */
const errorMessage = document.getElementById("error-message");/* On cible l'élément qui affichera le message d'erreur */

// On cache le message d'erreur au chargement
errorMessage.style.display = "none";

// Écoute l'envoi du formulaire
form.addEventListener("submit", async (event) => {/* On écoute l'événement de soumission du formulaire */
  event.preventDefault(); // Empêche le rechargement de la page

  // On récupère les valeurs saisies
  const email = document.getElementById("email").value;/* On récupère la valeur de l'email saisi par l'utilisateur */
  const password = document.getElementById("password").value;

  // Requête POST vers l'API de login
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",/* On spécifie que c'est une requête POST */
    headers: { "Content-Type": "application/json" },/* On indique que les données sont au format JSON */
    body: JSON.stringify({ email, password }) // On envoie les identifiants
  });

  // Si la connexion réussit
  if (response.ok) {
    const data = await response.json(); // On récupère le token
    localStorage.setItem("token", data.token); // On stocke le token
    window.location.href = "index.html"; // Redirection vers l'accueil
  } 
  // Si identifiants incorrects
  else {
    errorMessage.style.display = "block"; // On affiche le message d'erreur
  }
});
