// Store reports in localStorage
let reports = JSON.parse(localStorage.getItem("reports")) || [];

// Generate unique ID
function generateId() {
  return "R-" + Math.floor(1000 + Math.random() * 9000);
}

// Auto assign worker by place type
function autoAssign(placeType) {
  const workers = {
    "College": "Facility Staff",
    "Hospital": "Housekeeping Team",
    "Roadside Tank": "Municipality Workers",
    "Community": "Community Volunteers"
  };
  return workers[placeType] || "General Worker";
}

// Handle report form submission
document.addEventListener("DOMContentLoaded", () => {
  const reportForm = document.getElementById("reportForm");
  if (reportForm) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const location = document.getElementById("location").value;
      const issue = document.getElementById("issue").value;
      const placeType = document.getElementById("placeType").value;
      const photoInput = document.getElementById("photo");
      const id = generateId();

      let photoURL = "";
      if (photoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
          photoURL = e.target.result;
          saveReport(id, name, location, issue, placeType, photoURL);
        };
        reader.readAsDataURL(photoInput.files[0]);
      } else {
        saveReport(id, name, location, issue, placeType, photoURL);
      }
    });
  }

  // Handle status check
  const statusForm = document.getElementById("statusForm");
  if (statusForm) {
    statusForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const reportId = document.getElementById("reportIdInput").value;
      const found = reports.find(r => r.id === reportId);
      const result = document.getElementById("statusResult");
      if (found) {
        result.innerHTML = `
          <p><b>Status:</b> ${found.status}</p>
          <p><b>Assigned To:</b> ${found.assignedTo}</p>
          ${found.photo ? `<img src="${found.photo}" width="200">` : ""}
        `;
      } else {
        result.textContent = "❌ Report not found!";
      }
    });
  }
});

// Save report function
function saveReport(id, name, location, issue, placeType, photoURL) {
  const report = {
    id,
    name,
    location,
    issue,
    placeType,
    status: "Pending",
    assignedTo: autoAssign(placeType),
    photo: photoURL
  };

  reports.push(report);
  localStorage.setItem("reports", JSON.stringify(reports));

  document.getElementById("reportMessage").textContent =
    `✅ Report submitted! Your ID is ${id}.`;
  document.getElementById("reportForm").reset();
}

// Load dashboard reports
function loadReports() {
  const dashboard = document.getElementById("dashboardReports");
  dashboard.innerHTML = "";
  reports.forEach((r, index) => {
    const div = document.createElement("div");
    div.className = "report-card";
    div.innerHTML = `
      <p><b>ID:</b> ${r.id}</p>
      <p><b>Name:</b> ${r.name}</p>
      <p><b>Location:</b> ${r.location}</p>
      <p><b>Place:</b> ${r.placeType}</p>
      <p><b>Issue:</b> ${r.issue}</p>
      <p><b>Status:</b> ${r.status}</p>
      <p><b>Assigned To:</b> ${r.assignedTo}</p>
      ${r.photo ? `<img src="${r.photo}" width="120">` : ""}
      <br>
      <button onclick="markCompleted(${index})">✅ Mark Completed</button>
    `;
    dashboard.appendChild(div);
  });
}

// Mark report completed
function markCompleted(index) {
  reports[index].status = "Completed";
  localStorage.setItem("reports", JSON.stringify(reports));
  loadReports();
}
