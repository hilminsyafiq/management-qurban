const demoAnimals = [
  {
    id: "demo-sp-01",
    code: "SP-01",
    type: "Sapi",
    weight: 410,
    price: 28500000,
    cost: 1600000,
    status: "paid",
    schedule: "2026-05-28T07:30",
    photoUrl: "assets/animal-sapi.svg",
    capacity: 7,
    filled: 2,
    available: 5,
  },
  {
    id: "demo-kg-01",
    code: "KG-01",
    type: "Kambing",
    weight: 38,
    price: 3600000,
    cost: 250000,
    status: "booking",
    schedule: "2026-05-28T09:00",
    photoUrl: "assets/animal-kambing.svg",
    capacity: 1,
    filled: 1,
    available: 0,
  },
  {
    id: "demo-db-01",
    code: "DB-01",
    type: "Domba",
    weight: 34,
    price: 3300000,
    cost: 225000,
    status: "booking",
    schedule: "2026-05-28T10:00",
    photoUrl: "assets/animal-domba.svg",
    capacity: 1,
    filled: 0,
    available: 1,
  },
];

const STORAGE_KEY = "qurbanops-state-v1";
let publicAnimals = [];
let publicDistribution = {
  warga: 120,
  mustahik: 48,
  peserta: 16,
  panitia: 20,
  targets: [
    { destination: "RT 01 Kampung Melati", category: "Warga", bags: 40, pic: "Pak Ahmad", status: "Siap dibagikan" },
    { destination: "Masjid Al-Ikhlas", category: "Mustahik", bags: 35, pic: "Bu Siti", status: "Terjadwal" },
    { destination: "Musholla An-Nur", category: "Mustahik", bags: 28, pic: "Pak Ridwan", status: "Menunggu pengemasan" },
  ],
};

const publicEls = {
  list: document.querySelector("#publicAnimalList"),
  totalAnimals: document.querySelector("#publicTotalAnimals"),
  availableShares: document.querySelector("#publicAvailableShares"),
  search: document.querySelector("#searchInput"),
  type: document.querySelector("#typeFilter"),
  quota: document.querySelector("#quotaFilter"),
  packageGrid: document.querySelector("#packageGrid"),
  bookingForm: document.querySelector("#bookingForm"),
  bookingSelect: document.querySelector("#bookingAnimalSelect"),
  bookingPackageSelect: document.querySelector("#bookingPackageSelect"),
  bookingResult: document.querySelector("#bookingResult"),
  invoiceCheckForm: document.querySelector("#invoiceCheckForm"),
  invoiceCheckResult: document.querySelector("#invoiceCheckResult"),
  distributionSummary: document.querySelector("#distributionSummary"),
  distributionStatus: document.querySelector("#publicDistributionStatus"),
  distributionTargets: document.querySelector("#distributionTargets"),
};

