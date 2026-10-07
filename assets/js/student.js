const studentUser = requireAuth("student");
if (studentUser) {
  commonUI();
  setActive(location.pathname.split("/").pop().replace(".html", ""));
}
const page = location.pathname.split("/").pop().replace(".html", "");
const stat = (icon, label, value) =>
  `<div class="col-6 col-xl-3"><div class="card stat-card p-3"><div class="d-flex justify-content-between align-items-center"><div><div class="small text-secondary">${label}</div><div class="fs-3 fw-bold">${value}</div></div><div class="stat-icon"><i class="bi ${icon}"></i></div></div></div></div>`;

if (page === "dashboard") {
  const subjects = getData("subjects"),
    materials = getData("materials"),
    projects = getData("projects"),
    labs = getData("labs"),
    anns = getData("announcements");
  document.getElementById("stats").innerHTML =
    stat("bi-book", "Subjects", subjects.length) +
    stat("bi-file-earmark-text", "Materials", materials.length) +
    stat(
      "bi-kanban",
      "Pending Projects",
      projects.filter((x) => x.status !== "Completed").length,
    ) +
    stat("bi-flask", "Lab Work", labs.length);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const day = today === "Saturday" || today === "Sunday" ? "Monday" : today;
  document.getElementById("todaySchedule").innerHTML =
    getData("timetable")
      .filter((x) => x.day === day)
      .map(
        (x) =>
          `<div class="border-bottom py-3"><b>Period ${x.period}</b><span class="ms-3">${esc(x.subject)}</span><span class="float-end small text-secondary">${esc(x.faculty)} • ${x.room}</span></div>`,
      )
      .join("") || '<div class="empty">No classes scheduled today.</div>';
  document.getElementById("latestAnnouncements").innerHTML = anns
    .slice(0, 3)
    .map(
      (x) =>
        `<div class="border-bottom py-3"><span class="badge text-bg-${x.priority === "Urgent" ? "danger" : x.priority === "Important" ? "warning" : "secondary"}">${x.priority}</span><div class="fw-semibold mt-1">${esc(x.title)}</div><div class="small text-secondary">${esc(x.description)}</div></div>`,
    )
    .join("");
}
if (page === "syllabus") {
  const render = () => {
    const q = document.getElementById("search").value.toLowerCase(),
      sem = document.getElementById("semFilter").value;
    const rows = getData("syllabus").filter(
      (x) =>
        (!q || `${x.subject} ${x.name}`.toLowerCase().includes(q)) &&
        (!sem || String(x.semester) === sem),
    );
    document.getElementById("syllabusList").innerHTML =
      rows
        .map(
          (x) =>
            `<div class="col-md-6"><div class="card p-4 h-100"><div class="d-flex justify-content-between"><span class="badge text-bg-primary">${x.subject}</span><span class="text-secondary">${x.credits} Credits</span></div><h5 class="mt-3">${esc(x.name)}</h5>${x.units.map((u, i) => `<div class="border-bottom py-2"><b>Unit ${i + 1}</b> — ${esc(u)}</div>`).join("")}</div></div>`,
        )
        .join("") || '<div class="empty">No syllabus records found.</div>';
  };
  ["search", "semFilter"].forEach((id) =>
    document.getElementById(id).addEventListener("input", render),
  );
  render();
}
if (page === "materials") {
  const render = () => {
    const q = document.getElementById("search").value.toLowerCase(),
      type = document.getElementById("typeFilter").value;
    const rows = getData("materials").filter(
      (x) =>
        (!q ||
          `${x.title} ${x.subject} ${x.description}`
            .toLowerCase()
            .includes(q)) &&
        (!type || x.type === type),
    );
    document.getElementById("materialRows").innerHTML =
      rows
        .map(
          (x) =>
            `<tr><td><b>${esc(x.title)}</b><div class="small text-secondary">${esc(x.description)}</div></td><td>${x.subject}</td><td>${esc(x.faculty)}</td><td>${x.date}</td><td><span class="badge text-bg-light">${x.type}</span></td><td><a href="${x.link}" class="btn btn-sm btn-outline-primary">View</a></td></tr>`,
        )
        .join("") ||
      '<tr><td colspan="6" class="empty">No study materials available.</td></tr>';
  };
  ["search", "typeFilter"].forEach((id) =>
    document.getElementById(id).addEventListener("input", render),
  );
  render();
}
if (page === "projects") {
  const render = () => {
    const q = document.getElementById("search").value.toLowerCase(),
      status = document.getElementById("statusFilter").value;
    const rows = getData("projects").filter(
      (x) =>
        (!q || `${x.title} ${x.description}`.toLowerCase().includes(q)) &&
        (!status || x.status === status),
    );
    document.getElementById("projectList").innerHTML =
      rows
        .map((x) => {
          const c =
            x.status === "Completed"
              ? "success"
              : x.status === "Overdue"
                ? "danger"
                : x.status === "Pending"
                  ? "warning"
                  : "primary";
          return `<div class="col-md-6 col-xl-4"><div class="card p-4 h-100"><div class="d-flex justify-content-between"><span class="badge text-bg-${c}">${x.status}</span><small>${x.subject}</small></div><h5 class="mt-3">${esc(x.title)}</h5><p class="text-secondary">${esc(x.description)}</p><div class="small">Deadline: <b>${x.deadline}</b></div><div class="small mt-1">Given by: ${esc(x.givenBy)}</div></div></div>`;
        })
        .join("") || '<div class="empty">No projects assigned.</div>';
  };
  ["search", "statusFilter"].forEach((id) =>
    document.getElementById(id).addEventListener("input", render),
  );
  render();
}
if (page === "laboratory") {
  document.getElementById("labRows").innerHTML = getData("labs")
    .map((x) => {
      const p =
        x.status === "Completed" ? 100 : x.status === "In Progress" ? 55 : 0;
      return `<tr><td>${x.experiment}</td><td><b>${esc(x.title)}</b></td><td>${x.subject}</td><td>${x.date}</td><td>${esc(x.faculty)}</td><td style="min-width:160px"><div class="small mb-1">${x.status}</div><div class="progress"><div class="progress-bar" style="width:${p}%"></div></div></td></tr>`;
    })
    .join("");
}
if (page === "marks") {
  const ms = getData("marks").map((x) => ({ ...x, total: totalMarks(x) })),
    sum = ms.reduce((a, x) => a + x.total, 0),
    avg = ms.length ? sum / ms.length : 0;
  document.getElementById("markSummary").innerHTML =
    stat("bi-calculator", "Total Marks", sum) +
    stat("bi-percent", "Average", avg.toFixed(2)) +
    stat("bi-graph-up", "Percentage", avg.toFixed(2) + "%") +
    stat("bi-award", "Subjects", ms.length);
  document.getElementById("markRows").innerHTML = ms
    .map(
      (x) =>
        `<tr><td><b>${esc(x.name)}</b><div class="small text-secondary">${x.subject}</div></td><td>${x.internal1}</td><td>${x.internal2}</td><td>${x.assignment}</td><td>${x.model}</td><td>${x.external}</td><td><b>${x.total}</b></td><td><span class="badge text-bg-${x.total < 40 ? "danger" : "success"}">${grade(x.total)}</span></td></tr>`,
    )
    .join("");
}
if (page === "timetable") {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    box = document.getElementById("dayButtons");
  box.innerHTML = days
    .map(
      (d) =>
        `<button class="btn btn-outline-primary day-btn" data-day="${d}">${d}</button>`,
    )
    .join("");
  const render = (day) => {
    document
      .querySelectorAll(".day-btn")
      .forEach((b) => b.classList.toggle("active", b.dataset.day === day));
    const rows = getData("timetable").filter((x) => x.day === day);
    document.getElementById("timeRows").innerHTML =
      rows
        .map(
          (x) =>
            `<tr><td>${x.order}</td><td>${x.period}</td><td>${x.time}</td><td><b>${esc(x.subject)}</b></td><td>${esc(x.faculty)}</td><td>${x.room}</td></tr>`,
        )
        .join("") ||
      '<tr><td colspan="6" class="empty">No classes scheduled.</td></tr>';
  };
  box
    .querySelectorAll("button")
    .forEach((b) => (b.onclick = () => render(b.dataset.day)));
  render("Monday");
}
if (page === "faculty") {
  const render = () => {
    const q = document.getElementById("search").value.toLowerCase();
    const rows = getData("professors").filter((x) =>
      `${x.name} ${x.department} ${x.subjects}`.toLowerCase().includes(q),
    );
    document.getElementById("facultyList").innerHTML =
      rows
        .map(
          (x) =>
            `<div class="col-md-6 col-xl-4"><div class="card p-4 h-100"><div class="avatar mb-3">${x.name[0]}</div><h5>${esc(x.name)}</h5><div class="text-primary">${esc(x.designation)}</div><div class="small text-secondary mt-2">${esc(x.department)} • ${esc(x.qualification)}</div><div class="small mt-2"><i class="bi bi-envelope me-1"></i>${esc(x.email)}</div><div class="small mt-2"><b>Subjects:</b> ${esc(x.subjects)}</div></div></div>`,
        )
        .join("") || '<div class="empty">No faculty found.</div>';
  };
  document.getElementById("search").addEventListener("input", render);
  render();
}
if (page === "announcements") {
  const render = () => {
    const q = document.getElementById("search").value.toLowerCase();
    const rows = getData("announcements")
      .filter((x) => `${x.title} ${x.description}`.toLowerCase().includes(q))
      .sort(
        (a, b) =>
          ({ Urgent: 0, Important: 1, Normal: 2 })[a.priority] -
          { Urgent: 0, Important: 1, Normal: 2 }[b.priority],
      );
    document.getElementById("announcementList").innerHTML =
      rows
        .map(
          (x) =>
            `<div class="card p-4 mb-3"><div class="d-flex justify-content-between gap-3"><h5>${esc(x.title)}</h5><span class="badge text-bg-${x.priority === "Urgent" ? "danger" : x.priority === "Important" ? "warning" : "secondary"}">${x.priority}</span></div><p class="text-secondary">${esc(x.description)}</p><small>${x.date} • ${esc(x.postedBy)}</small></div>`,
        )
        .join("") || '<div class="empty">No announcements found.</div>';
  };
  document.getElementById("search").addEventListener("input", render);
  render();
}
if (page === "events") {
  const render = () => {
    const q = document.getElementById("search").value.toLowerCase();
    const rows = getData("events").filter((x) =>
      `${x.title} ${x.description} ${x.type}`.toLowerCase().includes(q),
    );
    document.getElementById("eventList").innerHTML =
      rows
        .map(
          (x) =>
            `<div class="col-md-6 col-xl-4"><div class="card event-card p-4 h-100"><span class="badge text-bg-primary align-self-start">${esc(x.type)}</span><h5 class="mt-3">${esc(x.title)}</h5><div><i class="bi bi-calendar3 me-2"></i>${x.date} • ${x.time}</div><div class="mt-1"><i class="bi bi-geo-alt me-2"></i>${esc(x.venue)}</div><p class="text-secondary mt-3">${esc(x.description)}</p><small>Organizer: ${esc(x.organizer)}</small></div></div>`,
        )
        .join("") || '<div class="empty">No events found.</div>';
  };
  document.getElementById("search").addEventListener("input", render);
  render();
}
if (page === "profile") {
  const s = getData("students")[0];
  const map = {
    pName: s.name,
    pReg: s.regNo,
    pEmail: s.email,
    pPhone: s.phone,
    pDob: s.dob,
    pSem: s.semester,
    pSection: s.section,
    pGender: s.gender,
    pAddress: s.address,
    pSkills: s.skills,
  };
  Object.entries(map).forEach(([id, v]) => {
    const e = document.getElementById(id);
    if (e) e.value = v ?? "";
  });
  document.getElementById("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = getData("students"),
      s = data[0];
    Object.assign(s, {
      name: pName.value.trim(),
      regNo: pReg.value.trim(),
      phone: pPhone.value.trim(),
      dob: pDob.value,
      semester: Number(pSem.value),
      section: pSection.value.trim(),
      gender: pGender.value,
      address: pAddress.value.trim(),
      skills: pSkills.value.trim(),
    });
    setData("students", data);
    toast("Profile updated successfully.");
  });
}
