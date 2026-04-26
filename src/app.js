const STORAGE_KEY = "qurbanops-state-v1";
const ADMIN_SESSION_KEY = "qurbanops-admin-password";
const fallbackPhotos = {
  Sapi: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=82",
  Kambing: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1200&q=82",
  Domba: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=1200&q=82",
};

const defaultState = {
  animals: [
    {
      id: crypto.randomUUID(),
      code: "SP-01",
      type: "Sapi",
      weight: 410,
      price: 28500000,
      cost: 1600000,
      status: "paid",
      schedule: "2026-05-28T07:30",
      photoUrl: fallbackPhotos.Sapi,
      age: "2 tahun",
      location: "Kandang Masjid Al-Ikhlas",
      carcassWeight: 238,
      health: { brightEyes: true, healthyCoat: true, noDefect: true },
    },
    {
      id: crypto.randomUUID(),
      code: "KG-01",
      type: "Kambing",
      weight: 38,
      price: 3600000,
      cost: 250000,
      status: "booking",
      schedule: "2026-05-28T09:00",
      photoUrl: fallbackPhotos.Kambing,
      age: "18 bulan",
      location: "Kandang vendor",
      carcassWeight: 0,
      health: { brightEyes: true, healthyCoat: true, noDefect: true },
    },
  ],
  participants: [],
  distribution: {
    warga: 120,
    mustahik: 48,
    panitia: 20,
    peserta: 16,
    notes: "Prioritaskan mustahik dan warga sekitar masjid.",
    targets: [
      { destination: "RT 01 Kampung Melati", category: "Warga", bags: 40, pic: "Pak Ahmad", status: "Siap dibagikan" },
      { destination: "Masjid Al-Ikhlas", category: "Mustahik", bags: 35, pic: "Bu Siti", status: "Terjadwal" },
      { destination: "Musholla An-Nur", category: "Mustahik", bags: 28, pic: "Pak Ridwan", status: "Menunggu pengemasan" },
      { destination: "Panitia lapangan", category: "Panitia", bags: 12, pic: "Koordinator", status: "Cadangan operasional" },
    ],
  },
  modules: {
    savers: "Budi Santoso | 0812-7000-1000 | RT 02 | Patungan sapi | 1500000\nNur Aisyah | 0812-7000-2000 | RT 04 | Kambing individu | 900000",
    savings: "2026-01-12 | Budi Santoso | 500000 | Transfer | Setoran awal\n2026-02-12 | Nur Aisyah | 300000 | Tunai | Setoran bulanan",
    committee: "Ust. Rahman | Ketua | 0812-9000-1111 | Koordinasi umum\nIbu Sari | Bendahara | 0812-9000-2222 | Keuangan dan laporan",
    periods: "Idul Adha 1447 H | 2026-01-01 | 2026-05-31 | Aktif",
    transactions: "2026-01-12 | Pemasukan | Tabungan | 500000 | Setoran Budi\n2026-01-20 | Pengeluaran | Operasional | 250000 | Transport vendor",
    meatYield: "SP-01 | 238 kg | 180 kantung | Sapi selesai diproses\nKG-01 | 22 kg | 18 kantung | Menunggu sembelih",
    recipients: "RT 01 Kampung Melati | Warga | 40 | Siap dibagikan\nMasjid Al-Ikhlas | Mustahik | 35 | Terjadwal",
    minutes: "2026-04-10 | Rapat panitia awal | Finalisasi vendor hewan | Ketua panitia",
  },
};