function money(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function shareCapacity(type) {
  return type === "Sapi" ? 7 : 1;
}

function participantShareUnits(participant, animal) {
  const type = animal ? animal.type : "";
  if (type === "Sapi" && participant.packageType === "Sapi penuh keluarga") return 7;
  return 1;
}

function packageShareUnits(packageType, animal) {
  if (animal && animal.type === "Sapi" && packageType === "Sapi penuh keluarga") return 7;
  return 1;
}

function normalizePublicAnimal(animal, participants = []) {
  const capacity = shareCapacity(animal.type);
  const filled = participants
    .filter((participant) => String(participant.animalId) === String(animal.id))
    .reduce((sum, participant) => sum + participantShareUnits(participant, animal), 0);
  return {
    ...animal,
    capacity,
    filled,
    available: Math.max(0, capacity - filled),
  };
}

function getLocalState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function setLocalState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getLocalPublicData() {
  const state = getLocalState();
  if (!state || !Array.isArray(state.animals) || !state.animals.length) return null;
  return {
    animals: state.animals.map((animal) => normalizePublicAnimal(animal, state.participants || [])),
    distribution: state.distribution,
  };
}

function nextLocalInvoice(state) {
  const nextNumber = (state.participants || []).reduce((max, participant) => {
    const match = String(participant.token || "").match(/QBN-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `QBN-${String(nextNumber).padStart(4, "0")}`;
}

function makeBookingPayload(formData, animal, invoice = "") {
  const total = Number(animal.price || 0) + Number(animal.cost || 0);
  const packageType = formData.packageType || (animal.type === "Sapi" ? "Patungan sapi" : `${animal.type} individu`);
  return {
    id: crypto.randomUUID(),
    token: invoice,
    name: String(formData.name || "").trim(),
    phone: String(formData.phone || "").trim(),
    address: String(formData.address || "").trim(),
    animalId: animal.id,
    packageType,
    paymentMethod: formData.paymentMethod || "Transfer",
    due: packageShareUnits(packageType, animal) >= shareCapacity(animal.type) ? total : Math.ceil(total / shareCapacity(animal.type)),
    paid: 0,
    bookingStatus: "Menunggu validasi",
    note: String(formData.note || "").trim(),
  };
}

function makeDemoParticipant(animal, index) {
  return {
    id: crypto.randomUUID(),
    token: `QBN-${String(index + 1).padStart(4, "0")}`,
    name: `Peserta demo ${index + 1}`,
    phone: "",
    address: "",
    animalId: animal.id,
    packageType: animal.type === "Sapi" ? "Patungan sapi" : `${animal.type} individu`,
    paymentMethod: "Transfer",
    due: Math.ceil((Number(animal.price || 0) + Number(animal.cost || 0)) / shareCapacity(animal.type)),
    paid: 0,
    bookingStatus: "Menunggu validasi",
  };
}

function getPackageOptionsForAnimal(animal) {
  if (!animal) return [];
  if (animal.type === "Sapi") {
    const options = [{ value: "Patungan sapi", label: "Patungan sapi (1/7 bagian)" }];
    if (Number(animal.available || 0) >= shareCapacity(animal.type)) {
      options.push({ value: "Sapi penuh keluarga", label: "Sapi penuh keluarga (1 ekor)" });
    }
    return options;
  }
  return [{ value: `${animal.type} individu`, label: `${animal.type} individu (1 ekor)` }];
}

function getBookingStatusLabel(status) {
  return status || "Menunggu validasi";
}

function findLocalInvoice(invoice) {
  const state = getLocalState();
  if (!state || !Array.isArray(state.participants)) return null;
  const normalizedInvoice = String(invoice || "").trim().toUpperCase();
  const participant = state.participants.find((item) => String(item.token || "").trim().toUpperCase() === normalizedInvoice);
  if (!participant) return null;
  const animal = (state.animals || []).find((item) => String(item.id) === String(participant.animalId));
  return { participant, animal };
}

function makeInitialLocalState() {
  const participants = [];
  demoAnimals.forEach((animal) => {
    const filled = Math.min(Number(animal.filled || 0), shareCapacity(animal.type));
    for (let index = 0; index < filled; index += 1) {
      participants.push(makeDemoParticipant(animal, participants.length));
    }
  });

  return {
    animals: demoAnimals.map(({ capacity, filled, available, ...animal }) => ({ ...animal })),
    participants,
    distribution: structuredClone(publicDistribution),
    modules: {},
  };
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

function renderPublicAnimals() {
  const query = publicEls.search.value.trim().toLowerCase();
  const type = publicEls.type.value;
  const quota = publicEls.quota.value;

  const filtered = publicAnimals.filter((animal) => {
    const matchesQuery = !query || `${animal.code} ${animal.type}`.toLowerCase().includes(query);
    const matchesType = type === "all" || animal.type === type;
    const matchesQuota = quota === "all" || (quota === "available" ? animal.available > 0 : animal.available <= 0);
    return matchesQuery && matchesType && matchesQuota;
  });

  const available = publicAnimals.reduce((sum, animal) => sum + Number(animal.available || 0), 0);
  publicEls.totalAnimals.textContent = publicAnimals.length;
  publicEls.availableShares.textContent = available;
  renderPackages();
  renderBookingOptions();
  renderDistribution();

  if (!filtered.length) {
    publicEls.list.innerHTML = '<div class="empty-state">Tidak ada hewan yang cocok dengan filter saat ini.</div>';
    return;
  }

  publicEls.list.innerHTML = filtered.map((animal) => {
    const percent = Math.min(100, (Number(animal.filled || 0) / Number(animal.capacity || 1)) * 100);
    const totalPrice = Number(animal.price || 0) + Number(animal.cost || 0);
    const isFull = Number(animal.available || 0) <= 0;
    const photoUrl = animal.photoUrl || getFallbackAnimalPhoto(animal.type);
    const fallbackPhoto = getFallbackAnimalPhoto(animal.type);

    return `
      <article class="animal-item">
        <div class="animal-photo-wrap">
          <img class="animal-photo" src="${escapeHtml(photoUrl)}" alt="Foto ${escapeHtml(animal.type)} ${escapeHtml(animal.code)}" loading="lazy" onerror="this.onerror=null;this.src='${escapeHtml(fallbackPhoto)}';" />
          <span class="photo-caption">Profil ${escapeHtml(animal.type)}</span>
        </div>
        <div>
          <div class="animal-top">
            <div>
              <div class="animal-code">${escapeHtml(animal.code)}</div>
              <div class="animal-type">${escapeHtml(animal.type)} - ${Number(animal.weight || 0)} kg</div>
            </div>
            <span class="badge ${isFull ? "full" : ""}">${isFull ? "Penuh" : "Tersedia"}</span>
          </div>
          <div class="animal-meta">
            <div>
              <span>Total biaya</span>
              <strong>${money(totalPrice)}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>${escapeHtml(statusLabel(animal.status))}</strong>
            </div>
            <div>
              <span>Jadwal</span>
              <strong>${escapeHtml(formatSchedule(animal.schedule))}</strong>
            </div>
            <div>
              <span>Lokasi</span>
              <strong>${escapeHtml(animal.location || "Kandang panitia")}</strong>
            </div>
            <div>
              <span>Umur</span>
              <strong>${escapeHtml(animal.age || "Sesuai syarat")}</strong>
            </div>
          </div>
        </div>
        <div>
          <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
          <div class="quota-text">${getCapacityText(animal)} - ${Number(animal.filled || 0)}/${Number(animal.capacity || 0)} peserta terisi</div>
        </div>
      </article>
    `;
  }).join("");
}

function renderDistribution() {
  const targets = publicDistribution.targets || [];
  if (publicEls.distributionSummary) {
    publicEls.distributionSummary.innerHTML = `
      <div><span>Warga sekitar</span><strong>${Number(publicDistribution.warga || 0)}</strong></div>
      <div><span>Mustahik</span><strong>${Number(publicDistribution.mustahik || 0)}</strong></div>
      <div><span>Peserta</span><strong>${Number(publicDistribution.peserta || 0)}</strong></div>
      <div><span>Panitia</span><strong>${Number(publicDistribution.panitia || 0)}</strong></div>
    `;
  }

  if (publicEls.distributionStatus) {
    const totalBags = targets.reduce((sum, target) => sum + Number(target.bags || 0), 0);
    const sent = targets.filter((target) => ["Terkirim", "Sudah diambil"].includes(target.status)).reduce((sum, target) => sum + Number(target.bags || 0), 0);
    const ready = targets.filter((target) => ["Siap dibagikan", "Terjadwal"].includes(target.status)).reduce((sum, target) => sum + Number(target.bags || 0), 0);
    const packed = Math.max(0, totalBags - sent - ready);
    const percent = totalBags ? Math.round((sent / totalBags) * 100) : 0;
    publicEls.distributionStatus.innerHTML = `
      <article>
        <span>Total paket tercatat</span>
        <strong>${totalBags}</strong>
      </article>
      <article>
        <span>Sudah tersalurkan</span>
        <strong>${sent}</strong>
      </article>
      <article>
        <span>Siap/terjadwal</span>
        <strong>${ready}</strong>
      </article>
      <article>
        <span>Proses pengemasan</span>
        <strong>${packed}</strong>
      </article>
      <div class="public-progress"><span style="width:${percent}%"></span></div>
      <small>${percent}% paket tujuan sudah berstatus tersalurkan. Data publik ini tidak menampilkan nama penerima.</small>
    `;
  }

  if (!publicEls.distributionTargets) return;
  if (!targets.length) {
    publicEls.distributionTargets.innerHTML = "";
    return;
  }

  publicEls.distributionTargets.innerHTML = `
    <h3>Tujuan distribusi per wilayah/masjid</h3>
    ${targets.map((target) => `
      <article>
        <div>
          <strong>${escapeHtml(target.destination)}</strong>
          <span>${escapeHtml(target.category || "Penerima")}</span>
        </div>
        <div>
          <b>${Number(target.bags || 0)} kantung</b>
          <small>${escapeHtml(target.pic || "-")} - ${escapeHtml(target.status || "-")}</small>
        </div>
      </article>
    `).join("")}
  `;
}

function renderPackages() {
  if (!publicEls.packageGrid) return;

  const packageTypes = ["Sapi", "Kambing", "Domba"].map((type) => {
    const items = publicAnimals.filter((animal) => animal.type === type);
    const cheapest = items.reduce((selected, animal) => {
      const total = Number(animal.price || 0) + Number(animal.cost || 0);
      if (!selected || total < selected.total) return { animal, total };
      return selected;
    }, null);
    const capacity = type === "Sapi" ? "1 ekor sapi untuk 7 orang" : `1 ekor ${type.toLowerCase()} untuk 1 orang`;
    const available = items.reduce((sum, animal) => sum + Number(animal.available || 0), 0);
    return {
      type,
      capacity,
      available,
      price: cheapest ? cheapest.total : 0,
      status: available > 0 ? "Tersedia" : "Menunggu stok",
    };
  });

  publicEls.packageGrid.innerHTML = packageTypes.map((item) => `
    <article class="package-card">
      <span>${escapeHtml(item.capacity)}</span>
      <h3>${escapeHtml(item.type)}</h3>
      <strong>${item.price ? money(item.price) : "Hubungi panitia"}</strong>
      <p>${item.available} slot peserta tersedia</p>
      <small>${escapeHtml(item.status)}</small>
    </article>
  `).join("");
}

function renderBookingOptions() {
  if (!publicEls.bookingSelect) return;
  const availableAnimals = publicAnimals.filter((animal) => Number(animal.available || 0) > 0);
  if (!availableAnimals.length) {
    publicEls.bookingSelect.innerHTML = '<option value="">Belum ada slot peserta tersedia</option>';
    if (publicEls.bookingPackageSelect) publicEls.bookingPackageSelect.innerHTML = '<option value="">Paket belum tersedia</option>';
    return;
  }

  publicEls.bookingSelect.innerHTML = availableAnimals.map((animal) => {
    return `<option value="${escapeHtml(animal.id)}">${escapeHtml(animal.code)} - ${escapeHtml(animal.type)} (${Number(animal.available || 0)} dari ${Number(animal.capacity || shareCapacity(animal.type))} slot tersedia)</option>`;
  }).join("");
  renderBookingPackageOptions();
}

function renderBookingPackageOptions() {
  if (!publicEls.bookingPackageSelect || !publicEls.bookingSelect) return;
  const animal = publicAnimals.find((item) => String(item.id) === String(publicEls.bookingSelect.value));
  const options = getPackageOptionsForAnimal(animal);
  publicEls.bookingPackageSelect.innerHTML = options.length
    ? options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join("")
    : '<option value="">Paket belum tersedia</option>';
}

function getCapacityText(animal) {
  if (animal.type === "Sapi") return "Patungan 1/7 atau 1 ekor penuh";
  return `1 ekor ${String(animal.type || "hewan").toLowerCase()} untuk 1 orang`;
}

function getFallbackAnimalPhoto(type) {
  if (type === "Kambing") return "assets/animal-kambing.svg";
  if (type === "Domba") return "assets/animal-domba.svg";
  return "assets/animal-sapi.svg";
}

function loadWithJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `qurbanCallback_${Date.now()}`;
    const script = document.createElement("script");
    const separator = url.includes("?") ? "&" : "?";

    window[callbackName] = (data) => {
      delete window[callbackName];
      script.remove();
      resolve(data);
    };

    script.onerror = () => {
      delete window[callbackName];
      script.remove();
      reject(new Error("Gagal memuat data Apps Script."));
    };

    script.src = `${url}${separator}action=publicAnimals&callback=${callbackName}`;
    document.body.appendChild(script);
  });
}

async function loadAnimals() {
  const config = window.QURBAN_CONFIG || {};
  const apiBaseUrl = config.apiBaseUrl || "";
  const appsScriptUrl = config.appsScriptUrl || "";

  if (apiBaseUrl && location.protocol !== "file:") {
    try {
      const data = await fetchJson(`${apiBaseUrl}?action=publicAnimals`);
      publicAnimals = data.animals && data.animals.length ? data.animals : demoAnimals;
      if (data.distribution) publicDistribution = data.distribution;
    } catch (error) {
      publicAnimals = demoAnimals;
    }
    renderPublicAnimals();
    return;
  }

  if (!appsScriptUrl) {
    const localData = getLocalPublicData();
    publicAnimals = localData ? localData.animals : demoAnimals.map((animal) => normalizePublicAnimal(animal));
    if (localData && localData.distribution) publicDistribution = localData.distribution;
    renderPublicAnimals();
    return;
  }

  try {
    const data = await loadWithJsonp(appsScriptUrl);
    publicAnimals = data.animals && data.animals.length ? data.animals : demoAnimals;
    if (data.distribution) publicDistribution = data.distribution;
  } catch (error) {
    publicAnimals = demoAnimals;
  }
  renderPublicAnimals();
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Request API gagal.");
  return response.json();
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) throw new Error(data.error || "Request API gagal.");
  return data;
}

async function submitLocalBooking(formData, animal) {
  const savedState = getLocalState();
  const state = savedState && Array.isArray(savedState.animals) ? savedState : makeInitialLocalState();

  const currentAnimal = state.animals.find((item) => String(item.id) === String(animal.id));
  if (!currentAnimal) throw new Error("Hewan tidak ditemukan di data lokal.");

  const participants = state.participants || [];
  const filled = participants
    .filter((participant) => String(participant.animalId) === String(animal.id))
    .reduce((sum, participant) => sum + participantShareUnits(participant, currentAnimal), 0);
  const requested = packageShareUnits(formData.packageType, currentAnimal);
  if (filled + requested > shareCapacity(currentAnimal.type)) throw new Error("Kuota hewan sudah penuh.");

  const invoice = nextLocalInvoice(state);
  participants.push(makeBookingPayload(formData, currentAnimal, invoice));
  state.participants = participants;
  setLocalState(state);

  const localData = getLocalPublicData();
  if (localData) {
    publicAnimals = localData.animals;
    if (localData.distribution) publicDistribution = localData.distribution;
  }
  return { invoice };
}

async function submitBooking(formData, animal) {
  const config = window.QURBAN_CONFIG || {};
  const apiBaseUrl = config.apiBaseUrl || "";

  if (apiBaseUrl && location.protocol !== "file:") {
    const data = await postJson(apiBaseUrl, {
      action: "publicBooking",
      payload: makeBookingPayload(formData, animal),
    });
    if (data.animals && data.animals.length) publicAnimals = data.animals;
    if (data.distribution) publicDistribution = data.distribution;
    return { invoice: data.participant && data.participant.token };
  }

  return submitLocalBooking(formData, animal);
}

async function checkInvoice(invoice) {
  const config = window.QURBAN_CONFIG || {};
  const apiBaseUrl = config.apiBaseUrl || "";
  const normalizedInvoice = String(invoice || "").trim().toUpperCase();

  if (apiBaseUrl && location.protocol !== "file:") {
    const data = await fetchJson(`${apiBaseUrl}?action=publicInvoice&invoice=${encodeURIComponent(normalizedInvoice)}`);
    if (!data.participant) return null;
    return data;
  }

  return findLocalInvoice(normalizedInvoice);
}

[publicEls.search, publicEls.type, publicEls.quota].forEach((element) => {
  element.addEventListener("input", renderPublicAnimals);
  element.addEventListener("change", renderPublicAnimals);
});

if (publicEls.bookingSelect) {
  publicEls.bookingSelect.addEventListener("change", renderBookingPackageOptions);
}

if (publicEls.bookingForm) {
  publicEls.bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!publicEls.bookingForm.reportValidity()) return;
    const formData = Object.fromEntries(new FormData(publicEls.bookingForm));
    const animal = publicAnimals.find((item) => item.id === formData.animalId);
    if (!animal) {
      publicEls.bookingResult.textContent = "Pilih hewan qurban terlebih dahulu.";
      return;
    }
    if (Number(animal.available || 0) <= 0) {
      publicEls.bookingResult.textContent = `${animal.code} - ${animal.type} sudah penuh. Silakan pilih hewan lain.`;
      renderBookingOptions();
      return;
    }

    const animalLabel = animal ? `${animal.code} - ${animal.type}` : "hewan qurban";
    publicEls.bookingResult.textContent = "Menyimpan booking dan membuat invoice...";

    try {
      const result = await submitBooking(formData, animal);
      publicEls.bookingResult.textContent = `Invoice booking ${result.invoice} berhasil dibuat untuk ${formData.name}. Simpan nomor ini untuk validasi panitia. Pilihan: ${animalLabel}, metode ${formData.paymentMethod}. Panitia akan menghubungi ${formData.phone}.`;
      publicEls.bookingForm.reset();
      renderPublicAnimals();
    } catch (error) {
      publicEls.bookingResult.textContent = error.message || "Booking gagal disimpan. Coba lagi atau hubungi panitia.";
    }
  });
}

