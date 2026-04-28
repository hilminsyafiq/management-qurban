const STORAGE_KEY = "qurbanops-state-v1";
const ADMIN_SESSION_KEY = "qurbanops-admin-password";
const ACCOUNT_SESSION_KEY = "qurbanops-active-account";
const fallbackPhotos = {
  Sapi: "assets/animal-sapi.svg",
  Kambing: "assets/animal-kambing.svg",
  Domba: "assets/animal-domba.svg",
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
    slaughterQueue: [
      { animalCode: "SP-01", batch: "1", order: "1", status: "Siap dipotong", note: "Batch pagi" },
      { animalCode: "KG-01", batch: "1", order: "2", status: "Menunggu giliran", note: "Setelah sapi" },
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
    appSettings: {
      institutionName: "Masjid Al-Ikhlas",
      qurbanYear: "1447 H / 2026",
      address: "Jl. Melati, Kelurahan Sukamaju",
      contact: "0812-9000-1111",
      bagsPerCoupon: 1,
      appStatus: "Persiapan",
      notes: "Kupon hanya dapat dipakai satu kali saat pembagian daging.",
    },
    areas: [
      { id: crypto.randomUUID(), name: "RT 01 Kampung Melati", coordinator: "Pak Ahmad", quota: 40, notes: "Prioritas warga sekitar masjid" },
      { id: crypto.randomUUID(), name: "RT 02 Kampung Melati", coordinator: "Bu Aminah", quota: 35, notes: "Distribusi setelah zuhur" },
    ],
    users: [
      { id: crypto.randomUUID(), name: "Admin Qurban", username: "admin", password: "admin123", role: "Admin", phone: "0812-9000-1111", status: "Aktif" },
      { id: crypto.randomUUID(), name: "Bendahara Qurban", username: "bendahara", password: "bendahara123", role: "Bendahara", phone: "0812-9000-2223", status: "Aktif" },
      { id: crypto.randomUUID(), name: "Koordinator Distribusi", username: "distribusi", password: "distribusi123", role: "Distribusi", phone: "0812-9000-2224", status: "Aktif" },
      { id: crypto.randomUUID(), name: "Petugas Scan", username: "scanner", password: "scanner123", role: "Scanner", phone: "0812-9000-2222", status: "Aktif" },
      { id: crypto.randomUUID(), name: "Panitia Lapangan", username: "panitia", password: "panitia123", role: "Panitia", phone: "0812-9000-2225", status: "Aktif" },
    ],
    coupons: [],
    scanHistory: [],
    auditLog: [],
    profile: {
      name: "Admin Qurban",
      phone: "0812-9000-1111",
      status: "Aktif",
    },
  },
  meta: {
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: "system",
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
    bookingStatus: "Validasi sukses",
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
    bookingStatus: "Menunggu validasi",
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
    bookingStatus: "Menunggu validasi",
  },
];

