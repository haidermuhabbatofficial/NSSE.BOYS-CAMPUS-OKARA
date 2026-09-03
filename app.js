(function () {
  let STUDENTS = [];
  let SCHEDULE = [];
  const index = {};

  const loadStatus = document.getElementById("loadStatus");
  const input = document.getElementById("bformInput");
  const searchBtn = document.getElementById("searchBtn");
  const slip = document.getElementById("slip");
  const message = document.getElementById("message");
  const clearBtn = document.getElementById("clearBtn");
  const printBtn = document.getElementById("printBtn");
  const multiCard = document.getElementById("multiCard");
  const multiList = document.getElementById("multiList");
  const scheduleRows = document.getElementById("scheduleRows");

  // ---------------- Load results.xlsx ----------------

  fetch("results.xlsx")
    .then((res) => {
      if (!res.ok) throw new Error("File not found (" + res.status + ")");
      return res.arrayBuffer();
    })
    .then((buf) => {
      const workbook = XLSX.read(buf, { type: "array" });
      applySettings(readSheet(workbook, "Settings"));
      SCHEDULE = readSheet(workbook, "Schedule");
      renderSchedule(SCHEDULE);
      STUDENTS = buildStudents(readSheet(workbook, "Students"));
      buildIndex();
      loadStatus.hidden = true;
    })
    .catch((err) => {
      loadStatus.textContent =
        "Couldn't load results.xlsx (" + err.message + "). " +
        "If you're viewing this file directly from your computer, run it through a local " +
        "server instead \u2014 it works once it's live on GitHub Pages.";
      loadStatus.classList.add("error");
    });

  function readSheet(workbook, name) {
    const sheet = workbook.Sheets[name];
    if (!sheet) return [];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
  }

  function applySettings(rows) {
    const s = {};
    rows.forEach((r) => { if (r.Key) s[r.Key] = r.Value; });
    if (s.SchoolShort) {
      document.title = s.SchoolShort + " (Roll No Slip)";
      document.getElementById("hSchoolShort").textContent = s.SchoolShort + " (Roll No Slip)";
    }
    if (s.Subtitle) document.getElementById("hSubtitle").textContent = s.Subtitle;
    if (s.Tagline) document.getElementById("hTagline").textContent = s.Tagline;
    if (s.SchoolName) {
      document.getElementById("slipSchoolName").textContent = s.SchoolName;
      document.getElementById("footerSchool").textContent =
        s.SchoolName + " (" + (s.SchoolShort || "").replace(/\s*Boys Okara.*/, "") + ") Boys Campus, Okara";
    }
    if (s.Subtitle) {
      document.getElementById("slipSubHead").textContent = s.Subtitle + " \u2014 Admission Test";
    }
    if (s.Phone) document.getElementById("footerPhone").textContent = s.Phone;
  }

  function renderSchedule(rows) {
    scheduleRows.innerHTML = rows
      .map(
        (r) => `
        <div class="schedule-row">
          <div class="cls">${escapeHtml(r.ClassGroup)}</div>
          <div class="when">${escapeHtml(r.DateLabel)}<br>${escapeHtml(r.ShiftText)}</div>
        </div>`
      )
      .join("");
  }

  function buildStudents(rows) {
    return rows.map((r) => ({
      roll: r.Roll,
      reg: String(r.RegNo || ""),
      name: r.Name || "",
      cls: r.Class || "",
      mobile: String(r.Mobile || ""),
      father: r.FatherName || "",
      bform: r.BForm || "",
      dateLabel: r.ExamDate || "",
      shiftLabel: r.Shift || "",
      classGroup: r.ClassGroup || "",
    }));
  }

  function buildIndex() {
    STUDENTS.forEach((s) => {
      const norm = (s.bform || "").replace(/[^0-9]/g, "");
      if (!norm) return;
      if (!index[norm]) index[norm] = [];
      index[norm].push(s);
    });
  }

  // ---------------- Search & render (same behaviour as original) ----------------

  function showMessage(text) {
    message.textContent = text;
    message.style.display = "block";
    slip.style.display = "none";
    multiCard.style.display = "none";
  }
  function hideMessage() {
    message.style.display = "none";
  }

  function fillSlip(s) {
    document.getElementById("shiftStrip").textContent = s.dateLabel + " \u2014 " + s.shiftLabel;
    document.getElementById("stuName").textContent = s.name;
    document.getElementById("stuClass").textContent = s.classGroup;
    document.getElementById("rollBig").textContent = s.roll;
    document.getElementById("dReg").textContent = s.reg || "-";
    document.getElementById("dDate").textContent = s.dateLabel + " \u2014 " + s.shiftLabel;
    document.getElementById("dFather").textContent = s.father || "-";
    document.getElementById("dBform").textContent = s.bform || "-";
    const mobileWrap = document.getElementById("mobileWrap");
    if (s.mobile) {
      document.getElementById("dMobile").textContent = s.mobile;
      mobileWrap.style.display = "";
    } else {
      mobileWrap.style.display = "none";
    }
    slip.style.display = "block";
    multiCard.style.display = "none";
    hideMessage();
  }

  function showMultiple(list) {
    multiList.innerHTML = "";
    list.forEach((s) => {
      const div = document.createElement("div");
      div.className = "multi-item";
      div.innerHTML =
        '<div><div class="mi-name">' + escapeHtml(s.name) + '</div><div class="mi-class">' +
        escapeHtml(s.classGroup) + " &middot; Roll " + escapeHtml(String(s.roll)) + "</div></div><div class=\"mi-arrow\">&rarr;</div>";
      div.addEventListener("click", () => fillSlip(s));
      multiList.appendChild(div);
    });
    multiCard.style.display = "block";
    slip.style.display = "none";
    hideMessage();
  }

  function doSearch() {
    const raw = input.value.trim();
    if (!raw) {
      showMessage("Please enter a B-Form number.");
      return;
    }
    const norm = raw.replace(/[^0-9]/g, "");
    const found = index[norm];
    if (found && found.length === 1) {
      fillSlip(found[0]);
    } else if (found && found.length > 1) {
      showMultiple(found);
    } else {
      showMessage("This B-Form number was not found in the record. Please check the number and try again.");
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  searchBtn.addEventListener("click", doSearch);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") doSearch(); });
  clearBtn.addEventListener("click", () => {
    input.value = "";
    slip.style.display = "none";
    multiCard.style.display = "none";
    hideMessage();
    input.focus();
  });
  printBtn.addEventListener("click", () => { window.print(); });
})();