if (publicEls.invoiceCheckForm) {
  publicEls.invoiceCheckForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!publicEls.invoiceCheckForm.reportValidity()) return;
    const formData = Object.fromEntries(new FormData(publicEls.invoiceCheckForm));
    publicEls.invoiceCheckResult.textContent = "Mengecek invoice...";

    try {
      const result = await checkInvoice(formData.invoice);
      if (!result || !result.participant) {
        publicEls.invoiceCheckResult.textContent = "Invoice tidak ditemukan. Pastikan nomor yang dimasukkan benar atau hubungi panitia.";
        return;
      }

      const participant = result.participant;
      const animal = result.animal;
      const remaining = Number(participant.due || 0) - Number(participant.paid || 0);
      const paymentText = remaining <= 0 ? "Lunas" : `Belum lunas, sisa ${money(remaining)}`;
      const animalText = animal ? `${animal.code} - ${animal.type}` : "Hewan belum tersedia";
      publicEls.invoiceCheckResult.textContent = `Invoice ${participant.token}: ${getBookingStatusLabel(participant.bookingStatus)}. Peserta ${participant.name}, pilihan ${animalText}. Status pembayaran: ${paymentText}.`;
    } catch (error) {
      publicEls.invoiceCheckResult.textContent = error.message || "Invoice gagal dicek. Coba lagi atau hubungi panitia.";
    }
  });
}

loadAnimals();
