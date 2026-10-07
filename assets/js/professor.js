const profUser = requireAuth("professor");
if (profUser) {
  commonUI();
}
const pp = location.pathname.split("/").pop().replace(".html", "");
if (pp === "dashboard") {
  document.getElementById("profStats").innerHTML = [
    ["subjects", "My Subjects", "bi-book"],
    ["materials", "Materials", "bi-file-earmark-text"],
    ["projects", "Projects", "bi-kanban"],
    ["labs", "Lab Work", "bi-flask"],
    ["marks", "Student Marks", "bi-bar-chart"],
    ["announcements", "Announcements", "bi-megaphone"],
  ]
    .map(
      (x) =>
        `<div class="col-6 col-lg-3"><div class="card p-3"><div class="small text-secondary">${x[1]}</div><div class="fs-3 fw-bold">${getData(x[0]).length}</div></div></div>`,
    )
    .join("");
}
const pc = {
  materials: [
    "materials",
    ["title", "subject", "type", "faculty"],
    ["Title", "Subject", "Type", "Faculty"],
  ],
  projects: [
    "projects",
    ["title", "subject", "deadline", "status"],
    ["Title", "Subject", "Deadline", "Status"],
  ],
  laboratory: [
    "labs",
    ["experiment", "title", "subject", "status"],
    ["Experiment", "Title", "Subject", "Status"],
  ],
  marks: [
    "marks",
    ["name", "internal1", "internal2", "external"],
    ["Subject", "Internal 1", "Internal 2", "External"],
  ],
  announcements: [
    "announcements",
    ["title", "priority", "date", "postedBy"],
    ["Title", "Priority", "Date", "Posted By"],
  ],
};
if (pc[pp]) {
  const [key, fields] = pc[pp];
  document.getElementById("rows").innerHTML = getData(key)
    .map(
      (x) =>
        `<tr>${fields.map((f) => `<td>${esc(x[f])}</td>`).join("")}${pp === "marks" ? `<td><b>${totalMarks(x)}</b></td><td>${grade(totalMarks(x))}</td>` : ""}</tr>`,
    )
    .join("");
}
