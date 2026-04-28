function listAnimals() {
  return readRows(APP_CONFIG.sheets.animals).map(normalizeAnimal);
}

function getAnimal(id) {
  return listAnimals().find((animal) => String(animal.id) === String(id)) || null;
}

function saveAnimal(payload) {
  const animal = validateAnimal(payload || {});
  const id = animal.id || Utilities.getUuid();
  const duplicateCode = listAnimals().some((item) => {
    return String(item.id) !== String(id)
      && String(item.code || "").trim().toUpperCase() === String(animal.code || "").trim().toUpperCase();
  });
  if (duplicateCode) throw new Error("Kode hewan sudah dipakai.");
  return normalizeAnimal(upsertRow(APP_CONFIG.sheets.animals, APP_CONFIG.headers.animals, id, animal));
}

function removeAnimal(id) {
  const used = listParticipants().some((participant) => String(participant.animalId) === String(id));
  if (used) throw new Error("Hewan masih memiliki peserta.");
  return deleteRow(APP_CONFIG.sheets.animals, APP_CONFIG.headers.animals, id);
}

function validateAnimal(payload) {
  if (!payload.code) throw new Error("Kode hewan wajib diisi.");
  if (!payload.type) throw new Error("Jenis hewan wajib diisi.");

  return {
    id: payload.id || "",
    code: String(payload.code).trim().toUpperCase(),
    type: String(payload.type).trim(),
    weight: Number(payload.weight || 0),
    age: String(payload.age || "").trim(),
    price: Number(payload.price || 0),
    cost: Number(payload.cost || 0),
    status: payload.status || "booking",
    schedule: toLocalDateTime(payload.schedule),
    location: String(payload.location || "").trim(),
    carcassWeight: Number(payload.carcassWeight || 0),
    brightEyes: payload.brightEyes === true || payload.brightEyes === "TRUE" || payload.health && payload.health.brightEyes === true,
    healthyCoat: payload.healthyCoat === true || payload.healthyCoat === "TRUE" || payload.health && payload.health.healthyCoat === true,
    noDefect: payload.noDefect === true || payload.noDefect === "TRUE" || payload.health && payload.health.noDefect === true,
    photoUrl: payload.photoUrl || "",
    createdAt: toUtcIso(payload.createdAt),
    updatedAt: toUtcIso(payload.updatedAt),
  };
}

function normalizeAnimal(row) {
  return {
    id: String(row.id || ""),
    code: String(row.code || ""),
    type: String(row.type || ""),
    weight: Number(row.weight || 0),
    age: String(row.age || ""),
    price: Number(row.price || 0),
    cost: Number(row.cost || 0),
    status: String(row.status || "booking"),
    schedule: toLocalDateTime(row.schedule),
    location: String(row.location || ""),
    carcassWeight: Number(row.carcassWeight || 0),
    health: {
      brightEyes: row.brightEyes === true || row.brightEyes === "TRUE",
      healthyCoat: row.healthyCoat === true || row.healthyCoat === "TRUE",
      noDefect: row.noDefect === true || row.noDefect === "TRUE",
    },
    photoUrl: row.photoUrl ? String(row.photoUrl) : "",
    createdAt: toUtcIso(row.createdAt),
    updatedAt: toUtcIso(row.updatedAt),
  };
}

function getShareLimit(type) {
  return type === "Sapi" ? 7 : 1;
}

function getParticipantShareUnits(participant, animal) {
  if (animal && animal.type === "Sapi" && participant.packageType === "Sapi penuh keluarga") return 7;
  return 1;
}

function getPackageShareUnits(packageType, animal) {
  if (animal && animal.type === "Sapi" && packageType === "Sapi penuh keluarga") return 7;
  return 1;
}