defaultState.participants = [
  {
    id: crypto.randomUUID(),
    name: "Ahmad Fauzi",
    phone: "0812-1111-2222",
    address: "Jl. Melati No. 7",
    animalId: defaultState.animals[0].id,
    packageType: "Patungan sapi",
    paymentMethod: "Transfer",
    due: 4300000,
    paid: 4300000,
    token: "QBN-0001",
  },
  {
    id: crypto.randomUUID(),
    name: "Siti Aminah",
    phone: "0812-3333-4444",
    address: "Jl. Kenanga No. 12",
    animalId: defaultState.animals[0].id,
    packageType: "Patungan sapi",
    paymentMethod: "QRIS",
    due: 4300000,
    paid: 2500000,
    token: "QBN-0002",
  },
  {
    id: crypto.randomUUID(),
    name: "Ridwan Hakim",
    phone: "0812-5555-6666",
    address: "Jl. Mawar No. 3",
    animalId: defaultState.animals[1].id,
    packageType: "Kambing individu",
    paymentMethod: "Tunai",
    due: 3850000,
    paid: 1000000,
    token: "QBN-0003",
  },
];

let state = loadState();
let syncTimer = null;

const els = {
  navItems: document.querySelectorAll(".nav-item"),
  views: document.querySelectorAll(".view-panel"),
  totalAnimals: document.querySelector("#totalAnimals"),
  filledShares: document.querySelector("#filledShares"),
  paidAmount: document.querySelector("#paidAmount"),
  packageTotal: document.querySelector("#packageTotal"),
  animalBoard: document.querySelector("#animalBoard"),
  animalsTable: document.querySelector("#animalsTable"),
  participantsTable: document.querySelector("#participantsTable"),
  statusFilter: document.querySelector("#statusFilter"),
  validationList: document.querySelector("#validationList"),
  animalDialog: document.querySelector("#animalDialog"),
  participantDialog: document.querySelector("#participantDialog"),
  animalForm: document.querySelector("#animalForm"),
  participantForm: document.querySelector("#participantForm"),
  distributionForm: document.querySelector("#distributionForm"),
  modulesForm: document.querySelector("#modulesForm"),
  distributionTargetsPreview: document.querySelector("#distributionTargetsPreview"),
  adminLoginDialog: document.querySelector("#adminLoginDialog"),
  adminLoginForm: document.querySelector("#adminLoginForm"),
  adminPasswordInput: document.querySelector("#adminPasswordInput"),
  adminLoginError: document.querySelector("#adminLoginError"),
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(defaultState);

  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleRemoteSync();
}

function getApiBaseUrl() {
  return window.QURBAN_CONFIG && window.QURBAN_CONFIG.apiBaseUrl ? window.QURBAN_CONFIG.apiBaseUrl : "";
}

function canUseRemoteApi() {
  return getApiBaseUrl() && location.protocol !== "file:";
}

function getAdminPassword() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) || "";
}

function setAdminPassword(password) {
  sessionStorage.setItem(ADMIN_SESSION_KEY, password);
}

function clearAdminPassword() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function getAdminHeaders() {
  const password = getAdminPassword();
  return password ? { "X-Admin-Password": password } : {};
}

async function loadRemoteState() {
  if (!canUseRemoteApi()) return false;

  try {
    const response = await fetch(`${getApiBaseUrl()}?action=state`, {
      headers: { Accept: "application/json", ...getAdminHeaders() },
    });
    const data = await response.json();
    if (!response.ok || data.ok === false) throw new Error(data.error || "Gagal memuat data backend.");

    state = {
      animals: Array.isArray(data.animals) ? data.animals : [],
      participants: Array.isArray(data.participants) ? data.participants : [],
      distribution: data.distribution || structuredClone(defaultState.distribution),
      modules: data.modules || structuredClone(defaultState.modules),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    return false;
  }
}

function scheduleRemoteSync() {
  if (!canUseRemoteApi()) return;
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(syncRemoteState, 450);
}

async function syncRemoteState() {
  try {
    await fetch(getApiBaseUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAdminHeaders(),
      },
      body: JSON.stringify({
        action: "syncState",
        payload: state,
      }),
    });
  } catch (error) {
    // Local data remains available when the backend is temporarily unreachable.
  }
}

