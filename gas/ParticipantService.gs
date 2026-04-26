function listParticipants() {
  return readRows(APP_CONFIG.sheets.participants).map(normalizeParticipant);
}

function saveParticipant(payload) {
  const participant = validateParticipant(payload || {});
  const id = participant.id || Utilities.getUuid();
  const animal = getAnimal(participant.animalId);
  if (!animal) throw new Error("Hewan tidak ditemukan.");

  const existingShares = listParticipants().filter((item) => {
    return String(item.animalId) === String(participant.animalId) && String(item.id) !== String(id);
  }).length;

  if (existingShares >= getShareLimit(animal.type)) {
    throw new Error("Kuota hewan sudah penuh.");
  }

  return normalizeParticipant(upsertRow(APP_CONFIG.sheets.participants, APP_CONFIG.headers.participants, id, participant));
}

function removeParticipant(id) {
  return deleteRow(APP_CONFIG.sheets.participants, APP_CONFIG.headers.participants, id);
}

function validateParticipant(payload) {
  if (!payload.name) throw new Error("Nama peserta wajib diisi.");
  if (!payload.phone) throw new Error("Nomor telepon wajib diisi.");
  if (!payload.animalId) throw new Error("Hewan wajib dipilih.");

  return {
    id: payload.id || "",
    token: payload.token || makeParticipantToken(),
    name: String(payload.name).trim(),
    phone: String(payload.phone).trim(),
    address: String(payload.address || "").trim(),
    animalId: String(payload.animalId),
    packageType: String(payload.packageType || "").trim(),
    paymentMethod: String(payload.paymentMethod || "").trim(),
    due: Number(payload.due || 0),
    paid: Number(payload.paid || 0),
  };
}

function normalizeParticipant(row) {
  return {
    id: String(row.id || ""),
    token: String(row.token || ""),
    name: String(row.name || ""),
    phone: String(row.phone || ""),
    address: String(row.address || ""),
    animalId: String(row.animalId || ""),
    packageType: String(row.packageType || ""),
    paymentMethod: String(row.paymentMethod || ""),
    due: Number(row.due || 0),
    paid: Number(row.paid || 0),
    createdAt: row.createdAt || "",
    updatedAt: row.updatedAt || "",
  };
}

function makeParticipantToken() {
  const rows = readRows(APP_CONFIG.sheets.participants);
  const nextNumber = rows.reduce((max, row) => {
    const match = String(row.token || "").match(/QBN-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return "QBN-" + String(nextNumber).padStart(4, "0");
}
