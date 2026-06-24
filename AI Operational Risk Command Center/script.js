"use strict";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const issueContent = {
  time: {
    index: "01",
    title: "Administrative work expands with every record.",
    copy: "Volume increases the amount of copying, checking, and re-entering instead of increasing the time available for customer, operational, and decision-focused work."
  },
  quality: {
    index: "02",
    title: "The same value can change as it moves between systems.",
    copy: "Manual entry introduces missing fields, inconsistent formats, duplicate records, and mismatched status that require another round of reconciliation."
  },
  visibility: {
    index: "03",
    title: "Leaders see the backlog after it has already become a delay.",
    copy: "Without a unified processing view, teams cannot easily see what is waiting, what failed, who owns the exception, or which system holds the current record."
  },
  control: {
    index: "04",
    title: "Manual transfer makes evidence harder to reconstruct.",
    copy: "When actions happen across emails, spreadsheets, the CRM, and a third-party portal, the source, decision, approval, and final update can become disconnected."
  }
};

const transformContent = {
  ingest: {
    title: "Ingest information from the channel where it arrives.",
    copy: "The command center accepts a document, structured file, form submission, or system event and creates one controlled processing record."
  },
  extract: {
    title: "Extract the fields the workflow actually needs.",
    copy: "AI identifies relevant values, normalizes the structure, associates each field with its source, and assigns a confidence score for review."
  },
  validate: {
    title: "Validate before information reaches another system.",
    copy: "Business rules check required values, data types, duplicates, conflicts, and policy-sensitive conditions before the record can move forward."
  },
  distribute: {
    title: "Distribute approved data to the CRM and connected platform.",
    copy: "A governed mapping layer writes the same approved values to each destination so the systems remain aligned without duplicate entry."
  },
  approve: {
    title: "Keep people at the exception and decision points.",
    copy: "Low-confidence, incomplete, or sensitive records pause for human review while standard records follow a straight-through path."
  }
};

const controlContent = {
  validation: {
    title: "Data validation",
    copy: "The workflow tests whether information is complete, correctly formatted, nonduplicative, and compatible with the destination before an update is committed.",
    items: {
      Trigger: "Every new or changed source record",
      Evidence: "Field-level validation result and confidence score",
      Outcome: "Pass, hold for review, or reject"
    }
  },
  approval: {
    title: "Human approval",
    copy: "Defined thresholds determine when a person must review the record. The approver can correct, approve, or return the transaction without losing the original source evidence.",
    items: {
      Trigger: "Low confidence, missing data, or sensitive condition",
      Evidence: "Reviewer, timestamp, changes, and decision",
      Outcome: "Approved, corrected, or returned"
    }
  },
  traceability: {
    title: "System traceability",
    copy: "The command center records the source, extracted value, destination mapping, system response, and each human decision in one workflow history.",
    items: {
      Trigger: "Every automated and manual action",
      Evidence: "Immutable event sequence",
      Outcome: "Complete source-to-destination history"
    }
  },
  exceptions: {
    title: "Exception management",
    copy: "Nonstandard records are separated from straight-through processing and assigned to a named owner with a reason, priority, and next action.",
    items: {
      Trigger: "Conflict, missing value, failed integration, or policy condition",
      Evidence: "Exception reason and resolution activity",
      Outcome: "Resolved, overridden, or escalated"
    }
  }
};

const state = {
  currentStep: 1,
  sourceName: "Sample_Operational_Record.pdf",
  extractedData: {},
  audit: [],
  toastTimer: null
};

function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function addAudit(action, actor = "AI workflow") {
  state.audit.push({
    time: formatTime(),
    action,
    actor
  });
}

function renderAudit() {
  const log = $("#audit-log");
  log.innerHTML = state.audit.map(event => `
    <div class="audit-event">
      <time>${escapeHtml(event.time)}</time>
      <strong>${escapeHtml(event.action)}</strong>
      <span>${escapeHtml(event.actor)}</span>
    </div>
  `).join("");
}

