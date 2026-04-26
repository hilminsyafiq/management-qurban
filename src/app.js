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
      {
        destination: "RT 01 Kampung Melati",
        category: "Warga",
        bags: 40,
        pic: "Pak Ahmad",
        status: "Siap dibagikan",
        recipients: [
          { name: "Bapak Hasan", contact: "RT 01", bags: 2, status: "Belum diambil" },
          { name: "Ibu Aminah", contact: "RT 01", bags: 2, status: "Sudah diambil" },
        ],
      },
      { destination: "Masjid Al-Ikhlas", category: "Mustahik", bags: 35, pic: "Bu Siti", status: "Terjadwal", recipients: [] },
      { destination: "Musholla An-Nur", category: "Mustahik", bags: 28, pic: "Pak Ridwan", status: "Menunggu pengemasan", recipients: [] },
      { destination: "Panitia lapangan", category: "Panitia", bags: 12, pic: "Koordinator", status: "Cadangan operasional", recipients: [] },
    ],
  },
  modules: {
    savers: [
      { name: "Budi Santoso", phone: "0812-7000-1000", address: "RT 02", target: "Patungan sapi", balance: "1500000" },
      { name: "Nur Aisyah", phone: "0812-7000-2000", address: "RT 04", target: "Kambing individu", balance: "900000" },
    ],
    savings: [
      { date: "2026-01-12", saver: "Budi Santoso", amount: "500000", method: "Transfer", note: "Setoran awal" },
      { date: "2026-02-12", saver: "Nur Aisyah", amount: "300000", method: "Tunai", note: "Setoran bulanan" },
    ],
    committee: [
      { name: "Ust. Rahman", role: "Ketua", phone: "0812-9000-1111", task: "Koordinasi umum" },
      { name: "Ibu Sari", role: "Bendahara", phone: "0812-9000-2222", task: "Keuangan dan laporan" },
    ],
    periods: [
      { name: "Idul Adha 1447 H", start: "2026-01-01", end: "2026-05-31", status: "Aktif" },
    ],
    transactions: [
      { date: "2026-01-12", type: "Pemasukan", category: "Tabungan", amount: "500000", note: "Setoran Budi" },
      { date: "2026-01-20", type: "Pengeluaran", category: "Operasional", amount: "250000", note: "Transport vendor" },
    ],
    meatYield: [
      { animalCode: "SP-01", carcassWeight: "238", bags: "180", note: "Sapi selesai diproses" },
      { animalCode: "KG-01", carcassWeight: "22", bags: "18", note: "Menunggu sembelih" },
    ],
    recipients: [
      { name: "RT 01 Kampung Melati", category: "Warga", bags: "40", status: "Siap dibagikan" },
      { name: "Masjid Al-Ikhlas", category: "Mustahik", bags: "35", status: "Terjadwal" },
    ],
    minutes: [
      { date: "2026-04-10", agenda: "Rapat panitia awal", decision: "Finalisasi vendor hewan", pic: "Ketua panitia" },
    ],
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
  distributionTargetForm: document.querySelector("#distributionTargetForm"),
  distributionRecipientForm: document.querySelector("#distributionRecipientForm"),
  distributionRecipientTargetSelect: document.querySelector("#distributionRecipientTargetSelect"),
  distributionTargetsTable: document.querySelector("#distributionTargetsTable"),
  distributionDestinationList: document.querySelector("#distributionDestinationList"),
  moduleSections: document.querySelector("#moduleSections"),
  adminLoginDialog: document.querySelector("#adminLoginDialog"),
  adminLoginForm: document.querySelector("#adminLoginForm"),
  adminPasswordInput: document.querySelector("#adminPasswordInput"),
  adminLoginError: document.querySelector("#adminLoginError"),
};