let state = loadState();
let syncTimer = null;
let activeRole = "admin";
let scannerStream = null;
let scannerTimer = null;
let scannerDetector = null;
let scannerBusy = false;
let lastLoadedVersion = Number(state.meta && state.meta.version || 1);
const ROLE_LABELS = {
  admin: "Admin penuh",
  bendahara: "Bendahara",
  distribusi: "Distribusi",
  scanner: "Scanner",
  panitia: "Panitia",
};

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
  roleButtons: document.querySelectorAll("[data-role-switch]"),
  activeRoleNote: document.querySelector("#activeRoleNote"),
  opsStats: document.querySelector("#opsStats"),
  recentScanTable: document.querySelector("#recentScanTable"),
  couponStatusList: document.querySelector("#couponStatusList"),
  settingsForm: document.querySelector("#settingsForm"),
  areaForm: document.querySelector("#areaForm"),
  areasTable: document.querySelector("#areasTable"),
  userForm: document.querySelector("#userForm"),
  usersTable: document.querySelector("#usersTable"),
  couponGenerateForm: document.querySelector("#couponGenerateForm"),
  couponAreaSelect: document.querySelector("#couponAreaSelect"),
  couponsTable: document.querySelector("#couponsTable"),
  scanForm: document.querySelector("#scanForm"),
  scanOfficerSelect: document.querySelector("#scanOfficerSelect"),
  scanResult: document.querySelector("#scanResult"),
  scannerVideo: document.querySelector("#scannerVideo"),
  scannerStatus: document.querySelector("#scannerStatus"),
  scannerCameraPanel: document.querySelector("#scannerCameraPanel"),
  startScannerBtn: document.querySelector("#startScannerBtn"),
  stopScannerBtn: document.querySelector("#stopScannerBtn"),
  scanHistoryTable: document.querySelector("#scanHistoryTable"),
  reportStats: document.querySelector("#reportStats"),
  reportsTable: document.querySelector("#reportsTable"),
  auditLogTable: document.querySelector("#auditLogTable"),
  couponImportFile: document.querySelector("#couponImportFile"),
  profileForm: document.querySelector("#profileForm"),
  adminLoginDialog: document.querySelector("#adminLoginDialog"),
  adminLoginForm: document.querySelector("#adminLoginForm"),
  adminUsernameInput: document.querySelector("#adminUsernameInput"),
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
      field("saver", "Penabung", { type: "select", source: "savers" }),
      field("amount", "Nominal", { type: "number" }),
      field("method", "Metode", { type: "select", options: ["Transfer", "Tunai", "QRIS"] }),
      field("note", "Catatan"),
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
  slaughterQueue: {
    title: "Antrian pemotongan",
    description: "Atur hewan yang siap dipotong per batch dan urutan kerja.",
    fields: [
      field("animalCode", "Kode hewan", { type: "select", source: "animals" }),
      field("batch", "Batch", { type: "number" }),
      field("order", "Urutan", { type: "number" }),
      field("status", "Status", { type: "select", options: ["Menunggu giliran", "Siap dipotong", "Proses potong", "Selesai potong"] }),
      field("note", "Catatan"),
    ],
  },
  meatYield: {
    title: "Perolehan daging",
    description: "Hasil sembelihan dan jumlah kantung.",
    fields: [
      field("animalCode", "Kode hewan", { type: "select", source: "slaughterQueue" }),
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
  return {
    name,
    label,
    type: options.type || "text",
    options: options.options || [],
    source: options.source || "",
    step: options.step || "",
  };
}

function normalizeRecipientKey(name, category) {
  return `${String(name || "").trim().toLowerCase()}|${String(category || "").trim().toLowerCase()}`;
}

function moduleRecipientFromTarget(target) {
  return {
    name: String(target.destination || "").trim(),
    category: target.category || "Warga",
    bags: String(Number(target.bags || 0)),
    status: target.status || "Belum diproses",
  };
}

function syncDistributionRecipientsModule() {
  state.distribution = state.distribution || structuredClone(defaultState.distribution);
  state.distribution.targets = Array.isArray(state.distribution.targets) ? state.distribution.targets : [];
  state.modules = state.modules || structuredClone(defaultState.modules);
  state.modules.recipients = Array.isArray(state.modules.recipients) ? state.modules.recipients : [];

  const targetKeys = new Set(state.distribution.targets.map((target) => normalizeRecipientKey(target.destination, target.category)));
  state.modules.recipients.forEach((recipient) => {
    const key = normalizeRecipientKey(recipient.name, recipient.category);
    if (!recipient.name || targetKeys.has(key)) return;
    state.distribution.targets.push({
      destination: String(recipient.name || "").trim(),
      category: recipient.category || "Warga",
      bags: Number(recipient.bags || 0),
      pic: "",
      status: recipient.status || "Belum diproses",
      recipients: [],
    });
    targetKeys.add(key);
  });

  const mergedTargets = new Map();
  state.distribution.targets.forEach((target) => {
    const normalized = {
      ...target,
      destination: String(target.destination || "").trim(),
      category: target.category || "Warga",
      bags: Number(target.bags || 0),
      status: target.status || "Belum diproses",
      recipients: Array.isArray(target.recipients) ? target.recipients : [],
    };
    if (!normalized.destination) return;
    const key = normalizeRecipientKey(normalized.destination, normalized.category);
    if (!mergedTargets.has(key)) {
      mergedTargets.set(key, normalized);
      return;
    }
    const existing = mergedTargets.get(key);
    existing.bags = Number(existing.bags || 0) || Number(normalized.bags || 0);
    existing.pic = existing.pic || normalized.pic || "";
    existing.status = existing.status || normalized.status;
    existing.recipients = [...existing.recipients, ...normalized.recipients];
  });
  state.distribution.targets = [...mergedTargets.values()];
  state.modules.recipients = state.distribution.targets.map(moduleRecipientFromTarget);
}

function ensureOpsShape() {
  ensureModuleShape();
  const defaults = defaultState.modules;
  state.meta = { ...(defaultState.meta || {}), ...(state.meta || {}) };
  state.modules.appSettings = { ...defaults.appSettings, ...(state.modules.appSettings || {}) };
  state.modules.profile = { ...defaults.profile, ...(state.modules.profile || {}) };
  ["areas", "users", "coupons", "scanHistory", "auditLog"].forEach((key) => {
    if (!Array.isArray(state.modules[key])) state.modules[key] = structuredClone(defaults[key]);
  });
  state.modules.users = state.modules.users.map((user, index) => ({
    ...user,
    username: user.username || String(user.role || "").toLowerCase() || `user${index + 1}`,
    password: user.password || `${normalizeRole(user.role || "panitia")}123`,
    status: user.status || "Aktif",
  }));
  defaultState.modules.users.forEach((defaultUser) => {
    const hasUser = state.modules.users.some((user) => String(user.username || "").toLowerCase() === defaultUser.username);
    if (!hasUser) state.modules.users.push(structuredClone(defaultUser));
  });
  syncDistributionRecipientsModule();
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
  const current = readStoredState();
  const currentVersion = Number(current && current.meta && current.meta.version || 0);
  const stateVersion = Number(state.meta && state.meta.version || 0);
  if (currentVersion > stateVersion && !window.confirm("Data di perangkat ini sudah berubah dari tab lain. Tetap simpan dan timpa perubahan terbaru?")) {
    state = current;
    lastLoadedVersion = currentVersion;
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  lastLoadedVersion = Number(state.meta && state.meta.version || lastLoadedVersion);
  scheduleRemoteSync();
}

function readStoredState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function toIsoTimestamp(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).trim() : date.toISOString();
}

function toDateOnly(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return text;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toLocalDateTime(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text)) return text.slice(0, 16);
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return text;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function normalizeDatePayload(value) {
  if (Array.isArray(value)) return value.map(normalizeDatePayload);
  if (!value || typeof value !== "object" || value instanceof Date) return value;

  return Object.fromEntries(Object.entries(value).map(([key, item]) => {
    if (["createdAt", "updatedAt", "scannedAt", "at"].includes(key)) return [key, toIsoTimestamp(item)];
    if (key === "schedule") return [key, toLocalDateTime(item)];
    if (["date", "start", "end"].includes(key)) return [key, toDateOnly(item)];
    return [key, normalizeDatePayload(item)];
  }));
}

function makeSyncPayload() {
  return normalizeDatePayload(structuredClone(state));
}

function markDataChange(action, detail = "") {
  ensureOpsShape();
  const account = getActiveAccount() || makeMasterAccount("admin");
  const nextVersion = Math.max(Number(state.meta.version || 0), lastLoadedVersion) + 1;
  state.meta = {
    version: nextVersion,
    updatedAt: new Date().toISOString(),
    updatedBy: account.username || account.name || "admin",
  };
  state.modules.auditLog = state.modules.auditLog || [];
  state.modules.auditLog.unshift({
    id: crypto.randomUUID(),
    at: state.meta.updatedAt,
    user: account.name || account.username || "Admin Qurban",
    username: account.username || "admin",
    role: account.role || "Admin",
    action,
    detail,
    version: nextVersion,
  });
  state.modules.auditLog = state.modules.auditLog.slice(0, 500);
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
  sessionStorage.removeItem(ACCOUNT_SESSION_KEY);
}

function getActiveAccount() {
  try {
    return JSON.parse(sessionStorage.getItem(ACCOUNT_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function setActiveAccount(account) {
  sessionStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify({
    id: account.id || "",
    name: account.name || "",
    username: account.username || "",
    role: account.role || "Panitia",
    phone: account.phone || "",
    status: account.status || "Aktif",
  }));
}

function getAdminHeaders() {
  const password = getAdminPassword();
  const account = getActiveAccount();
  const headers = {};
  if (password) headers["X-Admin-Password"] = password;
  if (account && account.username && password) {
    headers["X-Login-Username"] = account.username;
    headers["X-Login-Password"] = password;
  }
  return headers;
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
      meta: data.meta || { ...defaultState.meta, version: Date.now() },
    };
    lastLoadedVersion = Number(state.meta && state.meta.version || 1);
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
    const response = await fetch(getApiBaseUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...getAdminHeaders(),
      },
      body: JSON.stringify({
        action: "syncState",
        payload: makeSyncPayload(),
        baseVersion: lastLoadedVersion,
      }),
    });
    const data = await response.json();
    if (data && data.conflict && data.state) {
      alert("Sinkronisasi ditahan karena ada perubahan dari panitia lain. Data terbaru akan dimuat agar tidak saling menimpa.");
      state = {
        animals: Array.isArray(data.state.animals) ? data.state.animals : [],
        participants: Array.isArray(data.state.participants) ? data.state.participants : [],
        distribution: data.state.distribution || structuredClone(defaultState.distribution),
        modules: data.state.modules || structuredClone(defaultState.modules),
        meta: data.state.meta || { ...defaultState.meta, version: Date.now() },
      };
      lastLoadedVersion = Number(state.meta && state.meta.version || 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      render();
    }
  } catch (error) {
    // Local data remains available when the backend is temporarily unreachable.
  }
}

async function verifyAdminPassword(password, username = "") {
  if (!canUseRemoteApi()) {
    ensureOpsShape();
    return findLocalAccount(username, password) || (password.trim() ? makeMasterAccount(username) : null);
  }

  const response = await fetch(`${getApiBaseUrl()}?action=state`, {
    headers: {
      Accept: "application/json",
      "X-Admin-Password": password,
      "X-Login-Username": username,
      "X-Login-Password": password,
    },
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) throw new Error(data.error || "Akun atau password salah.");

  state = {
    animals: Array.isArray(data.animals) ? data.animals : [],
    participants: Array.isArray(data.participants) ? data.participants : [],
    distribution: data.distribution || structuredClone(defaultState.distribution),
    modules: data.modules || structuredClone(defaultState.modules),
    meta: data.meta || { ...defaultState.meta, version: Date.now() },
  };
  lastLoadedVersion = Number(state.meta && state.meta.version || 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  ensureOpsShape();
  return findLocalAccount(username, password) || makeMasterAccount(username);
}

function unlockAdmin() {
  document.body.classList.remove("admin-locked");
  if (els.adminLoginDialog && els.adminLoginDialog.open) els.adminLoginDialog.close();
}

async function requireAdminLogin() {
  if (!els.adminLoginDialog) return;
  if (getAdminPassword()) {
    try {
      const account = await verifyAdminPassword(getAdminPassword(), getActiveAccount() && getActiveAccount().username);
      setActiveAccount(account);
      activeRole = normalizeRole(account.role);
      unlockAdmin();
      return;
    } catch {
      clearAdminPassword();
    }
  }
  els.adminLoginDialog.showModal();
}

function normalizeRole(role) {
  const normalized = String(role || "").trim().toLowerCase();
  if (["admin", "bendahara", "distribusi", "scanner", "panitia"].includes(normalized)) return normalized;
  if (normalized.includes("bendahara")) return "bendahara";
  if (normalized.includes("distribusi")) return "distribusi";
  if (normalized.includes("scan")) return "scanner";
  return normalized === "admin penuh" ? "admin" : "panitia";
}

function makeMasterAccount(username) {
  const name = username && username.trim() ? username.trim() : "Admin Qurban";
  return { id: "master", name, username: username || "admin", role: "Admin", phone: "", status: "Aktif" };
}

function findLocalAccount(username, password) {
  const normalizedUsername = String(username || "").trim().toLowerCase();
  const normalizedPassword = String(password || "");
  return (state.modules.users || []).find((user) => {
    return String(user.status || "Aktif") === "Aktif"
      && String(user.username || "").trim().toLowerCase() === normalizedUsername
      && String(user.password || "") === normalizedPassword;
  }) || null;
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

function participantShareUnits(participant, animal) {
  const type = animal ? animal.type : state.animals.find((item) => item.id === participant.animalId)?.type;
  if (type === "Sapi" && participant.packageType === "Sapi penuh keluarga") return 7;
  return 1;
}

function usedShareUnits(animalId, excludeParticipantId = "") {
  return participantsFor(animalId)
    .filter((participant) => String(participant.id) !== String(excludeParticipantId || ""))
    .reduce((sum, participant) => {
      const animal = state.animals.find((item) => item.id === participant.animalId);
      return sum + participantShareUnits(participant, animal);
    }, 0);
}

function packageShareUnits(packageType, animal) {
  if (animal && animal.type === "Sapi" && packageType === "Sapi penuh keluarga") return 7;
  return 1;
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

function normalizeDuplicateValue(value) {
  return String(value || "").trim().toLowerCase();
}

function render() {
  ensureOpsShape();
  applyRoleAccess();
  renderSummary();
  renderOpsDashboard();
  renderSettingsForm();
  renderAreasTable();
  renderUsersTable();
  renderCouponsView();
  renderScanView();
  renderScanHistory();
  renderReportsView();
  renderAuditLog();
  renderProfileForm();
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
  const filled = state.participants.reduce((sum, participant) => {
    const animal = state.animals.find((item) => item.id === participant.animalId);
    return sum + participantShareUnits(participant, animal);
  }, 0);
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

function getAreaName(areaId) {
  const area = state.modules.areas.find((item) => item.id === areaId);
  return area ? area.name : "Tanpa wilayah";
}

function couponStats() {
  const coupons = state.modules.coupons;
  const used = coupons.filter((coupon) => coupon.status === "Sudah diterima").length;
  return {
    total: coupons.length,
    used,
    remaining: Math.max(0, coupons.length - used),
    general: coupons.filter((coupon) => coupon.category === "Umum").length,
    participant: coupons.filter((coupon) => coupon.category === "Pengkurban").length,
  };
}

function renderStatCards(target, stats) {
  if (!target) return;
  target.innerHTML = stats.map((stat) => `
    <article class="metric">
      <span>${escapeHtml(stat.label)}</span>
      <strong>${escapeHtml(stat.value)}</strong>
    </article>
  `).join("");
}

function renderOpsDashboard() {
  const stats = couponStats();
  renderStatCards(els.opsStats, [
    { label: "Total kupon", value: stats.total },
    { label: "Sudah diterima", value: stats.used },
    { label: "Belum diambil", value: stats.remaining },
    { label: "Wilayah aktif", value: state.modules.areas.length },
  ]);

  if (els.recentScanTable) {
    const rows = state.modules.scanHistory.slice(-5).reverse();
    els.recentScanTable.innerHTML = rows.length ? rows.map((scan) => `
      <tr>
        <td>${escapeHtml(formatDateTime(scan.scannedAt))}</td>
        <td><strong>${escapeHtml(scan.couponCode)}</strong></td>
        <td>${escapeHtml(scan.recipientName || "-")}</td>
        <td>${escapeHtml(scan.officer || "-")}</td>
        <td><span class="badge ${scan.status === "Ditolak" ? "danger" : ""}">${escapeHtml(scan.status)}</span></td>
      </tr>
    `).join("") : '<tr><td colspan="5">Belum ada aktivitas scan.</td></tr>';
  }

  if (els.couponStatusList) {
    els.couponStatusList.innerHTML = [
      `Kupon umum: ${stats.general}`,
      `Kupon pengkurban: ${stats.participant}`,
      `Kupon belum diambil: ${stats.remaining}`,
    ].map((item) => `<div class="validation-item good">${escapeHtml(item)}</div>`).join("");
  }
}

function renderSettingsForm() {
  if (!els.settingsForm) return;
  const settings = state.modules.appSettings;
  Object.entries(settings).forEach(([key, value]) => {
    if (els.settingsForm.elements[key]) els.settingsForm.elements[key].value = value;
  });
}

function renderAreasTable() {
  if (!els.areasTable) return;
  const coupons = state.modules.coupons;
  els.areasTable.innerHTML = state.modules.areas.length ? state.modules.areas.map((area) => {
    const count = coupons.filter((coupon) => coupon.areaId === area.id).length;
    return `
      <tr>
        <td><strong>${escapeHtml(area.name)}</strong></td>
        <td>${escapeHtml(area.coordinator || "-")}</td>
        <td>${Number(area.quota || 0)}</td>
        <td>${count}</td>
        <td>${escapeHtml(area.notes || "-")}</td>
        <td><button class="link-btn danger" data-delete-area="${escapeHtml(area.id)}" type="button">Hapus</button></td>
      </tr>
    `;
  }).join("") : '<tr><td colspan="6">Belum ada wilayah distribusi.</td></tr>';
}

function renderUsersTable() {
  if (!els.usersTable) return;
  els.usersTable.innerHTML = state.modules.users.length ? state.modules.users.map((user) => `
    <tr>
      <td><strong>${escapeHtml(user.name)}</strong></td>
      <td>${escapeHtml(user.username || "-")}</td>
      <td>${escapeHtml(user.role)}</td>
      <td>${escapeHtml(user.phone || "-")}</td>
      <td><span class="badge ${user.status === "Nonaktif" ? "danger" : ""}">${escapeHtml(user.status)}</span></td>
      <td>
        <div class="row-actions">
          <button class="link-btn" data-edit-user="${escapeHtml(user.id)}" type="button">Edit</button>
          <button class="link-btn danger" data-delete-user="${escapeHtml(user.id)}" type="button">Hapus</button>
        </div>
      </td>
    </tr>
  `).join("") : '<tr><td colspan="6">Belum ada user.</td></tr>';
}

function renderCouponsView() {
  if (els.couponAreaSelect) {
    els.couponAreaSelect.innerHTML = state.modules.areas.map((area) => `<option value="${escapeHtml(area.id)}">${escapeHtml(area.name)}</option>`).join("");
  }
  if (!els.couponsTable) return;
  els.couponsTable.innerHTML = state.modules.coupons.length ? state.modules.coupons.map((coupon) => `
    <tr>
      <td><strong>${escapeHtml(coupon.code)}</strong></td>
      <td>${escapeHtml(coupon.recipientName || "Kupon umum")}</td>
      <td>${escapeHtml(getAreaName(coupon.areaId))}</td>
      <td>${escapeHtml(coupon.category)}</td>
      <td><span class="badge ${coupon.status === "Sudah diterima" ? "" : "warn"}">${escapeHtml(coupon.status)}</span></td>
      <td>
        <div class="row-actions">
          <button class="link-btn" data-print-coupon="${escapeHtml(coupon.id)}" type="button">Cetak</button>
          <button class="link-btn danger" data-delete-coupon="${escapeHtml(coupon.id)}" type="button">Hapus</button>
        </div>
      </td>
    </tr>
  `).join("") : '<tr><td colspan="6">Belum ada kupon.</td></tr>';
}

function renderScanView() {
  if (!els.scanOfficerSelect) return;
  const users = state.modules.users.filter((user) => user.status === "Aktif");
  const account = getActiveAccount();
  const currentOfficer = els.scanOfficerSelect.value || (account && account.name) || "";
  els.scanOfficerSelect.innerHTML = users.map((user) => `<option value="${escapeHtml(user.name)}">${escapeHtml(user.name)} - ${escapeHtml(user.role)}</option>`).join("");
  if (currentOfficer && [...els.scanOfficerSelect.options].some((option) => option.value === currentOfficer)) {
    els.scanOfficerSelect.value = currentOfficer;
  }
}

function renderScanHistory() {
  if (!els.scanHistoryTable) return;
  els.scanHistoryTable.innerHTML = state.modules.scanHistory.length ? state.modules.scanHistory.slice().reverse().map((scan) => `
    <tr>
      <td>${escapeHtml(formatDateTime(scan.scannedAt))}</td>
      <td><strong>${escapeHtml(scan.couponCode)}</strong></td>
      <td>${escapeHtml(scan.recipientName || "-")}</td>
      <td>${escapeHtml(scan.areaName || "-")}</td>
      <td>${escapeHtml(scan.officer || "-")}</td>
      <td><span class="badge ${scan.status === "Ditolak" ? "danger" : ""}">${escapeHtml(scan.status)}</span></td>
    </tr>
  `).join("") : '<tr><td colspan="6">Belum ada riwayat scan.</td></tr>';
}

function renderAuditLog() {
  if (!els.auditLogTable) return;
  const logs = state.modules.auditLog || [];
  els.auditLogTable.innerHTML = logs.length ? logs.map((log) => `
    <tr>
      <td>${escapeHtml(formatDateTime(log.at))}</td>
      <td><strong>${escapeHtml(log.user || log.username || "-")}</strong></td>
      <td>${escapeHtml(log.role || "-")}</td>
      <td>${escapeHtml(log.action || "-")}</td>
      <td>${escapeHtml(log.detail || "-")}</td>
    </tr>
  `).join("") : '<tr><td colspan="5">Belum ada perubahan data.</td></tr>';
}

function renderReportsView() {
  const stats = couponStats();
  renderStatCards(els.reportStats, [
    { label: "Total kupon", value: stats.total },
    { label: "Terverifikasi", value: stats.used },
    { label: "Sisa kupon", value: stats.remaining },
    { label: "Paket daging", value: els.packageTotal ? els.packageTotal.textContent : 0 },
  ]);

  if (els.reportsTable) {
    els.reportsTable.innerHTML = state.modules.areas.length ? state.modules.areas.map((area) => {
      const coupons = state.modules.coupons.filter((coupon) => coupon.areaId === area.id);
      const used = coupons.filter((coupon) => coupon.status === "Sudah diterima").length;
      return `
        <tr>
          <td><strong>${escapeHtml(area.name)}</strong></td>
          <td>${Number(area.quota || 0)}</td>
          <td>${coupons.length}</td>
          <td>${used}</td>
          <td>${Math.max(0, coupons.length - used)}</td>
        </tr>
      `;
    }).join("") : '<tr><td colspan="5">Belum ada wilayah untuk laporan.</td></tr>';
  }
  renderScanHistory();
}

function renderProfileForm() {
  if (!els.profileForm) return;
  const account = getActiveAccount();
  els.profileForm.elements.name.value = account ? account.name : state.modules.profile.name || "";
  els.profileForm.elements.username.value = account ? account.username : "";
  els.profileForm.elements.phone.value = account ? account.phone : state.modules.profile.phone || "";
  els.profileForm.elements.role.value = activeRole === "admin" ? "Admin" : "Panitia";
  els.profileForm.elements.status.value = account ? account.status : state.modules.profile.status || "Aktif";
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
      const filledUnits = usedShareUnits(animal.id);
      const capacity = shareLimit(animal.type);
      const percent = Math.min(100, (filledUnits / capacity) * 100);
      return `
        <article class="animal-card">
          <div>
            <div class="code">${escapeHtml(animal.code)}</div>
            <div class="meta">${escapeHtml(animal.type)} - ${animal.weight} kg</div>
          </div>
          <div>
            <strong>${filledUnits}/${capacity} slot</strong>
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
      return `
        <tr>
          <td><strong>${escapeHtml(animal.code)}</strong></td>
          <td>${escapeHtml(animal.type)}</td>
          <td>${animal.weight} kg</td>
          <td>${money(animal.price)}</td>
          <td>${usedShareUnits(animal.id)}/${shareLimit(animal.type)}</td>
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
    els.participantsTable.innerHTML = '<tr><td colspan="10">Belum ada peserta qurban.</td></tr>';
    return;
  }

  els.participantsTable.innerHTML = state.participants
    .map((participant) => {
      const animal = state.animals.find((item) => item.id === participant.animalId);
      const remaining = Number(participant.due) - Number(participant.paid);
      const className = remaining <= 0 ? "" : "warn";
      const bookingStatus = participant.bookingStatus || "Menunggu validasi";
      const validationClass = bookingStatus === "Validasi sukses" ? "" : bookingStatus === "Ditolak" ? "danger" : "warn";
      return `
        <tr>
          <td><strong>${escapeHtml(participant.token || "-")}</strong></td>
          <td><strong>${escapeHtml(participant.name)}</strong></td>
          <td>${escapeHtml(participant.phone)}</td>
          <td>${escapeHtml(participant.address || "-")}</td>
          <td>${animal ? escapeHtml(animal.code) : "Tidak ada"}</td>
          <td>${money(participant.due)}</td>
          <td>${money(participant.paid)}</td>
          <td><span class="badge ${validationClass}">${escapeHtml(bookingStatus)}</span></td>
          <td><span class="badge ${className}">${remaining <= 0 ? "Lunas" : `Kurang ${money(remaining)}`}</span></td>
          <td>
            <div class="row-actions">
              <button class="link-btn" data-validate-participant="${participant.id}" type="button">Validasi</button>
              <button class="link-btn danger" data-reject-participant="${participant.id}" type="button">Tolak</button>
              <button class="link-btn" data-edit-participant="${participant.id}" type="button">Edit</button>
              <button class="link-btn" data-print-participant="${participant.id}" type="button">Cetak</button>
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
    const count = usedShareUnits(animal.id);
    const capacity = shareLimit(animal.type);
    if (count > capacity) issues.push(`${animal.code} melebihi kuota ${capacity} slot.`);
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
  updateParticipantPackageOptions();
}

function getPackageOptionsForAnimal(animal) {
  if (!animal) return [];
  if (animal.type === "Sapi") {
    return [
      { value: "Patungan sapi", label: "Patungan sapi (1/7 bagian)" },
      { value: "Sapi penuh keluarga", label: "Sapi penuh keluarga (1 ekor)" },
    ];
  }
  return [{ value: `${animal.type} individu`, label: `${animal.type} individu (1 ekor)` }];
}

function updateParticipantPackageOptions(selectedPackage = "") {
  const form = els.participantForm;
  if (!form || !form.elements.packageType) return;
  const animal = state.animals.find((item) => item.id === form.elements.animalId.value);
  const current = selectedPackage || form.elements.packageType.value;
  const options = getPackageOptionsForAnimal(animal);
  form.elements.packageType.innerHTML = options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join("");
  if (options.some((option) => option.value === current)) form.elements.packageType.value = current;
  form.elements.due.value = suggestDue(form.elements.animalId.value, form.elements.packageType.value);
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

function formatDateTime(value) {
  if (!value) return "-";
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
    form.elements.code.value = nextAnimalCode(form.elements.type.value);
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
    form.elements.bookingStatus.value = participant.bookingStatus || "Menunggu validasi";
  } else {
    form.elements.id.value = "";
    form.elements.token.value = nextParticipantToken();
    form.elements.due.value = suggestDue(form.elements.animalId.value);
    form.elements.paid.value = 0;
    form.elements.bookingStatus.value = "Menunggu validasi";
  }
  updateParticipantPackageOptions(form.elements.packageType.value);

  els.participantDialog.showModal();
}

async function saveAnimal() {
  const form = els.animalForm;
  if (!form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form));
  const normalizedCode = (data.code.trim() || nextAnimalCode(data.type)).toUpperCase();
  const duplicateCode = state.animals.some((animal) => animal.id !== data.id && String(animal.code || "").toUpperCase() === normalizedCode);
  if (duplicateCode) {
    form.elements.code.setCustomValidity("Kode hewan sudah dipakai. Gunakan kode lain.");
    form.elements.code.reportValidity();
    form.elements.code.setCustomValidity("");
    return;
  }

  const uploadedPhoto = await readCompressedPhoto(document.querySelector("#animalPhotoFile").files[0]);
  const animal = {
    id: data.id || crypto.randomUUID(),
    code: normalizedCode,
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
  markDataChange(index >= 0 ? "Update hewan" : "Tambah hewan", `${animal.code} - ${animal.type}`);
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
  const duplicateToken = state.participants.some((participant) => {
    return String(participant.id) !== String(data.id || "")
      && normalizeDuplicateValue(participant.token) === normalizeDuplicateValue(data.token);
  });
  if (duplicateToken) {
    form.elements.token.setCustomValidity("Nomor invoice/token sudah dipakai.");
    form.elements.token.reportValidity();
    form.elements.token.setCustomValidity("");
    return;
  }
  const duplicateParticipant = state.participants.some((participant) => {
    return String(participant.id) !== String(data.id || "")
      && normalizeDuplicateValue(participant.name) === normalizeDuplicateValue(data.name)
      && normalizeDuplicateValue(participant.phone) === normalizeDuplicateValue(data.phone)
      && String(participant.animalId) === String(data.animalId);
  });
  if (duplicateParticipant) {
    form.elements.name.setCustomValidity("Peserta ini sudah terdaftar pada hewan yang sama.");
    form.elements.name.reportValidity();
    form.elements.name.setCustomValidity("");
    return;
  }
  const existingShares = usedShareUnits(data.animalId, data.id);
  const requestedShares = packageShareUnits(data.packageType, animal);

  if (animal && existingShares + requestedShares > shareLimit(animal.type)) {
    alert(`Kuota ${animal.code} sudah penuh.`);
    return;
  }

  if (Number(data.paid || 0) > Number(data.due || 0)) {
    form.elements.paid.setCustomValidity("Pembayaran tidak boleh lebih besar dari iuran wajib.");
    form.elements.paid.reportValidity();
    form.elements.paid.setCustomValidity("");
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
    bookingStatus: data.bookingStatus || "Menunggu validasi",
  };

  const index = state.participants.findIndex((item) => item.id === participant.id);
  if (index >= 0) state.participants[index] = participant;
  else state.participants.push(participant);

  els.participantDialog.close();
  markDataChange(index >= 0 ? "Update peserta" : "Tambah peserta", `${participant.token} - ${participant.name}`);
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
  markDataChange("Update distribusi", "Ringkasan paket distribusi diperbarui.");
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

function getDistributionDestinationNames() {
  const destinations = new Set();
  (state.modules && state.modules.areas || []).forEach((area) => {
    if (area.name) destinations.add(area.name);
  });
  (state.distribution.targets || []).forEach((target) => {
    if (target.destination) destinations.add(target.destination);
  });
  (state.modules && state.modules.recipients || []).forEach((recipient) => {
    if (recipient.name) destinations.add(recipient.name);
  });
  return [...destinations];
}

function renderDistributionDestinationOptions() {
  if (!els.distributionDestinationList) return;
  const destinations = getDistributionDestinationNames();
  const placeholder = destinations.length ? "Pilih wilayah" : "Tambah wilayah dulu";
  els.distributionDestinationList.innerHTML = `<option value="">${escapeHtml(placeholder)}</option>`
    + destinations.map((destination) => `<option value="${escapeHtml(destination)}">${escapeHtml(destination)}</option>`).join("");
}

function addDistributionTarget() {
  const form = els.distributionTargetForm;
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  state.distribution.targets = state.distribution.targets || [];
  const destination = data.destination.trim();
  const existingTarget = state.distribution.targets.find((target) => normalizeRecipientKey(target.destination, target.category) === normalizeRecipientKey(destination, data.category));
  if (existingTarget) {
    existingTarget.bags = Number(data.bags || 0);
    existingTarget.pic = data.pic.trim();
    existingTarget.status = data.status;
    existingTarget.recipients = Array.isArray(existingTarget.recipients) ? existingTarget.recipients : [];
  } else {
    state.distribution.targets.push({
      destination,
      category: data.category,
      bags: Number(data.bags || 0),
      pic: data.pic.trim(),
      status: data.status,
      recipients: [],
    });
  }
  syncDistributionRecipientsModule();
  form.reset();
  markDataChange(existingTarget ? "Update tujuan distribusi" : "Tambah tujuan distribusi", destination);
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
  syncDistributionRecipientsModule();
  form.reset();
  markDataChange("Tambah penerima distribusi", `${data.name.trim()} - ${target.destination}`);
  render();
}

function deleteDistributionRecipient(targetIndex, recipientIndex) {
  const target = state.distribution.targets[targetIndex];
  if (!target || !target.recipients) return;
  if (!window.confirm("Hapus penerima ini dari daftar distribusi?")) return;
  const removed = target.recipients[recipientIndex];
  target.recipients.splice(recipientIndex, 1);
  syncDistributionRecipientsModule();
  markDataChange("Hapus penerima distribusi", removed ? removed.name : `Index ${recipientIndex}`);
  render();
}

function deleteDistributionTarget(index) {
  state.distribution.targets = state.distribution.targets || [];
  if (!window.confirm("Hapus tujuan distribusi ini beserta penerima di bawahnya?")) return;
  const removed = state.distribution.targets[index];
  state.distribution.targets.splice(index, 1);
  if (removed && state.modules && Array.isArray(state.modules.recipients)) {
    const removedKey = normalizeRecipientKey(removed.destination, removed.category);
    state.modules.recipients = state.modules.recipients.filter((recipient) => normalizeRecipientKey(recipient.name, recipient.category) !== removedKey);
  }
  syncDistributionRecipientsModule();
  markDataChange("Hapus tujuan distribusi", removed ? removed.destination : `Index ${index}`);
  render();
}

function renderModulesForm() {
  if (!els.moduleSections) return;
  ensureModuleShape();
  const entries = Object.entries(moduleConfigs);
  const tabButtons = entries.map(([key, config], index) => `
    <button class="workflow-tab ${index === 0 ? "active" : ""}" data-module-tab="${escapeHtml(key)}" type="button">${escapeHtml(config.title)}</button>
  `).join("");
  const moduleCards = entries.map(([key, config], index) => {
    const rows = state.modules[key] || [];
    const fields = config.fields.map((moduleField) => `
      <label>
        ${escapeHtml(moduleField.label)}
        ${renderModuleFieldControl(moduleField)}
        ${moduleField.type === "number" ? "<small>Isi angka tanpa titik atau koma.</small>" : ""}
      </label>
    `).join("");
    const tableRows = rows.length ? rows.map((row, index) => `
      <tr>
        ${config.fields.map((moduleField) => `<td>${escapeHtml(row[moduleField.name] || "-")}</td>`).join("")}
        <td>
          <div class="row-actions">
            <button class="link-btn" data-module-edit="${escapeHtml(key)}" data-module-index="${index}" type="button">Edit</button>
            <button class="link-btn danger" data-module-delete="${escapeHtml(key)}" data-module-index="${index}" type="button">Hapus</button>
          </div>
        </td>
      </tr>
    `).join("") : `<tr><td colspan="${config.fields.length + 1}">Belum ada data.</td></tr>`;

    return `
      <section class="module-card ${index === 0 ? "active" : ""}" data-module="${escapeHtml(key)}">
        <div class="module-head">
          <div>
            <h3>${escapeHtml(config.title)}</h3>
            <p>${escapeHtml(config.description)}</p>
          </div>
          <button class="primary-btn" data-module-add="${escapeHtml(key)}" type="button">Tambah</button>
        </div>
        <form class="module-entry-form" data-module-form="${escapeHtml(key)}">
          <input name="__editIndex" type="hidden" value="" />
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

  els.moduleSections.innerHTML = `
    <div class="workflow-tabs module-tabs" aria-label="Pilih modul teknis">
      ${tabButtons}
    </div>
    ${moduleCards}
  `;
}

function renderModuleFieldControl(moduleField) {
  if (moduleField.type === "select") {
    const options = getModuleFieldOptions(moduleField);
    const placeholder = moduleField.source === "savers" && !options.length ? "Tambah penabung dulu" : `Pilih ${moduleField.label}`;
    return `
      <select name="${escapeHtml(moduleField.name)}" data-module-field="${escapeHtml(moduleField.name)}" required>
        <option value="">${escapeHtml(placeholder)}</option>
        ${options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
      </select>
    `;
  }

  const step = moduleField.step ? ` step="${escapeHtml(moduleField.step)}"` : "";
  const numericAttrs = moduleField.type === "number" ? ` min="0" max="999999999" inputmode="numeric"` : "";
  const textAttrs = moduleField.type === "text" || moduleField.type === "tel" ? ` maxlength="100"` : "";
  return `<input name="${escapeHtml(moduleField.name)}" type="${escapeHtml(moduleField.type)}"${step}${numericAttrs}${textAttrs} data-module-field="${escapeHtml(moduleField.name)}" required />`;
}

function getModuleFieldOptions(moduleField) {
  if (moduleField.source === "savers") {
    return (state.modules.savers || [])
      .map((saver) => saver.name)
      .filter(Boolean);
  }
  if (moduleField.source === "animals") {
    return (state.animals || [])
      .map((animal) => animal.code)
      .filter(Boolean);
  }
  if (moduleField.source === "slaughterQueue") {
    const allowedStatuses = new Set(["Siap dipotong", "Proses potong", "Selesai potong"]);
    const queuedCodes = (state.modules.slaughterQueue || [])
      .filter((item) => allowedStatuses.has(item.status))
      .sort((a, b) => Number(a.batch || 0) - Number(b.batch || 0) || Number(a.order || 0) - Number(b.order || 0))
      .map((item) => item.animalCode)
      .filter(Boolean);
    const alreadyRecorded = new Set((state.modules.meatYield || []).map((item) => item.animalCode).filter(Boolean));
    return queuedCodes.filter((code, index) => queuedCodes.indexOf(code) === index && !alreadyRecorded.has(code));
  }
  return moduleField.options || [];
}

function saveModules() {
  ensureModuleShape();
  markDataChange("Simpan modul teknis", "Data modul teknis diperiksa dan disimpan.");
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

function printParticipantCards(participantIds) {
  const ids = Array.isArray(participantIds) ? participantIds : [];
  const participants = ids.length
    ? state.participants.filter((participant) => ids.includes(participant.id))
    : state.participants;

  if (!participants.length) {
    alert("Belum ada peserta untuk dicetak.");
    return;
  }

  const settings = state.modules && state.modules.appSettings ? state.modules.appSettings : {};
  const title = `Kartu Peserta Qurban - ${settings.institutionName || "QurbanOps"}`;
  const cards = participants.map((participant) => renderParticipantCard(participant, settings)).join("");
  const report = window.open("", "_blank", "width=960,height=720");
  if (!report) return;

  report.document.write(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: A4; margin: 12mm; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            color: #1b1a17;
            font-family: Arial, sans-serif;
            background: #fff;
          }
          .sheet {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10mm;
          }
          .card {
            min-height: 86mm;
            border: 1.4px solid #153d34;
            border-radius: 8px;
            padding: 12px;
            display: grid;
            grid-template-rows: auto 1fr auto;
            gap: 10px;
            break-inside: avoid;
          }
          .head {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            border-bottom: 1px solid #ddd4c3;
            padding-bottom: 8px;
          }
          .brand { font-size: 12px; color: #706b62; text-transform: uppercase; font-weight: 700; }
          h1 { margin: 3px 0 0; font-size: 18px; }
          .token {
            border: 1px solid #153d34;
            border-radius: 6px;
            padding: 8px;
            text-align: center;
            min-width: 92px;
          }
          .token span { display: block; font-size: 10px; color: #706b62; text-transform: uppercase; }
          .token strong { display: block; margin-top: 2px; font-size: 18px; letter-spacing: 1px; }
          dl {
            display: grid;
            grid-template-columns: 88px 1fr;
            gap: 7px 10px;
            margin: 0;
            font-size: 12px;
          }
          dt { color: #706b62; font-weight: 700; }
          dd { margin: 0; font-weight: 700; }
          .foot {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: end;
            border-top: 1px dashed #b9aa91;
            padding-top: 8px;
            font-size: 11px;
            color: #706b62;
          }
          .signature {
            width: 110px;
            text-align: center;
          }
          .line {
            height: 28px;
            border-bottom: 1px solid #706b62;
            margin-bottom: 4px;
          }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <main class="sheet">${cards}</main>
      </body>
    </html>
  `);
  report.document.close();
  report.focus();
  report.print();
}

function renderParticipantCard(participant, settings) {
  const animal = state.animals.find((item) => item.id === participant.animalId);
  const totalDue = Number(participant.due || 0);
  const totalPaid = Number(participant.paid || 0);
  const paymentStatus = totalPaid >= totalDue ? "Lunas" : `Kurang ${money(totalDue - totalPaid)}`;
  return `
    <article class="card">
      <div class="head">
        <div>
          <div class="brand">${escapeHtml(settings.institutionName || "QurbanOps")}</div>
          <h1>Kartu Peserta Qurban</h1>
          <div class="brand">${escapeHtml(settings.qurbanYear || "Idul Adha")}</div>
        </div>
        <div class="token">
          <span>Token</span>
          <strong>${escapeHtml(participant.token || "-")}</strong>
        </div>
      </div>
      <dl>
        <dt>Nama</dt><dd>${escapeHtml(participant.name || "-")}</dd>
        <dt>Telepon</dt><dd>${escapeHtml(participant.phone || "-")}</dd>
        <dt>Alamat</dt><dd>${escapeHtml(participant.address || "-")}</dd>
        <dt>Paket</dt><dd>${escapeHtml(participant.packageType || "-")}</dd>
        <dt>Hewan</dt><dd>${animal ? `${escapeHtml(animal.code)} - ${escapeHtml(animal.type)}` : "Belum dipilih"}</dd>
        <dt>Iuran</dt><dd>${money(totalDue)}</dd>
        <dt>Status</dt><dd>${escapeHtml(paymentStatus)}</dd>
      </dl>
      <div class="foot">
        <div>
          <strong>Catatan</strong><br />
          Tunjukkan kartu ini saat konfirmasi panitia atau pengambilan bagian peserta.
        </div>
        <div class="signature">
          <div class="line"></div>
          Panitia
        </div>
      </div>
    </article>
  `;
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
  if (!form.reportValidity()) return;
  const editIndex = form.elements.__editIndex ? Number(form.elements.__editIndex.value) : -1;

  const record = {};
  config.fields.forEach((moduleField) => {
    record[moduleField.name] = form.elements[moduleField.name] ? form.elements[moduleField.name].value.trim() : "";
  });

  if (!Object.values(record).some(Boolean)) {
    alert("Isi minimal satu field sebelum menambah data.");
    return;
  }

  ensureModuleShape();
  if (isDuplicateModuleRecord(moduleKey, record, editIndex)) {
    alert("Data yang sama sudah ada di modul ini.");
    return;
  }
  if (Number.isInteger(editIndex) && editIndex >= 0 && state.modules[moduleKey][editIndex]) {
    state.modules[moduleKey][editIndex] = record;
  } else {
    state.modules[moduleKey].push(record);
  }
  applyModuleRecordSideEffects(moduleKey, record);
  markDataChange(
    Number.isInteger(editIndex) && editIndex >= 0 ? "Update data modul" : "Tambah data modul",
    `${moduleConfigs[moduleKey].title}: ${Object.values(record).find(Boolean) || "record baru"}`,
  );
  render();
}

function isDuplicateModuleRecord(moduleKey, record, editIndex = -1) {
  const config = moduleConfigs[moduleKey];
  if (!config) return false;
  if (["slaughterQueue", "meatYield"].includes(moduleKey)) {
    return (state.modules[moduleKey] || []).some((item, index) => {
      return index !== editIndex
        && normalizeDuplicateValue(item.animalCode) === normalizeDuplicateValue(record.animalCode);
    });
  }
  const fields = config.fields.map((moduleField) => moduleField.name);
  return (state.modules[moduleKey] || []).some((item, index) => {
    if (index === editIndex) return false;
    return fields.every((fieldName) => normalizeDuplicateValue(item[fieldName]) === normalizeDuplicateValue(record[fieldName]));
  });
}

function applyModuleRecordSideEffects(moduleKey, record) {
  if (moduleKey === "slaughterQueue") {
    const animal = state.animals.find((item) => String(item.code || "").toUpperCase() === String(record.animalCode || "").toUpperCase());
    if (animal && record.status === "Selesai potong") animal.status = "slaughtered";
    return;
  }
  if (moduleKey === "meatYield") {
    const animal = state.animals.find((item) => String(item.code || "").toUpperCase() === String(record.animalCode || "").toUpperCase());
    if (!animal) return;
    animal.carcassWeight = Number(record.carcassWeight || animal.carcassWeight || 0);
    if (animal.status === "booking" || animal.status === "paid") {
      animal.status = "slaughtered";
    }
    const queue = (state.modules.slaughterQueue || []).find((item) => String(item.animalCode || "").toUpperCase() === String(record.animalCode || "").toUpperCase());
    if (queue) queue.status = "Selesai potong";
  }
}

function editModuleRecord(moduleKey, index) {
  const config = moduleConfigs[moduleKey];
  const form = document.querySelector(`[data-module-form="${moduleKey}"]`);
  const record = state.modules[moduleKey] && state.modules[moduleKey][index];
  if (!config || !form || !record) return;
  activateModuleTab(moduleKey);
  if (form.elements.__editIndex) form.elements.__editIndex.value = String(index);
  config.fields.forEach((moduleField) => {
    if (form.elements[moduleField.name]) form.elements[moduleField.name].value = record[moduleField.name] || "";
  });
  const addButton = document.querySelector(`[data-module-add="${moduleKey}"]`);
  if (addButton) addButton.textContent = "Simpan";
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteModuleRecord(moduleKey, index) {
  if (!window.confirm("Hapus data modul ini? Data akan hilang dari penyimpanan lokal.")) return;
  ensureModuleShape();
  const removed = state.modules[moduleKey][index];
  state.modules[moduleKey].splice(index, 1);
  markDataChange("Hapus data modul", `${moduleConfigs[moduleKey].title}: ${removed ? Object.values(removed).find(Boolean) : index}`);
  render();
}

function deleteAnimal(animalId) {
  if (participantsFor(animalId).length) {
    alert("Hewan masih punya peserta. Pindahkan atau hapus peserta dulu.");
    return;
  }
  if (!window.confirm("Hapus data hewan ini? Data akan hilang dari penyimpanan lokal.")) return;
  const removed = state.animals.find((animal) => animal.id === animalId);
  state.animals = state.animals.filter((animal) => animal.id !== animalId);
  markDataChange("Hapus hewan", removed ? removed.code : animalId);
  render();
}

function deleteParticipant(participantId) {
  if (!window.confirm("Hapus data peserta ini? Data akan hilang dari penyimpanan lokal.")) return;
  const removed = state.participants.find((participant) => participant.id === participantId);
  state.participants = state.participants.filter((participant) => participant.id !== participantId);
  markDataChange("Hapus peserta", removed ? `${removed.token} - ${removed.name}` : participantId);
  render();
}

function setParticipantValidation(participantId, bookingStatus) {
  const participant = state.participants.find((item) => item.id === participantId);
  if (!participant) return;
  participant.bookingStatus = bookingStatus;
  markDataChange("Validasi booking", `${participant.token || "-"} - ${participant.name}: ${bookingStatus}`);
  render();
}

function animalCodePrefix(type) {
  if (type === "Kambing") return "KG";
  if (type === "Domba") return "DM";
  return "SP";
}

function nextAnimalCode(type = "Sapi") {
  const prefix = animalCodePrefix(type);
  const nextNumber = state.animals.reduce((max, animal) => {
    const match = String(animal.code || "").toUpperCase().match(new RegExp(`^${prefix}-(\\d+)$`));
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `${prefix}-${String(nextNumber).padStart(2, "0")}`;
}

function nextParticipantToken() {
  const nextNumber = state.participants.reduce((max, participant) => {
    const match = String(participant.token || "").match(/QBN-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `QBN-${String(nextNumber).padStart(4, "0")}`;
}

function suggestDue(animalId, packageType = "") {
  const animal = state.animals.find((item) => item.id === animalId);
  if (!animal) return 0;
  const total = Number(animal.price) + Number(animal.cost);
  return packageShareUnits(packageType, animal) >= shareLimit(animal.type) ? total : Math.ceil(total / shareLimit(animal.type));
}

function saveSettings() {
  const data = Object.fromEntries(new FormData(els.settingsForm));
  state.modules.appSettings = {
    institutionName: data.institutionName.trim(),
    qurbanYear: data.qurbanYear.trim(),
    address: data.address.trim(),
    contact: data.contact.trim(),
    bagsPerCoupon: Number(data.bagsPerCoupon || 1),
    appStatus: data.appStatus,
    notes: data.notes.trim(),
  };
  markDataChange("Update pengaturan", state.modules.appSettings.institutionName);
  render();
}

function addArea() {
  if (!els.areaForm.reportValidity()) return;
  const data = Object.fromEntries(new FormData(els.areaForm));
  const duplicateArea = state.modules.areas.some((area) => String(area.name || "").trim().toLowerCase() === data.name.trim().toLowerCase());
  if (duplicateArea) {
    els.areaForm.elements.name.setCustomValidity("Nama wilayah sudah ada.");
    els.areaForm.elements.name.reportValidity();
    els.areaForm.elements.name.setCustomValidity("");
    return;
  }
  state.modules.areas.push({
    id: crypto.randomUUID(),
    name: data.name.trim(),
    coordinator: data.coordinator.trim(),
    quota: Number(data.quota || 0),
    notes: data.notes.trim(),
  });
  els.areaForm.reset();
  markDataChange("Tambah wilayah", data.name.trim());
  render();
}

function addUser() {
  if (!els.userForm.reportValidity()) return;
  const data = Object.fromEntries(new FormData(els.userForm));
  const userId = data.id || "";
  const duplicateUser = state.modules.users.some((user) => {
    return String(user.id) !== String(userId)
      && String(user.username || "").trim().toLowerCase() === data.username.trim().toLowerCase();
  });
  if (duplicateUser) {
    els.userForm.elements.username.setCustomValidity("Username sudah dipakai.");
    els.userForm.elements.username.reportValidity();
    els.userForm.elements.username.setCustomValidity("");
    return;
  }
  const user = {
    id: userId || crypto.randomUUID(),
    name: data.name.trim(),
    username: data.username.trim(),
    password: data.password,
    role: data.role,
    phone: data.phone.trim(),
    status: data.status,
  };
  const index = state.modules.users.findIndex((item) => item.id === user.id);
  if (index >= 0) state.modules.users[index] = user;
  else state.modules.users.push(user);
  els.userForm.reset();
  if (els.userForm.elements.id) els.userForm.elements.id.value = "";
  const addUserBtn = document.querySelector("#addUserBtn");
  if (addUserBtn) addUserBtn.textContent = "Tambah user";
  markDataChange(index >= 0 ? "Update user" : "Tambah user", `${data.username.trim()} - ${data.role}`);
  render();
}

function editUser(userId) {
  const user = state.modules.users.find((item) => item.id === userId);
  if (!user) return;
  els.userForm.elements.id.value = user.id;
  els.userForm.elements.name.value = user.name || "";
  els.userForm.elements.username.value = user.username || "";
  els.userForm.elements.password.value = user.password || "";
  els.userForm.elements.role.value = user.role || "Panitia";
  els.userForm.elements.phone.value = user.phone || "";
  els.userForm.elements.status.value = user.status || "Aktif";
  const addUserBtn = document.querySelector("#addUserBtn");
  if (addUserBtn) addUserBtn.textContent = "Simpan user";
  els.userForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function nextCouponCode() {
  const nextNumber = state.modules.coupons.reduce((max, coupon) => {
    const match = String(coupon.code || "").match(/KPN-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `KPN-${String(nextNumber).padStart(4, "0")}`;
}

function createCoupon({ recipientName = "", areaId = "", category = "Umum", source = "manual" }) {
  const code = nextCouponCode();
  return {
    id: crypto.randomUUID(),
    code,
    recipientName,
    areaId,
    category,
    source,
    status: "Belum diambil",
    createdAt: new Date().toISOString(),
  };
}

function generateCoupons() {
  if (!els.couponGenerateForm.reportValidity()) return;
  const data = Object.fromEntries(new FormData(els.couponGenerateForm));
  const count = Math.min(500, Math.max(1, Number(data.count || 1)));
  for (let index = 0; index < count; index += 1) {
    state.modules.coupons.push(createCoupon({
      recipientName: data.recipientName.trim(),
      areaId: data.areaId,
      category: data.category,
      source: "generated",
    }));
  }
  markDataChange("Generate kupon", `${count} kupon kategori ${data.category}.`);
  render();
}

function addGeneralCoupon() {
  const data = Object.fromEntries(new FormData(els.couponGenerateForm));
  const duplicateCoupon = state.modules.coupons.some((coupon) => {
    return normalizeDuplicateValue(coupon.recipientName || "Kupon umum") === normalizeDuplicateValue(data.recipientName || "Kupon umum")
      && String(coupon.areaId || "") === String(data.areaId || "")
      && String(coupon.category || "") === "Umum";
  });
  if (duplicateCoupon) {
    alert("Kupon umum dengan penerima dan wilayah yang sama sudah ada.");
    return;
  }
  state.modules.coupons.push(createCoupon({
    recipientName: data.recipientName.trim(),
    areaId: data.areaId,
    category: "Umum",
    source: "general",
  }));
  markDataChange("Tambah kupon umum", data.recipientName.trim() || "Kupon umum");
  render();
}

function importParticipantCoupons() {
  const defaultArea = state.modules.areas[0] ? state.modules.areas[0].id : "";
  const existingNames = new Set(state.modules.coupons.map((coupon) => `${coupon.category}:${coupon.recipientName}`));
  state.participants.forEach((participant) => {
    const key = `Pengkurban:${participant.name}`;
    if (existingNames.has(key)) return;
    state.modules.coupons.push(createCoupon({
      recipientName: participant.name,
      areaId: defaultArea,
      category: "Pengkurban",
      source: "participant",
    }));
    existingNames.add(key);
  });
  markDataChange("Import kupon pengkurban", `${state.participants.length} peserta dicek sebagai sumber kupon.`);
  render();
}

function qrImageUrl(code) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(String(code || "").trim().toUpperCase())}`;
}

function printCouponTemplates(couponIds) {
  const ids = Array.isArray(couponIds) ? couponIds : [];
  const coupons = ids.length ? state.modules.coupons.filter((coupon) => ids.includes(coupon.id)) : state.modules.coupons;
  if (!coupons.length) {
    alert("Belum ada kupon untuk dicetak.");
    return;
  }

  const settings = state.modules.appSettings || {};
  const title = `Kupon Distribusi - ${settings.institutionName || "QurbanOps"}`;
  const cards = coupons.map((coupon) => `
    <article class="coupon">
      <div>
        <span class="brand">${escapeHtml(settings.institutionName || "QurbanOps")}</span>
        <h2>Kupon Distribusi Daging</h2>
        <small>${escapeHtml(settings.qurbanYear || "Idul Adha")}</small>
      </div>
      <img src="${qrImageUrl(coupon.code)}" alt="QR ${escapeHtml(coupon.code)}" />
      <dl>
        <dt>Kode</dt><dd>${escapeHtml(coupon.code)}</dd>
        <dt>Penerima</dt><dd>${escapeHtml(coupon.recipientName || "Kupon umum")}</dd>
        <dt>Kategori</dt><dd>${escapeHtml(coupon.category || "-")}</dd>
        <dt>Wilayah</dt><dd>${escapeHtml(getAreaName(coupon.areaId))}</dd>
      </dl>
      <footer>Tunjukkan QR ini kepada petugas scanner. Kupon hanya berlaku satu kali.</footer>
    </article>
  `).join("");

  const report = window.open("", "_blank", "width=980,height=720");
  if (!report) return;
  report.document.write(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; }
          body { margin: 0; font-family: Arial, sans-serif; color: #17231f; }
          main { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8mm; }
          .coupon { min-height: 132mm; border: 1.5px solid #0b3d34; border-radius: 8px; padding: 12px; display: grid; gap: 9px; break-inside: avoid; }
          .brand { color: #5f6b66; font-size: 11px; font-weight: 800; text-transform: uppercase; }
          h2 { margin: 2px 0 0; font-size: 20px; }
          small, footer, dt { color: #5f6b66; }
          img { width: 42mm; height: 42mm; place-self: center; border: 1px solid #d6e0d8; border-radius: 8px; }
          dl { display: grid; grid-template-columns: 76px 1fr; gap: 6px 10px; margin: 0; font-size: 13px; }
          dt { font-weight: 800; }
          dd { margin: 0; font-weight: 800; }
          footer { border-top: 1px dashed #aebfb5; padding-top: 8px; font-size: 11px; line-height: 1.35; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body><main>${cards}</main></body>
    </html>
  `);
  report.document.close();
  report.focus();
  report.print();
}

function parseDelimited(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const delimiter = text.includes("\t") && !text.includes(",") ? "\t" : ",";
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

async function loadXlsxLibrary() {
  if (window.XLSX) return window.XLSX;
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Library pembaca Excel gagal dimuat. Simpan file sebagai CSV jika perangkat sedang offline."));
    document.head.appendChild(script);
  });
  return window.XLSX;
}

async function readImportRows(file) {
  const extension = file.name.split(".").pop().toLowerCase();
  if (["xlsx", "xls"].includes(extension)) {
    const XLSX = await loadXlsxLibrary();
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  }
  return parseDelimited(await file.text());
}

function normalizeHeader(value) {
  return String(value || "").trim().toLowerCase().replaceAll(" ", "").replaceAll("_", "");
}

function rowValue(row, headers, names) {
  const index = names.map(normalizeHeader).map((name) => headers.indexOf(name)).find((item) => item >= 0);
  return index >= 0 ? String(row[index] || "").trim() : "";
}

async function importCouponsOrParticipantsFile(file) {
  if (!file) return;
  const rows = await readImportRows(file);
  if (rows.length < 2) {
    alert("File import belum berisi data.");
    return;
  }

  const headers = rows[0].map(normalizeHeader);
  const defaultArea = state.modules.areas[0] ? state.modules.areas[0].id : "";
  let couponCount = 0;
  let participantCount = 0;
  const existingCouponCodes = new Set(state.modules.coupons.map((coupon) => String(coupon.code || "").toUpperCase()));

  rows.slice(1).forEach((row) => {
    const name = rowValue(row, headers, ["nama", "namapeserta", "penerima", "recipient", "recipientname"]);
    const phone = rowValue(row, headers, ["telepon", "hp", "whatsapp", "phone"]);
    const category = rowValue(row, headers, ["kategori", "category"]);
    const couponCode = rowValue(row, headers, ["kode", "kodekupon", "coupon", "couponcode"]);
    const invoice = rowValue(row, headers, ["invoice", "token", "notagihan"]);
    const animalCode = rowValue(row, headers, ["hewan", "kodehewan", "animal"]);
    const due = rowValue(row, headers, ["iuran", "due", "tagihan"]);
    const paid = rowValue(row, headers, ["dibayar", "paid", "bayar"]);

    if (invoice || phone || animalCode) {
      const animal = state.animals.find((item) => String(item.code || "").toUpperCase() === animalCode.toUpperCase()) || state.animals[0];
      if (name && animal) {
        const packageType = rowValue(row, headers, ["paket", "packagetype"]) || (animal.type === "Sapi" ? "Patungan sapi" : `${animal.type} individu`);
        state.participants.push({
          id: crypto.randomUUID(),
          token: invoice || nextParticipantToken(),
          name,
          phone,
          address: rowValue(row, headers, ["alamat", "address"]) || "-",
          animalId: animal.id,
          packageType,
          paymentMethod: rowValue(row, headers, ["metode", "paymentmethod"]) || "Transfer",
          due: Number(String(due || suggestDue(animal.id, packageType)).replace(/\D/g, "")),
          paid: Number(String(paid || 0).replace(/\D/g, "")),
          bookingStatus: rowValue(row, headers, ["validasi", "bookingstatus"]) || "Menunggu validasi",
        });
        participantCount += 1;
      }
      return;
    }

    if (!name && !couponCode) return;
    const code = couponCode ? couponCode.toUpperCase() : nextCouponCode();
    if (existingCouponCodes.has(code)) return;
    state.modules.coupons.push({
      id: crypto.randomUUID(),
      code,
      recipientName: name,
      areaId: defaultArea,
      category: category || "Umum",
      source: "excel",
      status: rowValue(row, headers, ["status"]) || "Belum diambil",
      createdAt: new Date().toISOString(),
    });
    existingCouponCodes.add(code);
    couponCount += 1;
  });

  markDataChange("Import Excel/CSV", `${couponCount} kupon dan ${participantCount} peserta berhasil diimpor dari ${file.name}.`);
  render();
  alert(`Import selesai: ${couponCount} kupon, ${participantCount} peserta.`);
}

function scanCoupon() {
  if (!els.scanForm.reportValidity()) return;
  const data = Object.fromEntries(new FormData(els.scanForm));
  const code = normalizeCouponScanValue(data.couponCode);
  els.scanForm.elements.couponCode.value = code;
  const coupon = state.modules.coupons.find((item) => item.code.toUpperCase() === code);
  const scan = {
    id: crypto.randomUUID(),
    couponCode: code,
    recipientName: coupon ? coupon.recipientName || "Kupon umum" : "-",
    areaName: coupon ? getAreaName(coupon.areaId) : "-",
    officer: data.officer,
    scannedAt: new Date().toISOString(),
    status: "Terverifikasi",
  };

  if (!coupon) {
    scan.status = "Ditolak";
    els.scanResult.className = "scan-result danger";
    els.scanResult.textContent = "Kupon tidak ditemukan.";
  } else if (coupon.status === "Sudah diterima") {
    scan.status = "Ditolak";
    els.scanResult.className = "scan-result danger";
    els.scanResult.textContent = `${coupon.code} sudah pernah diterima.`;
  } else {
    coupon.status = "Sudah diterima";
    coupon.scannedAt = scan.scannedAt;
    coupon.officer = data.officer;
    els.scanResult.className = "scan-result good";
    els.scanResult.textContent = `${coupon.code} valid untuk ${coupon.recipientName || "kupon umum"}.`;
  }

  state.modules.scanHistory.push(scan);
  els.scanForm.reset();
  markDataChange("Scan kupon", `${scan.couponCode}: ${scan.status}`);
  render();
}

function normalizeCouponScanValue(value) {
  const raw = String(value || "").trim();
  const decoded = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();
  const match = decoded.match(/\bKPN[-\s]?(\d{1,8})\b/i);
  if (match) return `KPN-${match[1].padStart(4, "0")}`;
  const urlCode = decoded.match(/[?&#](?:code|coupon|couponCode|kupon)=([^&#]+)/i);
  if (urlCode) return normalizeCouponScanValue(urlCode[1]);
  return decoded.toUpperCase();
}

function setScannerUi(status, mode = "idle") {
  if (els.scannerStatus) els.scannerStatus.textContent = status;
  if (els.scannerCameraPanel) {
    els.scannerCameraPanel.classList.toggle("is-active", mode === "active");
    els.scannerCameraPanel.classList.toggle("is-fallback", mode === "fallback");
  }
  if (els.startScannerBtn) els.startScannerBtn.disabled = mode === "active";
  if (els.stopScannerBtn) els.stopScannerBtn.disabled = !scannerStream;
}

function focusManualCouponInput(value = "") {
  if (!els.scanForm || !els.scanForm.elements.couponCode) return;
  if (value) els.scanForm.elements.couponCode.value = normalizeCouponScanValue(value);
  els.scanForm.elements.couponCode.focus();
  els.scanForm.elements.couponCode.select();
}

function scannerFallback(message) {
  stopScanner({ silent: true });
  setScannerUi(`${message} Masukkan kode kupon secara manual lalu tekan Verifikasi manual.`, "fallback");
  focusManualCouponInput();
}

function scannerErrorMessage(error) {
  const name = error && error.name ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "Izin kamera ditolak atau diblokir browser.";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "Kamera belakang tidak ditemukan di perangkat ini.";
  if (name === "NotReadableError" || name === "AbortError") return "Kamera sedang dipakai aplikasi lain atau belum siap.";
  return "Kamera tidak dapat dibuka.";
}

async function makeQrDetector() {
  if (!("BarcodeDetector" in window)) return null;
  if (BarcodeDetector.getSupportedFormats) {
    const formats = await BarcodeDetector.getSupportedFormats();
    if (!formats.includes("qr_code")) return null;
  }
  return new BarcodeDetector({ formats: ["qr_code"] });
}

async function startScanner() {
  if (!els.scannerVideo || !els.scannerStatus) return;
  if (!["admin", "distribusi", "scanner", "panitia"].includes(activeRole)) {
    scannerFallback("Role aktif tidak memiliki akses scan kupon.");
    return;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    scannerFallback("Browser atau perangkat ini belum menyediakan akses kamera.");
    return;
  }

  try {
    stopScanner({ silent: true });
    scannerDetector = await makeQrDetector();
    if (!scannerDetector) {
      scannerFallback("Browser ini belum mendukung pembaca QR kamera.");
      return;
    }
    setScannerUi("Meminta izin kamera...", "active");
    scannerStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    els.scannerVideo.srcObject = scannerStream;
    await els.scannerVideo.play();
    setScannerUi("Kamera aktif. Arahkan QR kupon ke tengah layar.", "active");
    const scanFrame = async () => {
      if (!scannerStream || scannerBusy) return;
      scannerBusy = true;
      try {
        const codes = await scannerDetector.detect(els.scannerVideo);
        const value = codes && codes[0] && codes[0].rawValue ? normalizeCouponScanValue(codes[0].rawValue) : "";
        if (value) {
          focusManualCouponInput(value);
          setScannerUi(`QR terbaca: ${value}. Memverifikasi kupon...`, "active");
          scanCoupon();
          stopScanner({ message: "Kamera berhenti setelah QR terbaca. Nyalakan lagi untuk scan kupon berikutnya." });
          return;
        }
      } catch {
        // Continue scanning; intermittent decode failures are normal while the camera moves.
      } finally {
        scannerBusy = false;
      }
      scannerTimer = window.setTimeout(scanFrame, 350);
    };
    scanFrame();
  } catch (error) {
    scannerFallback(scannerErrorMessage(error));
  }
}

function stopScanner(options = {}) {
  window.clearTimeout(scannerTimer);
  scannerTimer = null;
  scannerBusy = false;
  if (scannerStream) {
    scannerStream.getTracks().forEach((track) => track.stop());
    scannerStream = null;
  }
  scannerDetector = null;
  if (els.scannerVideo) els.scannerVideo.srcObject = null;
  if (!options.silent) {
    setScannerUi(options.message || "Kamera berhenti. Scanner bisa dinyalakan lagi saat dibutuhkan.", "idle");
  }
}

function downloadCouponsReport() {
  const settings = state.modules.appSettings || {};
  const rows = state.modules.coupons.map((coupon) => [
    coupon.code,
    coupon.recipientName || "Kupon umum",
    getAreaName(coupon.areaId),
    coupon.category,
    coupon.status,
    coupon.officer || "",
    coupon.scannedAt ? formatDateTime(coupon.scannedAt) : "",
  ]);
  const html = makeReportWorkbook(
    `Laporan Kupon Distribusi - ${settings.institutionName || "QurbanOps"}`,
    ["Kode", "Penerima", "Wilayah", "Kategori", "Status", "Petugas", "Waktu Scan"],
    rows,
  );
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "laporan-kupon-qurban.xls";
  link.click();
  URL.revokeObjectURL(link.href);
}

function printDistributionReport() {
  const settings = state.modules.appSettings;
  const rows = state.modules.areas.map((area) => {
    const coupons = state.modules.coupons.filter((coupon) => coupon.areaId === area.id);
    const used = coupons.filter((coupon) => coupon.status === "Sudah diterima").length;
    return [area.name, area.quota || 0, coupons.length, used, Math.max(0, coupons.length - used)];
  });
  printTableReport(
    `Laporan Pembagian Daging - ${settings.institutionName}`,
    ["Wilayah", "Target", "Kupon", "Sudah diterima", "Sisa"],
    rows,
  );
}

function makeReportWorkbook(title, headers, rows) {
  return `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <table border="1">
          <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </body>
    </html>
  `;
}

function printTableReport(title, headers, rows) {
  const report = window.open("", "_blank", "width=960,height=720");
  if (!report) return;
  report.document.write(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          body { font-family: Arial, sans-serif; color: #17231f; }
          h1 { margin: 0 0 6px; font-size: 22px; }
          p { margin: 0 0 18px; color: #5f6b66; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #cbd8d0; padding: 9px; text-align: left; }
          th { background: #e8f4ee; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <p>Dicetak ${escapeHtml(formatDateTime(new Date().toISOString()))}</p>
        <table>
          <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </body>
    </html>
  `);
  report.document.close();
  report.focus();
  report.print();
}

function exportAuditLog() {
  const logs = state.modules.auditLog || [];
  const rows = logs.map((log) => [formatDateTime(log.at), log.user || log.username || "-", log.role || "-", log.action || "-", log.detail || "-"]);
  const html = makeReportWorkbook("Audit Log QurbanOps", ["Waktu", "User", "Role", "Aksi", "Detail"], rows);
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "audit-log-qurban.xls";
  link.click();
  URL.revokeObjectURL(link.href);
}

function saveProfile() {
  const account = getActiveAccount();
  state.modules.profile = {
    name: els.profileForm.elements.name.value.trim(),
    phone: els.profileForm.elements.phone.value.trim(),
    status: "Aktif",
  };
  if (account && account.id && account.id !== "master") {
    const user = state.modules.users.find((item) => item.id === account.id);
    if (user) {
      user.name = state.modules.profile.name;
      user.phone = state.modules.profile.phone;
      setActiveAccount(user);
    }
  }
  markDataChange("Update profil", state.modules.profile.name);
  render();
}

function setActiveRole(role) {
  const account = getActiveAccount();
  if (account && normalizeRole(account.role) !== "admin" && role !== normalizeRole(account.role)) return;
  activeRole = role;
  render();
}

function applyRoleAccess() {
  const account = getActiveAccount();
  const canSwitchRoles = !account || normalizeRole(account.role) === "admin";
  els.roleButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.roleSwitch === activeRole);
    button.disabled = !canSwitchRoles && button.dataset.roleSwitch !== activeRole;
  });
  document.querySelectorAll("[data-access]").forEach((item) => {
    const allowed = item.dataset.access.split(" ").includes(activeRole);
    item.hidden = !allowed;
  });
  if (els.activeRoleNote) {
    const label = ROLE_LABELS[activeRole] || "Panitia";
    const syncText = state.meta && state.meta.version ? ` Versi data: ${state.meta.version}.` : "";
    els.activeRoleNote.textContent = `Mode aktif: ${label}. Data tersimpan otomatis di browser perangkat ini.${syncText}`;
  }
  const activeNav = [...els.navItems].find((item) => item.classList.contains("active") && !item.hidden);
  if (activeNav) return;
  const firstAllowed = [...els.navItems].find((item) => !item.hidden);
  if (firstAllowed) activateView(firstAllowed);
}

function activateView(item) {
  els.navItems.forEach((nav) => nav.classList.remove("active"));
  item.classList.add("active");
  els.views.forEach((view) => view.classList.remove("active"));
  const view = document.querySelector(`#${item.dataset.view}View`);
  if (view) view.classList.add("active");
}

function activateWorkflowTab(tabButton) {
  const group = tabButton.dataset.workflowTab;
  const target = tabButton.dataset.workflowTarget;
  document.querySelectorAll(`[data-workflow-tab="${group}"]`).forEach((button) => button.classList.toggle("active", button === tabButton));
  document.querySelectorAll(`[data-workflow-panel="${group}"]`).forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.workflowName === target);
  });
}

function activateModuleTab(moduleKey) {
  document.querySelectorAll("[data-module-tab]").forEach((button) => button.classList.toggle("active", button.dataset.moduleTab === moduleKey));
  document.querySelectorAll("[data-module]").forEach((card) => card.classList.toggle("active", card.dataset.module === moduleKey));
}

document.querySelector("#openAnimalFormBtn2").addEventListener("click", () => openAnimalForm());
document.querySelector("#openParticipantFormBtn").addEventListener("click", () => openParticipantForm());
document.querySelector("#printParticipantCardsBtn").addEventListener("click", () => printParticipantCards());
document.querySelector("#saveAnimalBtn").addEventListener("click", saveAnimal);
document.querySelector("#saveParticipantBtn").addEventListener("click", saveParticipant);
document.querySelector("#saveDistributionBtn").addEventListener("click", saveDistribution);
document.querySelector("#addDistributionTargetBtn").addEventListener("click", addDistributionTarget);
document.querySelector("#addDistributionRecipientBtn").addEventListener("click", addDistributionRecipient);
document.querySelector("#saveModulesBtn").addEventListener("click", saveModules);
document.querySelector("#printSavingsBtn").addEventListener("click", () => printModuleReport("Laporan Tabungan Kurban", state.modules && state.modules.savings));
document.querySelector("#printTransactionsBtn").addEventListener("click", () => printModuleReport("Laporan Transaksi Kurban", state.modules && state.modules.transactions));
document.querySelector("#saveSettingsBtn").addEventListener("click", saveSettings);
document.querySelector("#addAreaBtn").addEventListener("click", addArea);
document.querySelector("#addUserBtn").addEventListener("click", addUser);
document.querySelector("#generateCouponsBtn").addEventListener("click", generateCoupons);
document.querySelector("#importParticipantCouponsBtn").addEventListener("click", importParticipantCoupons);
document.querySelector("#importCouponsExcelBtn").addEventListener("click", () => els.couponImportFile && els.couponImportFile.click());
document.querySelector("#printCouponTemplatesBtn").addEventListener("click", () => printCouponTemplates());
document.querySelector("#addGeneralCouponBtn").addEventListener("click", addGeneralCoupon);
document.querySelector("#scanCouponBtn").addEventListener("click", scanCoupon);
document.querySelector("#startScannerBtn").addEventListener("click", startScanner);
document.querySelector("#stopScannerBtn").addEventListener("click", stopScanner);
document.querySelector("#clearScanResultBtn").addEventListener("click", () => {
  els.scanResult.textContent = "";
  els.scanResult.className = "scan-result";
});
document.querySelector("#downloadCouponsReportBtn").addEventListener("click", downloadCouponsReport);
document.querySelector("#printDistributionReportBtn").addEventListener("click", printDistributionReport);
document.querySelector("#exportAuditLogBtn").addEventListener("click", exportAuditLog);
document.querySelector("#saveProfileBtn").addEventListener("click", saveProfile);
if (els.couponImportFile) {
  els.couponImportFile.addEventListener("change", async (event) => {
    try {
      await importCouponsOrParticipantsFile(event.target.files[0]);
    } catch (error) {
      alert(error.message || "Import file gagal. Periksa format kolom dan coba lagi.");
    } finally {
      event.target.value = "";
    }
  });
}
els.adminLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.adminLoginError.textContent = "";
  const username = els.adminUsernameInput.value;
  const password = els.adminPasswordInput.value;

  try {
    const account = await verifyAdminPassword(password, username);
    setAdminPassword(password);
    setActiveAccount(account);
    activeRole = normalizeRole(account.role);
    unlockAdmin();
    render();
  } catch (error) {
    els.adminLoginError.textContent = error.message || "Akun atau password salah.";
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
  updateParticipantPackageOptions();
});
els.participantForm.elements.packageType.addEventListener("change", () => {
  els.participantForm.elements.due.value = suggestDue(
    els.participantForm.elements.animalId.value,
    els.participantForm.elements.packageType.value,
  );
});
els.animalForm.elements.type.addEventListener("change", () => {
  if (!els.animalForm.elements.id.value) {
    els.animalForm.elements.code.value = nextAnimalCode(els.animalForm.elements.type.value);
  }
});
els.roleButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveRole(button.dataset.roleSwitch));
});

els.navItems.forEach((item) => {
  item.addEventListener("click", () => {
    activateView(item);
  });
});

document.addEventListener("click", (event) => {
  const workflowTab = event.target.closest("[data-workflow-tab]");
  const moduleTab = event.target.closest("[data-module-tab]");
  if (workflowTab) {
    activateWorkflowTab(workflowTab);
    return;
  }
  if (moduleTab) {
    activateModuleTab(moduleTab.dataset.moduleTab);
    return;
  }

  const editAnimalId = event.target.dataset.editAnimal;
  const deleteAnimalId = event.target.dataset.deleteAnimal;
  const editParticipantId = event.target.dataset.editParticipant;
  const deleteParticipantId = event.target.dataset.deleteParticipant;
  const printParticipantId = event.target.dataset.printParticipant;
  const validateParticipantId = event.target.dataset.validateParticipant;
  const rejectParticipantId = event.target.dataset.rejectParticipant;
  const moduleAdd = event.target.dataset.moduleAdd;
  const moduleEdit = event.target.dataset.moduleEdit;
  const moduleDelete = event.target.dataset.moduleDelete;
  const moduleIndex = event.target.dataset.moduleIndex;
  const deleteDistributionTargetIndex = event.target.dataset.deleteDistributionTarget;
  const deleteDistributionRecipientTarget = event.target.dataset.deleteDistributionRecipient;
  const deleteDistributionRecipientIndex = event.target.dataset.recipientIndex;
  const deleteAreaId = event.target.dataset.deleteArea;
  const editUserId = event.target.dataset.editUser;
  const deleteUserId = event.target.dataset.deleteUser;
  const deleteCouponId = event.target.dataset.deleteCoupon;
  const printCouponId = event.target.dataset.printCoupon;

  if (editAnimalId) openAnimalForm(editAnimalId);
  if (deleteAnimalId) deleteAnimal(deleteAnimalId);
  if (editParticipantId) openParticipantForm(editParticipantId);
  if (validateParticipantId) setParticipantValidation(validateParticipantId, "Validasi sukses");
  if (rejectParticipantId) setParticipantValidation(rejectParticipantId, "Ditolak");
  if (printParticipantId) printParticipantCards([printParticipantId]);
  if (printCouponId) printCouponTemplates([printCouponId]);
  if (deleteParticipantId) deleteParticipant(deleteParticipantId);
  if (editUserId) editUser(editUserId);
  if (moduleAdd) addModuleRecord(moduleAdd);
  if (moduleEdit) editModuleRecord(moduleEdit, Number(moduleIndex));
  if (moduleDelete) deleteModuleRecord(moduleDelete, Number(moduleIndex));
  if (deleteDistributionTargetIndex !== undefined) deleteDistributionTarget(Number(deleteDistributionTargetIndex));
  if (deleteDistributionRecipientTarget !== undefined) deleteDistributionRecipient(Number(deleteDistributionRecipientTarget), Number(deleteDistributionRecipientIndex));
  if (deleteAreaId) {
    if (!window.confirm("Hapus wilayah ini? Kupon yang memakai wilayah ini akan kehilangan referensi wilayah.")) return;
    const removedArea = state.modules.areas.find((area) => area.id === deleteAreaId);
    state.modules.areas = state.modules.areas.filter((area) => area.id !== deleteAreaId);
    state.modules.coupons.forEach((coupon) => {
      if (coupon.areaId === deleteAreaId) coupon.areaId = "";
    });
    if (removedArea) {
      const removedKey = String(removedArea.name || "").trim().toLowerCase();
      state.distribution.targets = (state.distribution.targets || []).filter((target) => String(target.destination || "").trim().toLowerCase() !== removedKey);
      state.modules.recipients = (state.modules.recipients || []).filter((recipient) => String(recipient.name || "").trim().toLowerCase() !== removedKey);
      syncDistributionRecipientsModule();
    }
    markDataChange("Hapus wilayah", removedArea ? removedArea.name : deleteAreaId);
    render();
  }
  if (deleteUserId) {
    if (!window.confirm("Hapus user ini? Akun tidak bisa dipakai lagi setelah dihapus.")) return;
    const removed = state.modules.users.find((user) => user.id === deleteUserId);
    state.modules.users = state.modules.users.filter((user) => user.id !== deleteUserId);
    markDataChange("Hapus user", removed ? removed.username : deleteUserId);
    render();
  }
  if (deleteCouponId) {
    if (!window.confirm("Hapus kupon ini? Data kupon akan hilang dari penyimpanan lokal.")) return;
    const removed = state.modules.coupons.find((coupon) => coupon.id === deleteCouponId);
    state.modules.coupons = state.modules.coupons.filter((coupon) => coupon.id !== deleteCouponId);
    markDataChange("Hapus kupon", removed ? removed.code : deleteCouponId);
    render();
  }
});

async function bootstrap() {
  await requireAdminLogin();
  render();
}

bootstrap();