function navigateDemo(step) {
  const stepNumber = Number(step);
  state.currentStep = stepNumber;

  $$(".demo-panel").forEach(panel => {
    panel.classList.toggle("active", Number(panel.dataset.panel) === stepNumber);
  });

  $$(".demo-nav-item").forEach((item, index) => {
    const itemStep = index + 1;
    item.classList.toggle("active", itemStep === stepNumber);
    item.classList.toggle("complete", itemStep < stepNumber);
  });

  $("#demo-progress-bar").style.height = `${((stepNumber - 1) / 4) * 100}%`;
}

function unlockStep(step) {
  const item = $(`.demo-nav-item[data-demo-step="${step}"]`);
  if (item) item.disabled = false;
}

function collectFormData() {
  const form = $("#extraction-form");
  const data = Object.fromEntries(new FormData(form).entries());
  state.extractedData = data;
  return data;
}

function renderCRMRecord() {
  const data = collectFormData();
  const labels = {
    organization: "Organization",
    recordId: "Record ID",
    contactName: "Contact name",
    contactEmail: "Contact email",
    requestType: "Request type",
    effectiveDate: "Effective date",
    serviceCategory: "Service category",
    reviewOwner: "Review owner"
  };

  $("#crm-record").innerHTML = Object.entries(labels).map(([key, label]) => `
    <div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(data[key] || "—")}</dd></div>
  `).join("");

  $("#sync-record-id").textContent = data.recordId || "Pending";
}

function startProcessing(fileName = "Sample_Operational_Record.pdf") {
  state.sourceName = fileName;
  addAudit(`Source accepted: ${fileName}`, "Source intake");
  unlockStep(2);
  navigateDemo(2);

  const processingState = $("#processing-state");
  const form = $("#extraction-form");
  const status = $("#extract-status");
  const message = $("#processing-message");

  processingState.classList.remove("hidden");
  form.classList.add("hidden");
  status.textContent = "Processing";

  const messages = [
    "Reading source structure...",
    "Identifying operational fields...",
    "Validating formats and required values...",
    "Mapping data to the CRM schema..."
  ];

  let index = 0;
  message.textContent = messages[index];
  const timer = window.setInterval(() => {
    index += 1;
    if (index < messages.length) {
      message.textContent = messages[index];
      return;
    }

    window.clearInterval(timer);
    processingState.classList.add("hidden");
    form.classList.remove("hidden");
    status.textContent = "Review ready";
    addAudit("Eight fields extracted and validated", "AI extraction");
    showToast("AI extraction complete. Review the identified fields.");
  }, 600);
}

function populateCRM() {
  renderCRMRecord();
  addAudit("CRM record created from approved fields", "CRM integration");
  unlockStep(4);
  navigateDemo(4);
  showToast("CRM record populated successfully.");
}

function synchronizeThirdParty() {
  addAudit("Approved fields synchronized to third-party platform", "Integration service");
  addAudit("Source-to-destination evidence recorded", "Governance log");
  unlockStep(5);
  navigateDemo(5);
  renderAudit();
  showToast("Third-party synchronization complete.");
}

function resetDemo() {
  state.currentStep = 1;
  state.audit = [];
  state.extractedData = {};
  $$(".demo-nav-item").forEach((item, index) => {
    item.disabled = index !== 0;
    item.classList.remove("active", "complete");
  });
  $(".demo-nav-item[data-demo-step='1']").classList.add("active");
  $("#demo-progress-bar").style.height = "0%";
  $("#file-input").value = "";
  $("#processing-state").classList.remove("hidden");
  $("#extraction-form").classList.add("hidden");
  $("#extract-status").textContent = "Processing";
  navigateDemo(1);
  showToast("Demo reset.");
}