const moduleConfigs = {
  savers: {
    title: "Penabung kurban",
    description: "Data jamaah yang menabung untuk paket kurban.",
    fields: [
      field("name", "Nama"),
      field("phone", "Telepon", { type: "tel" }),
      field("address", "Alamat"),
      field("target", "Target paket", { type: "select", options: ["Patungan sapi", "Kambing individu", "Domba individu"] }),
      field("balance", "Saldo", { type: "number" }),
    ],
  },
  savings: {
    title: "Tabungan kurban",
    description: "Riwayat setoran tabungan kurban.",
    fields: [
      field("date", "Tanggal", { type: "date" }),
      field("saver", "Penabung"),
      field("amount", "Nominal", { type: "number" }),
      field("method", "Metode", { type: "select", options: ["Transfer", "Tunai", "QRIS"] }),
      field("note", "Catatan"),
    ],
  },
  committee: {
    title: "Pengaturan panitia",
    description: "Struktur panitia dan pembagian tugas.",
    fields: [
      field("name", "Nama"),
      field("role", "Jabatan", { type: "select", options: ["Ketua", "Sekretaris", "Bendahara", "Seksi Hewan", "Seksi Penyembelihan", "Seksi Distribusi", "Dokumentasi"] }),
      field("phone", "Telepon", { type: "tel" }),
      field("task", "Tugas", { type: "select", options: ["Koordinasi umum", "Keuangan dan laporan", "Pendataan hewan", "Pendataan peserta", "Distribusi daging", "Dokumentasi", "Logistik"] }),
    ],
  },
  periods: {
    title: "Periode kurban",
    description: "Periode pelaksanaan kurban yang aktif.",
    fields: [
      field("name", "Periode"),
      field("start", "Mulai", { type: "date" }),
      field("end", "Selesai", { type: "date" }),
      field("status", "Status", { type: "select", options: ["Draft", "Aktif", "Selesai", "Arsip"] }),
    ],
  },
  transactions: {
    title: "Transaksi",
    description: "Pemasukan dan pengeluaran operasional.",
    fields: [
      field("date", "Tanggal", { type: "date" }),
      field("type", "Tipe", { type: "select", options: ["Pemasukan", "Pengeluaran"] }),
      field("category", "Kategori", { type: "select", options: ["Tabungan", "Pembayaran qurban", "Pembelian hewan", "Operasional", "Distribusi", "Donasi", "Lainnya"] }),
      field("amount", "Nominal", { type: "number" }),
      field("note", "Catatan"),
    ],
  },
  meatYield: {
    title: "Perolehan daging",
    description: "Hasil sembelihan dan jumlah kantung.",
    fields: [
      field("animalCode", "Kode hewan"),
      field("carcassWeight", "Bobot karkas", { type: "number", step: "0.1" }),
      field("bags", "Kantung", { type: "number" }),
      field("note", "Catatan"),
    ],
  },
  recipients: {
    title: "Penerima daging",
    description: "Data penerima paket daging kurban.",
    fields: [
      field("name", "Nama/Wilayah/Masjid"),
      field("category", "Kategori", { type: "select", options: ["Warga", "Mustahik", "Masjid", "Musholla", "Peserta", "Panitia"] }),
      field("bags", "Kantung", { type: "number" }),
      field("status", "Status", { type: "select", options: ["Belum diproses", "Siap dibagikan", "Terjadwal", "Terkirim"] }),
    ],
  },
  minutes: {
    title: "Notulensi rapat",
    description: "Agenda, keputusan, dan PIC rapat panitia.",
    fields: [
      field("date", "Tanggal", { type: "date" }),
      field("agenda", "Agenda", { type: "select", options: ["Rapat awal", "Vendor hewan", "Keuangan", "Penyembelihan", "Distribusi", "Evaluasi"] }),
      field("decision", "Keputusan"),
      field("pic", "PIC"),
    ],
  },
};

function field(name, label, options = {}) {
  return { name, label, type: options.type || "text", options: options.options || [], step: options.step || "" };
}

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
  const detailedPackages = (state.distribution.targets || []).reduce((sum, target) => sum + Number(target.bags || 0), 0);
  const packages = detailedPackages || Object.entries(state.distribution)
    .filter(([key]) => !["notes", "targets"].includes(key))
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
  state.distribution.targets = (state.distribution.targets || []).map((target) => ({
    ...target,
    recipients: Array.isArray(target.recipients) ? target.recipients : [],
  }));
  Object.entries(state.distribution).forEach(([key, value]) => {
    if (key !== "targets" && els.distributionForm.elements[key]) {
      els.distributionForm.elements[key].value = value;
    }
  });
  renderDistributionTargetsTable();
  renderDistributionRecipientTargetOptions();
  renderDistributionDestinationOptions();
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
  state.distribution = {
    warga: Number(data.warga || 0),
    mustahik: Number(data.mustahik || 0),
    panitia: Number(data.panitia || 0),
    peserta: Number(data.peserta || 0),
    notes: data.notes.trim(),
    targets: state.distribution.targets || [],
  };
  render();
}

