function getCurrentUser() {
  try {
    return JSON.parse(
      localStorage.getItem("mcaSession") ||
        sessionStorage.getItem("mcaSession") ||
        "null",
    );
  } catch {
    return null;
  }
}
function saveSession(user, remember) {
  const value = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  (remember ? localStorage : sessionStorage).setItem("mcaSession", value);
}
function logout() {
  localStorage.removeItem("mcaSession");
  sessionStorage.removeItem("mcaSession");
  location.href = "../index.html";
}
function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const user = (window.DEMO_DATA.users || []).find(
    (u) =>
      u.email.toLowerCase() === email &&
      u.password === password &&
      u.role === role,
  );
  const alert = document.getElementById("loginAlert");
  if (!user) {
    alert.innerHTML =
      '<div class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>Invalid credentials or selected role.</div>';
    return;
  }
  saveSession(user, document.getElementById("remember").checked);
  location.href =
    role === "admin"
      ? "admin/dashboard.html"
      : role === "professor"
        ? "professor/dashboard.html"
        : "dashboard.html";
}
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});
document.getElementById("togglePassword")?.addEventListener("click", () => {
  const p = document.getElementById("password"),
    i = document.querySelector("#togglePassword i");
  p.type = p.type === "password" ? "text" : "password";
  i.className = p.type === "password" ? "bi bi-eye" : "bi bi-eye-slash";
});