function downloadAuditLog() {
  const data = collectFormData();
  const rows = [
    "AI Operational Risk & Governance Command Center",
    "Activity Log",
    "",
    `Source: ${state.sourceName}`,
    `Record ID: ${data.recordId || "Not available"}`,
    "",
    ...state.audit.map(event => `${event.time} | ${event.action} | ${event.actor}`),
    "",
    "Demo note: This activity log was generated by a front-end simulation."
  ];

  const blob = new Blob([rows.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.recordId || "AI_Command_Center"}_activity_log.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Activity log downloaded.");
}

function setupIssueButtons() {
  $$(".issue-button").forEach(button => {
    button.addEventListener("click", () => {
      $$(".issue-button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const content = issueContent[button.dataset.issue];
      $("#issue-detail").innerHTML = `
        <span class="issue-index">${content.index}</span>
        <h3>${content.title}</h3>
        <p>${content.copy}</p>
      `;
    });
  });
}

function setupTransformButtons() {
  $$(".transform-step").forEach(button => {
    button.addEventListener("click", () => {
      $$(".transform-step").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const content = transformContent[button.dataset.transform];
      $("#transform-detail").innerHTML = `
        <div>
          <p class="card-label">Selected capability</p>
          <h3>${content.title}</h3>
        </div>
        <p>${content.copy}</p>
      `;
    });
  });
}

function setupDemo() {
  $$(".demo-nav-item").forEach(button => {
    button.addEventListener("click", () => {
      if (!button.disabled) navigateDemo(button.dataset.demoStep);
    });
  });

  $("[data-action='sample']").addEventListener("click", () => startProcessing());

  const fileInput = $("#file-input");
  const dropZone = $("#drop-zone");

  fileInput.addEventListener("change", () => {
    if (fileInput.files?.length) startProcessing(fileInput.files[0].name);
  });

  ["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, event => {
      event.preventDefault();
      dropZone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, event => {
      event.preventDefault();
      dropZone.classList.remove("dragover");
    });
  });

  dropZone.addEventListener("drop", event => {
    const file = event.dataTransfer?.files?.[0];
    if (file) startProcessing(file.name);
  });

  $("#extraction-form").addEventListener("submit", event => {
    event.preventDefault();
    const data = collectFormData();
    if (!data.organization || !data.recordId || !data.contactEmail) {
      showToast("Complete the required fields before approval.");
      return;
    }
    addAudit("Extracted fields approved", "Human reviewer");
    renderCRMRecord();
    unlockStep(3);
    navigateDemo(3);
    showToast("Fields approved and ready for CRM population.");
  });

  $("[data-action='populate-crm']").addEventListener("click", populateCRM);
  $("[data-action='sync-third-party']").addEventListener("click", synchronizeThirdParty);
  $("[data-action='download-log']").addEventListener("click", downloadAuditLog);
  $("[data-action='reset-demo']").addEventListener("click", resetDemo);
}

function setupGovernanceDialog() {
  const dialog = $("#control-dialog");
  const title = $("#dialog-title");
  const copy = $("#dialog-copy");
  const list = $("#dialog-list");

  $$('[data-modal]').forEach(button => {
    button.addEventListener("click", () => {
      const content = controlContent[button.dataset.modal];
      title.textContent = content.title;
      copy.textContent = content.copy;
      list.innerHTML = Object.entries(content.items).map(([term, definition]) => `
        <div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>
      `).join("");
      dialog.showModal();
    });
  });

  $(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
}

function setupNavigation() {
  const menuButton = $(".menu-button");
  const navigation = $("#primary-navigation");

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    navigation.classList.toggle("open", !open);
  });

  $$("#primary-navigation a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  const sections = $$("main section[id]");
  const links = $$("#primary-navigation a");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => observer.observe(section));

  $("[data-action='presentation']").addEventListener("click", async () => {
    document.body.classList.toggle("presentation-mode");
    if (document.body.classList.contains("presentation-mode") && document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (_) {
        showToast("Presentation mode enabled. Full screen was not available.");
      }
    } else if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) document.body.classList.remove("presentation-mode");
  });
}

function setupRevealAndCounters() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(element => revealObserver.observe(element));

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.counter || 0);
      const prefix = element.dataset.prefix || "";
      const suffix = element.dataset.suffix || "";
      const start = performance.now();
      const duration = 1100;

      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        element.innerHTML = `${prefix}${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(element);
    });
  }, { threshold: 0.6 });

  $$("[data-counter]").forEach(element => counterObserver.observe(element));
}

function initialize() {
  setupIssueButtons();
  setupTransformButtons();
  setupDemo();
  setupGovernanceDialog();
  setupNavigation();
  setupRevealAndCounters();
}

document.addEventListener("DOMContentLoaded", initialize);