function renderDistributionTargetsTable() {
  if (!els.distributionTargetsTable) return;
  const targets = state.distribution.targets || [];
  if (!targets.length) {
    els.distributionTargetsTable.innerHTML = '<tr><td colspan="6">Belum ada tujuan distribusi rinci.</td></tr>';
    return;
  }
  els.distributionTargetsTable.innerHTML = targets.map((target, index) => `
    <tr>
      <td><strong>${escapeHtml(target.destination)}</strong></td>
      <td>${escapeHtml(target.category)}</td>
      <td>${Number(target.bags || 0)}</td>
      <td>${escapeHtml(target.pic || "-")}</td>
      <td><span class="badge">${escapeHtml(target.status || "-")}</span></td>
      <td><button class="link-btn danger" data-delete-distribution-target="${index}" type="button">Hapus</button></td>
    </tr>
    ${(target.recipients || []).map((recipient, recipientIndex) => `
      <tr class="recipient-row">
        <td colspan="2">${escapeHtml(recipient.name)} <span>${escapeHtml(recipient.contact || "")}</span></td>
        <td>${Number(recipient.bags || 0)}</td>
        <td colspan="2"><span class="badge">${escapeHtml(recipient.status || "-")}</span></td>
        <td><button class="link-btn danger" data-delete-distribution-recipient="${index}" data-recipient-index="${recipientIndex}" type="button">Hapus</button></td>
      </tr>
    `).join("")}
  `).join("");
}

function renderDistributionRecipientTargetOptions() {
  if (!els.distributionRecipientTargetSelect) return;
  const targets = state.distribution.targets || [];
  if (!targets.length) {
    els.distributionRecipientTargetSelect.innerHTML = '<option value="">Tambah tujuan dulu</option>';
    return;
  }
  els.distributionRecipientTargetSelect.innerHTML = targets.map((target, index) => {
    return `<option value="${index}">${escapeHtml(target.destination)} - ${escapeHtml(target.category)}</option>`;
  }).join("");
}

function renderDistributionDestinationOptions() {
  if (!els.distributionDestinationList) return;
  const destinations = new Set((state.distribution.targets || []).map((target) => target.destination).filter(Boolean));
  (state.modules && state.modules.recipients || []).forEach((recipient) => {
    if (recipient.name) destinations.add(recipient.name);
  });
  els.distributionDestinationList.innerHTML = [...destinations].map((destination) => `<option value="${escapeHtml(destination)}"></option>`).join("");
}

function addDistributionTarget() {
  const form = els.distributionTargetForm;
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  state.distribution.targets = state.distribution.targets || [];
  state.distribution.targets.push({
    destination: data.destination.trim(),
    category: data.category,
    bags: Number(data.bags || 0),
    pic: data.pic.trim(),
    status: data.status,
    recipients: [],
  });
  form.reset();
  render();
}

function addDistributionRecipient() {
  const form = els.distributionRecipientForm;
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const target = state.distribution.targets[Number(data.targetIndex)];
  if (!target) {
    alert("Pilih tujuan distribusi terlebih dahulu.");
    return;
  }
  target.recipients = target.recipients || [];
  target.recipients.push({
    name: data.name.trim(),
    contact: data.contact.trim(),
    bags: Number(data.bags || 0),
    status: data.status,
  });
  form.reset();
  render();
}

function deleteDistributionRecipient(targetIndex, recipientIndex) {
  const target = state.distribution.targets[targetIndex];
  if (!target || !target.recipients) return;
  target.recipients.splice(recipientIndex, 1);
  render();
}

function deleteDistributionTarget(index) {
  state.distribution.targets = state.distribution.targets || [];
  state.distribution.targets.splice(index, 1);
  render();
}

function renderModulesForm() {
  if (!els.moduleSections) return;
  ensureModuleShape();
  els.moduleSections.innerHTML = Object.entries(moduleConfigs).map(([key, config]) => {
    const rows = state.modules[key] || [];
    const fields = config.fields.map((moduleField) => `
      <label>
        ${escapeHtml(moduleField.label)}
        ${renderModuleFieldControl(moduleField)}
      </label>
    `).join("");
    const tableRows = rows.length ? rows.map((row, index) => `
      <tr>
        ${config.fields.map((moduleField) => `<td>${escapeHtml(row[moduleField.name] || "-")}</td>`).join("")}
        <td><button class="link-btn danger" data-module-delete="${escapeHtml(key)}" data-module-index="${index}" type="button">Hapus</button></td>
      </tr>
    `).join("") : `<tr><td colspan="${config.fields.length + 1}">Belum ada data.</td></tr>`;

    return `
      <section class="module-card" data-module="${escapeHtml(key)}">
        <div class="module-head">
          <div>
            <h3>${escapeHtml(config.title)}</h3>
            <p>${escapeHtml(config.description)}</p>
          </div>
          <button class="primary-btn" data-module-add="${escapeHtml(key)}" type="button">Tambah</button>
        </div>
        <form class="module-entry-form" data-module-form="${escapeHtml(key)}">
          ${fields}
        </form>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                ${config.fields.map((moduleField) => `<th>${escapeHtml(moduleField.label)}</th>`).join("")}
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </section>
    `;
  }).join("");
}

