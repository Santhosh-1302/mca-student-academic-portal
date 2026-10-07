const deepClone = (o) => JSON.parse(JSON.stringify(o));
function getData(key) {
  const v = localStorage.getItem("mca_" + key);
  return v ? JSON.parse(v) : deepClone(window.DEMO_DATA[key] || []);
}
function setData(key, data) {
  localStorage.setItem("mca_" + key, JSON.stringify(data));
}
function nextId(data) {
  return data.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
}
function esc(v) {
  return String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c],
  );
}
function toast(msg, type = "success") {
  const e = document.createElement("div");
  e.className = `alert alert-${type} position-fixed top-0 end-0 m-3 shadow`;
  e.style.zIndex = 3000;
  e.innerHTML = msg;
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 2500);
}
function grade(total) {
  if (total >= 90) return "O";
  if (total >= 80) return "A+";
  if (total >= 70) return "A";
  if (total >= 60) return "B+";
  if (total >= 50) return "B";
  if (total >= 40) return "C";
  return "F";
}
function totalMarks(m) {
  return ["internal1", "internal2", "assignment", "model", "external"].reduce(
    (s, k) => s + Number(m[k] || 0),
    0,
  );
}
function requireAuth(role) {
  const u = getCurrentUser();
  if (!u) {
    location.href =
      location.pathname.includes("/admin/") ||
      location.pathname.includes("/professor/")
        ? "../login.html"
        : "login.html";
    return null;
  }
  if (role && u.role !== role) {
    location.href =
      u.role === "admin"
        ? "../admin/dashboard.html"
        : u.role === "professor"
          ? "../professor/dashboard.html"
          : "../dashboard.html";
    return null;
  }
  return u;
}
function setActive(key) {
  document
    .querySelectorAll("[data-nav]")
    .forEach((a) => a.classList.toggle("active", a.dataset.nav === key));
}
function commonUI() {
  const u = getCurrentUser();
  document
    .querySelectorAll("[data-user-name]")
    .forEach((x) => (x.textContent = u?.name || "User"));
  document
    .querySelectorAll("[data-role]")
    .forEach(
      (x) =>
        (x.textContent = u?.role?.[0]?.toUpperCase() + u?.role?.slice(1) || ""),
    );
  const av = document.querySelector("#avatar");
  if (av) av.textContent = (u?.name || "U")[0];
  const n = document.querySelector("#notifications");
  if (n)
    n.innerHTML = getData("notifications")
      .map(
        (x) =>
          `<li><span class="dropdown-item-text small">${esc(x)}</span></li>`,
      )
      .join("");
  document
    .getElementById("menuBtn")
    ?.addEventListener("click", () =>
      document.getElementById("sidebar")?.classList.toggle("show"),
    );
  document.getElementById("logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}
