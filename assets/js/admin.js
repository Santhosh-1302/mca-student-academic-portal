const adminUser = requireAuth("admin");
if (adminUser) {
  commonUI();
  setActive(location.pathname.split("/").pop().replace(".html", ""));
}
const adminPage = location.pathname.split("/").pop().replace(".html", "");
if (adminPage === "dashboard") {
  const defs = [
    ["students", "Students", "bi-people"],
    ["professors", "Professors", "bi-person-badge"],
    ["subjects", "Subjects", "bi-book"],
    ["materials", "Materials", "bi-file-earmark-text"],
    ["projects", "Projects", "bi-kanban"],
    ["labs", "Lab Work", "bi-flask"],
    ["announcements", "Announcements", "bi-megaphone"],
    ["events", "Events", "bi-calendar-event"],
  ];
  document.getElementById("adminStats").innerHTML = defs
    .map(
      (d) =>
        `<div class="col-6 col-lg-3"><div class="card stat-card p-3"><div class="d-flex justify-content-between"><div><div class="small text-secondary">${d[1]}</div><div class="fs-3 fw-bold">${getData(d[0]).length}</div></div><div class="stat-icon"><i class="bi ${d[2]}"></i></div></div></div></div>`,
    )
    .join("");
}
const configs = {
  students: {
    key: "students",
    headers: ["Name", "Register No", "Email", "Semester"],
    fields: ["name", "regNo", "email", "semester"],
  },
  professors: {
    key: "professors",
    headers: ["Name", "Designation", "Department", "Email"],
    fields: ["name", "designation", "department", "email"],
  },
  subjects: {
    key: "subjects",
    headers: ["Code", "Name", "Credits", "Semester"],
    fields: ["code", "name", "credits", "semester"],
  },
  syllabus: {
    key: "syllabus",
    headers: ["Subject", "Name", "Credits", "Semester"],
    fields: ["subject", "name", "credits", "semester"],
  },
  materials: {
    key: "materials",
    headers: ["Title", "Subject", "Type", "Faculty"],
    fields: ["title", "subject", "type", "faculty"],
  },
  projects: {
    key: "projects",
    headers: ["Title", "Subject", "Deadline", "Status"],
    fields: ["title", "subject", "deadline", "status"],
  },
  laboratory: {
    key: "labs",
    headers: ["Experiment", "Title", "Subject", "Status"],
    fields: ["experiment", "title", "subject", "status"],
  },
  marks: {
    key: "marks",
    headers: [
      "Student Subject",
      "Internal 1",
      "Internal 2",
      "External",
      "Total",
    ],
    fields: ["name", "internal1", "internal2", "external", "total"],
  },
  timetable: {
    key: "timetable",
    headers: ["Day", "Order", "Period", "Time", "Subject", "Room"],
    fields: ["day", "order", "period", "time", "subject", "room"],
  },
  announcements: {
    key: "announcements",
    headers: ["Title", "Priority", "Date", "Posted By"],
    fields: ["title", "priority", "date", "postedBy"],
  },
  events: {
    key: "events",
    headers: ["Title", "Type", "Date", "Venue"],
    fields: ["title", "type", "date", "venue"],
  },
};
if (configs[adminPage]) {
  const c = configs[adminPage],
    rows = document.getElementById("rows"),
    thead = document.getElementById("thead"),
    search = document.getElementById("search");
  thead.innerHTML =
    "<tr>" +
    c.headers.map((h) => `<th>${h}</th>`).join("") +
    "<th>Action</th></tr>";
  function render() {
    const q = search.value.toLowerCase(),
      data = getData(c.key);
    rows.innerHTML =
      data
        .filter((x) =>
          c.fields.some((f) =>
            String(x[f] ?? "")
              .toLowerCase()
              .includes(q),
          ),
        )
        .map(
          (x, i) =>
            `<tr>${c.fields.map((f) => `<td>${esc(f === "total" ? totalMarks(x) : x[f])}</td>`).join("")}<td><button class="btn btn-sm btn-outline-danger" onclick="deleteAdminRecord('${c.key}',${x.id ?? i})"><i class="bi bi-trash"></i></button></td></tr>`,
        )
        .join("") ||
      `<tr><td colspan="${c.fields.length + 1}" class="empty">No records found.</td></tr>`;
  }
  search.addEventListener("input", render);
  render();
  document.getElementById("addBtn").addEventListener("click", () => {
    const data = getData(c.key),
      obj = { id: nextId(data) };
    for (const f of c.fields) {
      if (f === "total") continue;
      const v = prompt(`Enter ${f}:`);
      if (v === null) return;
      obj[f] = v;
    }
    data.push(obj);
    setData(c.key, data);
    render();
    toast("Record added successfully.");
  });
}
function deleteAdminRecord(key, id) {
  if (!confirm("Delete this record?")) return;
  setData(
    key,
    getData(key).filter((x, i) => x.id !== id && i !== id),
  );
  location.reload();
}