function renderModuleFieldControl(moduleField) {
  if (moduleField.type === "select") {
    return `
      <select name="${escapeHtml(moduleField.name)}" data-module-field="${escapeHtml(moduleField.name)}">
        <option value="">Pilih ${escapeHtml(moduleField.label)}</option>
        ${moduleField.options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
      </select>
    `;
  }

  const step = moduleField.step ? ` step="${escapeHtml(moduleField.step)}"` : "";
  return `<input name="${escapeHtml(moduleField.name)}" type="${escapeHtml(moduleField.type)}"${step} data-module-field="${escapeHtml(moduleField.name)}" />`;
}

function saveModules() {
  ensureModuleShape();
  render();
}

function printModuleReport(title, content) {
  const printableContent = Array.isArray(content) ? moduleRowsToText(content) : content;
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
        <pre>${escapeHtml(printableContent || "Belum ada data.")}</pre>
      </body>
    </html>
  `);
  report.document.close();
  report.print();
}

function ensureModuleShape() {
  state.modules = state.modules || structuredClone(defaultState.modules);
  Object.entries(moduleConfigs).forEach(([key, config]) => {
    if (Array.isArray(state.modules[key])) return;
    state.modules[key] = legacyModuleTextToRows(state.modules[key], config.fields);
  });
}

function legacyModuleTextToRows(value, fields) {
  if (!value) return [];
  return String(value).split(/\r?\n/).filter(Boolean).map((line) => {
    const parts = line.split("|").map((part) => part.trim());
    return fields.reduce((row, moduleField, index) => {
      row[moduleField.name] = parts[index] || "";
      return row;
    }, {});
  });
}

function moduleRowsToText(rows) {
  return rows.map((row) => Object.values(row).join(" | ")).join("\n");
}

function addModuleRecord(moduleKey) {
  const config = moduleConfigs[moduleKey];
  const form = document.querySelector(`[data-module-form="${moduleKey}"]`);
  if (!config || !form) return;

  const record = {};
  config.fields.forEach((moduleField) => {
    record[moduleField.name] = form.elements[moduleField.name] ? form.elements[moduleField.name].value.trim() : "";
  });

  if (!Object.values(record).some(Boolean)) {
    alert("Isi minimal satu field sebelum menambah data.");
    return;
  }

  ensureModuleShape();
  state.modules[moduleKey].push(record);
  render();
}

function deleteModuleRecord(moduleKey, index) {
  ensureModuleShape();
  state.modules[moduleKey].splice(index, 1);
  render();
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
document.querySelector("#addDistributionTargetBtn").addEventListener("click", addDistributionTarget);
document.querySelector("#addDistributionRecipientBtn").addEventListener("click", addDistributionRecipient);
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
  const moduleAdd = event.target.dataset.moduleAdd;
  const moduleDelete = event.target.dataset.moduleDelete;
  const moduleIndex = event.target.dataset.moduleIndex;
  const deleteDistributionTargetIndex = event.target.dataset.deleteDistributionTarget;
  const deleteDistributionRecipientTarget = event.target.dataset.deleteDistributionRecipient;
  const deleteDistributionRecipientIndex = event.target.dataset.recipientIndex;

  if (editAnimalId) openAnimalForm(editAnimalId);
  if (deleteAnimalId) deleteAnimal(deleteAnimalId);
  if (editParticipantId) openParticipantForm(editParticipantId);
  if (deleteParticipantId) deleteParticipant(deleteParticipantId);
  if (moduleAdd) addModuleRecord(moduleAdd);
  if (moduleDelete) deleteModuleRecord(moduleDelete, Number(moduleIndex));
  if (deleteDistributionTargetIndex !== undefined) deleteDistributionTarget(Number(deleteDistributionTargetIndex));
  if (deleteDistributionRecipientTarget !== undefined) deleteDistributionRecipient(Number(deleteDistributionRecipientTarget), Number(deleteDistributionRecipientIndex));
});

async function bootstrap() {
  await requireAdminLogin();
  render();
}

bootstrap();
