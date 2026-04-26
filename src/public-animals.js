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

let publicAnimals = [];

const publicEls = {
  list: document.querySelector("#publicAnimalList"),
  totalAnimals: document.querySelector("#publicTotalAnimals"),
  availableShares: document.querySelector("#publicAvailableShares"),
  search: document.querySelector("#searchInput"),
  type: document.querySelector("#typeFilter"),
  quota: document.querySelector("#quotaFilter"),
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

  if (!filtered.length) {
    publicEls.list.innerHTML = '<div class="empty-state">Tidak ada hewan yang cocok dengan filter saat ini.</div>';
    return;
  }

  publicEls.list.innerHTML = filtered.map((animal) => {
    const percent = Math.min(100, (Number(animal.filled || 0) / Number(animal.capacity || 1)) * 100);
    const totalPrice = Number(animal.price || 0) + Number(animal.cost || 0);
    const isFull = Number(animal.available || 0) <= 0;
    const photoUrl = animal.photoUrl || getFallbackAnimalPhoto(animal.type);

    return `
      <article class="animal-item">
        <div class="animal-photo-wrap">
          <img class="animal-photo" src="${escapeHtml(photoUrl)}" alt="Foto ${escapeHtml(animal.type)} ${escapeHtml(animal.code)}" loading="lazy" />
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
              <span>Sisa kuota</span>
              <strong>${Number(animal.available || 0)}</strong>
            </div>
          </div>
        </div>
        <div>
          <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
          <div class="quota-text">${Number(animal.filled || 0)}/${Number(animal.capacity || 0)} kuota terisi</div>
        </div>
      </article>
    `;
  }).join("");
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
    } catch (error) {
      publicAnimals = demoAnimals;
    }
    renderPublicAnimals();
    return;
  }

  if (!appsScriptUrl) {
    publicAnimals = demoAnimals;
    renderPublicAnimals();
    return;
  }

  try {
    const data = await loadWithJsonp(appsScriptUrl);
    publicAnimals = data.animals && data.animals.length ? data.animals : demoAnimals;
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

[publicEls.search, publicEls.type, publicEls.quota].forEach((element) => {
  element.addEventListener("input", renderPublicAnimals);
  element.addEventListener("change", renderPublicAnimals);
});

loadAnimals();