async function verifyAdminPassword(password) {
  if (!canUseRemoteApi()) return Boolean(password.trim());

  const response = await fetch(`${getApiBaseUrl()}?action=state`, {
    headers: {
      Accept: "application/json",
      "X-Admin-Password": password,
    },
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) throw new Error(data.error || "Password admin salah.");

  state = {
    animals: Array.isArray(data.animals) ? data.animals : [],
    participants: Array.isArray(data.participants) ? data.participants : [],
    distribution: data.distribution || structuredClone(defaultState.distribution),
    modules: data.modules || structuredClone(defaultState.modules),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return true;
}

function unlockAdmin() {
  document.body.classList.remove("admin-locked");
  if (els.adminLoginDialog && els.adminLoginDialog.open) els.adminLoginDialog.close();
}

async function requireAdminLogin() {
  if (!els.adminLoginDialog) return;
  if (getAdminPassword()) {
    try {
      await verifyAdminPassword(getAdminPassword());
      unlockAdmin();
      return;
    } catch {
      clearAdminPassword();
    }
  }
  els.adminLoginDialog.showModal();
}

function money(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function shareLimit(type) {
  return type === "Sapi" ? 7 : 1;
}

function statusLabel(status) {
  const labels = {
    booking: "Booking",
    paid: "Lunas",
    slaughtered: "Disembelih",
    distributed: "Distribusi",
  };
  return labels[status] || status;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function participantsFor(animalId) {
  return state.participants.filter((participant) => participant.animalId === animalId);
}

function render() {
  renderSummary();
  renderAnimalBoard();
  renderAnimalsTable();
  renderParticipantsTable();
  renderDistributionForm();
  renderModulesForm();
  renderValidation();
  fillAnimalOptions();
  saveState();
}

function renderSummary() {
  const totalCapacity = state.animals.reduce((sum, animal) => sum + shareLimit(animal.type), 0);
  const filled = state.participants.length;
  const paid = state.participants.reduce((sum, participant) => sum + Number(participant.paid || 0), 0);
  const packages = Object.entries(state.distribution)
    .filter(([key]) => !["notes", "targets", "targetsText"].includes(key))
    .reduce((sum, [, value]) => sum + Number(value || 0), 0);

  els.totalAnimals.textContent = state.animals.length;
  els.filledShares.textContent = `${filled}/${totalCapacity}`;
  els.paidAmount.textContent = money(paid);
  els.packageTotal.textContent = packages;
}

function renderAnimalBoard() {
  const filter = els.statusFilter.value;
  const animals = filter === "all" ? state.animals : state.animals.filter((animal) => animal.status === filter);

  if (!animals.length) {
    els.animalBoard.innerHTML = '<div class="empty">Belum ada hewan untuk filter ini.</div>';
    return;
  }

  els.animalBoard.innerHTML = animals
    .map((animal) => {
      const members = participantsFor(animal.id);
      const capacity = shareLimit(animal.type);
      const percent = Math.min(100, (members.length / capacity) * 100);
      return `
        <article class="animal-card">
          <div>
            <div class="code">${escapeHtml(animal.code)}</div>
            <div class="meta">${escapeHtml(animal.type)} - ${animal.weight} kg</div>
          </div>
          <div>
            <strong>${members.length}/${capacity} peserta</strong>
            <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
          </div>
          <div>
            <div>${money(Number(animal.price) + Number(animal.cost))}</div>
            <div class="meta">${escapeHtml(formatSchedule(animal.schedule))}</div>
          </div>
          <span class="badge">${escapeHtml(statusLabel(animal.status))}</span>
        </article>
      `;
    })
    .join("");
}

function renderAnimalsTable() {
  if (!state.animals.length) {
    els.animalsTable.innerHTML = '<tr><td colspan="7">Belum ada data hewan.</td></tr>';
    return;
  }

  els.animalsTable.innerHTML = state.animals
    .map((animal) => {
      const members = participantsFor(animal.id);
      return `
        <tr>
          <td><strong>${escapeHtml(animal.code)}</strong></td>
          <td>${escapeHtml(animal.type)}</td>
          <td>${animal.weight} kg</td>
          <td>${money(animal.price)}</td>
          <td>${members.length}/${shareLimit(animal.type)}</td>
          <td><span class="badge">${escapeHtml(statusLabel(animal.status))}</span></td>
          <td>
            <div class="row-actions">
              <button class="link-btn" data-edit-animal="${animal.id}" type="button">Edit</button>
              <button class="link-btn danger" data-delete-animal="${animal.id}" type="button">Hapus</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderParticipantsTable() {
  if (!state.participants.length) {
    els.participantsTable.innerHTML = '<tr><td colspan="9">Belum ada peserta qurban.</td></tr>';
    return;
  }

  els.participantsTable.innerHTML = state.participants
    .map((participant) => {
      const animal = state.animals.find((item) => item.id === participant.animalId);
      const remaining = Number(participant.due) - Number(participant.paid);
      const className = remaining <= 0 ? "" : "warn";
      return `
        <tr>
          <td><strong>${escapeHtml(participant.token || "-")}</strong></td>
          <td><strong>${escapeHtml(participant.name)}</strong></td>
          <td>${escapeHtml(participant.phone)}</td>
          <td>${escapeHtml(participant.address || "-")}</td>
          <td>${animal ? escapeHtml(animal.code) : "Tidak ada"}</td>
          <td>${money(participant.due)}</td>
          <td>${money(participant.paid)}</td>
          <td><span class="badge ${className}">${remaining <= 0 ? "Lunas" : `Kurang ${money(remaining)}`}</span></td>
          <td>
            <div class="row-actions">
              <button class="link-btn" data-edit-participant="${participant.id}" type="button">Edit</button>
              <button class="link-btn danger" data-delete-participant="${participant.id}" type="button">Hapus</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderDistributionForm() {
  Object.entries(state.distribution).forEach(([key, value]) => {
    if (key !== "targets" && els.distributionForm.elements[key]) {
      els.distributionForm.elements[key].value = value;
    }
  });
  els.distributionForm.elements.targetsText.value = distributionTargetsToText(state.distribution.targets || []);
  renderDistributionTargetsPreview();
}

function renderValidation() {
  const issues = [];

  state.animals.forEach((animal) => {
    const count = participantsFor(animal.id).length;
    const capacity = shareLimit(animal.type);
    if (count > capacity) issues.push(`${animal.code} melebihi kuota ${capacity} peserta.`);
    if (count === 0) issues.push(`${animal.code} belum punya peserta.`);
    if (!animal.schedule) issues.push(`${animal.code} belum punya jadwal sembelih.`);
    if (!animal.location) issues.push(`${animal.code} belum punya lokasi penitipan.`);
    if (!isAnimalHealthy(animal)) issues.push(`${animal.code} belum lolos checklist kesehatan.`);
  });

  state.participants.forEach((participant) => {
    if (Number(participant.paid) < Number(participant.due)) {
      issues.push(`${participant.name} belum melunasi iuran.`);
    }
  });

  if (!state.animals.length) issues.push("Belum ada hewan qurban yang dicatat.");
  if (!state.participants.length) issues.push("Belum ada peserta qurban yang dicatat.");

  if (!issues.length) {
    els.validationList.innerHTML = '<div class="validation-item good">Semua data utama sudah aman untuk pelaksanaan.</div>';
    return;
  }

  els.validationList.innerHTML = issues.map((issue) => `<div class="validation-item">${escapeHtml(issue)}</div>`).join("");
}

function fillAnimalOptions() {
  const selected = els.participantForm.elements.animalId.value;
  els.participantForm.elements.animalId.innerHTML = state.animals
    .map((animal) => `<option value="${animal.id}">${escapeHtml(animal.code)} - ${escapeHtml(animal.type)}</option>`)
    .join("");
  if (selected) els.participantForm.elements.animalId.value = selected;
}

function isAnimalHealthy(animal) {
  return Boolean(animal.health && animal.health.brightEyes && animal.health.healthyCoat && animal.health.noDefect);
}

function formatSchedule(value) {
  if (!value) return "Belum dijadwalkan";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function openAnimalForm(animalId) {
  const form = els.animalForm;
  form.reset();
  setPhotoPreview("");
  document.querySelector("#animalDialogTitle").textContent = animalId ? "Edit hewan" : "Tambah hewan";

  if (animalId) {
    const animal = state.animals.find((item) => item.id === animalId);
    Object.entries(animal).forEach(([key, value]) => {
      if (key === "health" && value) {
        form.elements.brightEyes.checked = Boolean(value.brightEyes);
        form.elements.healthyCoat.checked = Boolean(value.healthyCoat);
        form.elements.noDefect.checked = Boolean(value.noDefect);
      } else if (form.elements[key]) {
        form.elements[key].value = value;
      }
    });
    setPhotoPreview(animal.photoUrl);
  } else {
    form.elements.id.value = "";
    form.elements.status.value = "booking";
    form.elements.code.value = nextAnimalCode();
    form.elements.brightEyes.checked = true;
    form.elements.healthyCoat.checked = true;
    form.elements.noDefect.checked = true;
    form.elements.photoUrl.value = fallbackPhotos[form.elements.type.value] || fallbackPhotos.Sapi;
    setPhotoPreview(form.elements.photoUrl.value);
  }

  els.animalDialog.showModal();
}

function openParticipantForm(participantId) {
  const form = els.participantForm;
  form.reset();
  fillAnimalOptions();
  document.querySelector("#participantDialogTitle").textContent = participantId ? "Edit peserta" : "Tambah peserta";

  if (participantId) {
    const participant = state.participants.find((item) => item.id === participantId);
    Object.entries(participant).forEach(([key, value]) => {
      if (form.elements[key]) form.elements[key].value = value;
    });
  } else {
    form.elements.id.value = "";
    form.elements.token.value = nextParticipantToken();
    form.elements.due.value = suggestDue(form.elements.animalId.value);
    form.elements.paid.value = 0;
  }

  els.participantDialog.showModal();
}

async function saveAnimal() {
  const form = els.animalForm;
  if (!form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form));
  const uploadedPhoto = await readCompressedPhoto(document.querySelector("#animalPhotoFile").files[0]);
  const animal = {
    id: data.id || crypto.randomUUID(),
    code: data.code.trim().toUpperCase(),
    type: data.type,
    weight: Number(data.weight),
    price: Number(data.price),
    cost: Number(data.cost),
    status: data.status,
    schedule: data.schedule,
    age: data.age.trim(),
    location: data.location.trim(),
    carcassWeight: Number(data.carcassWeight || 0),
    photoUrl: uploadedPhoto || data.photoUrl || fallbackPhotos[data.type] || fallbackPhotos.Sapi,
    health: {
      brightEyes: data.brightEyes === "on",
      healthyCoat: data.healthyCoat === "on",
      noDefect: data.noDefect === "on",
    },
  };

  const index = state.animals.findIndex((item) => item.id === animal.id);
  if (index >= 0) state.animals[index] = animal;
  else state.animals.push(animal);

  els.animalDialog.close();
  render();
}

function setPhotoPreview(src) {
  const preview = document.querySelector("#animalPhotoPreview");
  if (!preview) return;
  preview.src = src || "";
  preview.hidden = !src;
}

function readCompressedPhoto(file) {
  if (!file) return Promise.resolve("");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 900;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function saveParticipant() {
  const form = els.participantForm;
  if (!form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form));
  const animal = state.animals.find((item) => item.id === data.animalId);
  const existingShares = participantsFor(data.animalId).filter((item) => item.id !== data.id).length;

  if (animal && existingShares >= shareLimit(animal.type)) {
    alert(`Kuota ${animal.code} sudah penuh.`);
    return;
  }

  const participant = {
    id: data.id || crypto.randomUUID(),
    token: data.token || nextParticipantToken(),
    name: data.name.trim(),
    phone: data.phone.trim(),
    address: data.address.trim(),
    animalId: data.animalId,
    packageType: data.packageType,
    paymentMethod: data.paymentMethod,
    due: Number(data.due),
    paid: Number(data.paid),
  };

  const index = state.participants.findIndex((item) => item.id === participant.id);
  if (index >= 0) state.participants[index] = participant;
  else state.participants.push(participant);

  els.participantDialog.close();
  render();
}

function saveDistribution() {
  const data = Object.fromEntries(new FormData(els.distributionForm));
  const targets = parseDistributionTargets(data.targetsText);
  state.distribution = {
    warga: Number(data.warga || 0),
    mustahik: Number(data.mustahik || 0),
    panitia: Number(data.panitia || 0),
    peserta: Number(data.peserta || 0),
    notes: data.notes.trim(),
    targets,
  };
  render();
}

function parseDistributionTargets(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [destination = "", category = "", bags = "0", pic = "", status = ""] = line.split("|").map((part) => part.trim());
      return {
        destination,
        category,
        bags: Number(bags || 0),
        pic,
        status,
      };
    });
}

function distributionTargetsToText(targets) {
  return (targets || [])
    .map((target) => `${target.destination || ""} | ${target.category || ""} | ${Number(target.bags || 0)} | ${target.pic || ""} | ${target.status || ""}`)
    .join("\n");
}

function renderDistributionTargetsPreview() {
  if (!els.distributionTargetsPreview) return;
  const targets = parseDistributionTargets(els.distributionForm.elements.targetsText.value);
  if (!targets.length) {
    els.distributionTargetsPreview.innerHTML = '<div class="empty">Belum ada tujuan distribusi rinci.</div>';
    return;
  }
  els.distributionTargetsPreview.innerHTML = targets.map((target) => `
    <div class="target-row">
      <strong>${escapeHtml(target.destination)}</strong>
      <span>${escapeHtml(target.category)} - ${Number(target.bags || 0)} kantung</span>
      <small>${escapeHtml(target.pic || "-")} / ${escapeHtml(target.status || "-")}</small>
    </div>
  `).join("");
}

function renderModulesForm() {
  if (!els.modulesForm) return;
  const modules = state.modules || {};
  Object.entries(modules).forEach(([key, value]) => {
    if (els.modulesForm.elements[key]) els.modulesForm.elements[key].value = value;
  });
}

function saveModules() {
  const data = Object.fromEntries(new FormData(els.modulesForm));
  state.modules = {
    savers: data.savers || "",
    savings: data.savings || "",
    committee: data.committee || "",
    periods: data.periods || "",
    transactions: data.transactions || "",
    meatYield: data.meatYield || "",
    recipients: data.recipients || "",
    minutes: data.minutes || "",
  };
  render();
}

function printModuleReport(title, content) {
  const report = window.open("", "_blank", "width=900,height=700");
  if (!report) return;
  report.document.write(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #1b1a17; }
          h1 { margin: 0 0 18px; }
          pre { white-space: pre-wrap; border: 1px solid #ddd; padding: 18px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <pre>${escapeHtml(content || "Belum ada data.")}</pre>
      </body>
    </html>
  `);
  report.document.close();
  report.print();
}

function deleteAnimal(animalId) {
  if (participantsFor(animalId).length) {
    alert("Hewan masih punya peserta. Pindahkan atau hapus peserta dulu.");
    return;
  }
  state.animals = state.animals.filter((animal) => animal.id !== animalId);
  render();
}

function deleteParticipant(participantId) {
  state.participants = state.participants.filter((participant) => participant.id !== participantId);
  render();
}

function nextAnimalCode() {
  const number = String(state.animals.length + 1).padStart(2, "0");
  return `SP-${number}`;
}

function nextParticipantToken() {
  const nextNumber = state.participants.reduce((max, participant) => {
    const match = String(participant.token || "").match(/QBN-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `QBN-${String(nextNumber).padStart(4, "0")}`;
}

function suggestDue(animalId) {
  const animal = state.animals.find((item) => item.id === animalId);
  if (!animal) return 0;
  return Math.ceil((Number(animal.price) + Number(animal.cost)) / shareLimit(animal.type));
}

document.querySelector("#openAnimalFormBtn").addEventListener("click", () => openAnimalForm());
document.querySelector("#openAnimalFormBtn2").addEventListener("click", () => openAnimalForm());
document.querySelector("#openParticipantFormBtn").addEventListener("click", () => openParticipantForm());
document.querySelector("#saveAnimalBtn").addEventListener("click", saveAnimal);
document.querySelector("#saveParticipantBtn").addEventListener("click", saveParticipant);
document.querySelector("#saveDistributionBtn").addEventListener("click", saveDistribution);
document.querySelector("#saveModulesBtn").addEventListener("click", saveModules);
document.querySelector("#printSavingsBtn").addEventListener("click", () => printModuleReport("Laporan Tabungan Kurban", state.modules && state.modules.savings));
document.querySelector("#printTransactionsBtn").addEventListener("click", () => printModuleReport("Laporan Transaksi Kurban", state.modules && state.modules.transactions));
document.querySelector("#printMeatYieldBtn").addEventListener("click", () => printModuleReport("Laporan Perolehan Daging Kurban", state.modules && state.modules.meatYield));
document.querySelector("#resetDemoBtn").addEventListener("click", () => {
  state = structuredClone(defaultState);
  render();
});
els.adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.adminLoginError.textContent = "";
  const password = els.adminPasswordInput.value;

  try {
    await verifyAdminPassword(password);
    setAdminPassword(password);
    unlockAdmin();
    render();
  } catch (error) {
    els.adminLoginError.textContent = error.message || "Password admin salah.";
  }
});

els.statusFilter.addEventListener("change", renderAnimalBoard);
els.animalForm.elements.type.addEventListener("change", (event) => {
  if (!els.animalForm.elements.photoUrl.value) {
    els.animalForm.elements.photoUrl.value = fallbackPhotos[event.target.value] || fallbackPhotos.Sapi;
    setPhotoPreview(els.animalForm.elements.photoUrl.value);
  }
});
els.animalForm.elements.photoUrl.addEventListener("input", (event) => setPhotoPreview(event.target.value));
document.querySelector("#animalPhotoFile").addEventListener("change", async (event) => {
  const preview = await readCompressedPhoto(event.target.files[0]);
  setPhotoPreview(preview);
});
els.distributionForm.elements.targetsText.addEventListener("input", renderDistributionTargetsPreview);
els.participantForm.elements.animalId.addEventListener("change", (event) => {
  els.participantForm.elements.due.value = suggestDue(event.target.value);
});

els.navItems.forEach((item) => {
  item.addEventListener("click", () => {
    els.navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");
    els.views.forEach((view) => view.classList.remove("active"));
    document.querySelector(`#${item.dataset.view}View`).classList.add("active");
  });
});

document.addEventListener("click", (event) => {
  const editAnimalId = event.target.dataset.editAnimal;
  const deleteAnimalId = event.target.dataset.deleteAnimal;
  const editParticipantId = event.target.dataset.editParticipant;
  const deleteParticipantId = event.target.dataset.deleteParticipant;

  if (editAnimalId) openAnimalForm(editAnimalId);
  if (deleteAnimalId) deleteAnimal(deleteAnimalId);
  if (editParticipantId) openParticipantForm(editParticipantId);
  if (deleteParticipantId) deleteParticipant(deleteParticipantId);
});

async function bootstrap() {
  await requireAdminLogin();
  render();
}

bootstrap();
