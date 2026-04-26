const STORAGE_KEY = "qurbanops-state-v1";

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
      photoUrl: "assets/animal-sapi.svg",
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
      photoUrl: "assets/animal-kambing.svg",
    },
  ],
  participants: [],
  distribution: {
    warga: 120,
    mustahik: 48,
    panitia: 20,
    peserta: 16,
    notes: "Prioritaskan mustahik dan warga sekitar masjid.",
  },
};

defaultState.participants = [
  {
    id: crypto.randomUUID(),
    name: "Ahmad Fauzi",
    phone: "0812-1111-2222",
    animalId: defaultState.animals[0].id,
    due: 4300000,
    paid: 4300000,
  },
  {
    id: crypto.randomUUID(),
    name: "Siti Aminah",
    phone: "0812-3333-4444",
    animalId: defaultState.animals[0].id,
    due: 4300000,
    paid: 2500000,
  },
  {
    id: crypto.randomUUID(),
    name: "Ridwan Hakim",
    phone: "0812-5555-6666",
    animalId: defaultState.animals[1].id,
    due: 3850000,
    paid: 1000000,
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

async function loadRemoteState() {
  if (!canUseRemoteApi()) return false;

  try {
    const response = await fetch(`${getApiBaseUrl()}?action=state`, {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();
    if (!response.ok || data.ok === false) throw new Error(data.error || "Gagal memuat data backend.");

    state = {
      animals: Array.isArray(data.animals) ? data.animals : [],
      participants: Array.isArray(data.participants) ? data.participants : [],
      distribution: data.distribution || structuredClone(defaultState.distribution),
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
  renderValidation();
  fillAnimalOptions();
  saveState();
}

function renderSummary() {
  const totalCapacity = state.animals.reduce((sum, animal) => sum + shareLimit(animal.type), 0);
  const filled = state.participants.length;
  const paid = state.participants.reduce((sum, participant) => sum + Number(participant.paid || 0), 0);
  const packages = Object.entries(state.distribution)
    .filter(([key]) => key !== "notes")
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
    els.participantsTable.innerHTML = '<tr><td colspan="7">Belum ada peserta qurban.</td></tr>';
    return;
  }

  els.participantsTable.innerHTML = state.participants
    .map((participant) => {
      const animal = state.animals.find((item) => item.id === participant.animalId);
      const remaining = Number(participant.due) - Number(participant.paid);
      const className = remaining <= 0 ? "" : "warn";
      return `
        <tr>
          <td><strong>${escapeHtml(participant.name)}</strong></td>
          <td>${escapeHtml(participant.phone)}</td>
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
    if (els.distributionForm.elements[key]) {
      els.distributionForm.elements[key].value = value;
    }
  });
}

function renderValidation() {
  const issues = [];

  state.animals.forEach((animal) => {
    const count = participantsFor(animal.id).length;
    const capacity = shareLimit(animal.type);
    if (count > capacity) issues.push(`${animal.code} melebihi kuota ${capacity} peserta.`);
    if (count === 0) issues.push(`${animal.code} belum punya peserta.`);
    if (!animal.schedule) issues.push(`${animal.code} belum punya jadwal sembelih.`);
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
  document.querySelector("#animalDialogTitle").textContent = animalId ? "Edit hewan" : "Tambah hewan";

  if (animalId) {
    const animal = state.animals.find((item) => item.id === animalId);
    Object.entries(animal).forEach(([key, value]) => {
      if (form.elements[key]) form.elements[key].value = value;
    });
  } else {
    form.elements.id.value = "";
    form.elements.status.value = "booking";
    form.elements.code.value = nextAnimalCode();
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
    form.elements.due.value = suggestDue(form.elements.animalId.value);
    form.elements.paid.value = 0;
  }

  els.participantDialog.showModal();
}

function saveAnimal() {
  const form = els.animalForm;
  if (!form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form));
  const animal = {
    id: data.id || crypto.randomUUID(),
    code: data.code.trim().toUpperCase(),
    type: data.type,
    weight: Number(data.weight),
    price: Number(data.price),
    cost: Number(data.cost),
    status: data.status,
    schedule: data.schedule,
    photoUrl: data.photoUrl,
  };

  const index = state.animals.findIndex((item) => item.id === animal.id);
  if (index >= 0) state.animals[index] = animal;
  else state.animals.push(animal);

  els.animalDialog.close();
  render();
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
    name: data.name.trim(),
    phone: data.phone.trim(),
    animalId: data.animalId,
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
  };
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
document.querySelector("#resetDemoBtn").addEventListener("click", () => {
  state = structuredClone(defaultState);
  render();
});

els.statusFilter.addEventListener("change", renderAnimalBoard);
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
  await loadRemoteState();
  render();
}

bootstrap();
