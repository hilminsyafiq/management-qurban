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
    photoUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=82",
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
    photoUrl: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1200&q=82",
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
    photoUrl: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=1200&q=82",
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
  packageGrid: document.querySelector("#packageGrid"),
  gallery: document.querySelector("#animalGallery"),
  bookingForm: document.querySelector("#bookingForm"),
  bookingSelect: document.querySelector("#bookingAnimalSelect"),
  bookingResult: document.querySelector("#bookingResult"),
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
  renderPackages();
  renderGallery();
  renderBookingOptions();

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
              <span>Sisa peserta</span>
              <strong>${Number(animal.available || 0)}</strong>
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

function renderGallery() {
  if (!publicEls.gallery) return;
  const galleryItems = publicAnimals.slice(0, 6);
  if (!galleryItems.length) {
    publicEls.gallery.innerHTML = "";
    return;
  }

  publicEls.gallery.innerHTML = galleryItems.map((animal) => {
    const photoUrl = animal.photoUrl || getFallbackAnimalPhoto(animal.type);
    const fallbackPhoto = getFallbackAnimalPhoto(animal.type);
    return `
      <figure>
        <img src="${escapeHtml(photoUrl)}" alt="Galeri ${escapeHtml(animal.type)} ${escapeHtml(animal.code)}" loading="lazy" onerror="this.onerror=null;this.src='${escapeHtml(fallbackPhoto)}';" />
        <figcaption>${escapeHtml(animal.code)} - ${escapeHtml(animal.type)}</figcaption>
      </figure>
    `;
  }).join("");
}

function renderBookingOptions() {
  if (!publicEls.bookingSelect) return;
  const availableAnimals = publicAnimals.filter((animal) => Number(animal.available || 0) > 0);
  if (!availableAnimals.length) {
    publicEls.bookingSelect.innerHTML = '<option value="">Belum ada slot peserta tersedia</option>';
    return;
  }

  publicEls.bookingSelect.innerHTML = availableAnimals.map((animal) => {
    return `<option value="${escapeHtml(animal.id)}">${escapeHtml(animal.code)} - ${escapeHtml(animal.type)} (${Number(animal.available || 0)} slot peserta)</option>`;
  }).join("");
}

function getCapacityText(animal) {
  if (animal.type === "Sapi") return "1 ekor sapi untuk 7 orang";
  return `1 ekor ${String(animal.type || "hewan").toLowerCase()} untuk 1 orang`;
}

function getFallbackAnimalPhoto(type) {
  if (type === "Kambing") return "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1200&q=82";
  if (type === "Domba") return "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=1200&q=82";
  return "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=82";
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

if (publicEls.bookingForm) {
  publicEls.bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(publicEls.bookingForm));
    const animal = publicAnimals.find((item) => item.id === formData.animalId);
    const animalLabel = animal ? `${animal.code} - ${animal.type}` : "hewan qurban";
    publicEls.bookingResult.textContent = `Terima kasih, ${formData.name}. Minat booking ${animalLabel} sudah dicatat sementara. Panitia akan menghubungi ${formData.phone}.`;
    publicEls.bookingForm.reset();
    renderBookingOptions();
  });
}

loadAnimals();
