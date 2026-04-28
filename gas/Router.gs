function routeGet(event) {
  const action = getParam(event, "action", "publicAnimals");

  if (!isPublicGetAction(action)) requireAdminAccess(event);

  if (action === "setup") return setupSheets();
  if (action === "animals") return { animals: listAnimals(), participants: listParticipants(), summary: getSummary() };
  if (action === "publicAnimals") return getPublicAnimals();
  if (action === "publicInvoice") return getPublicInvoice(getParam(event, "invoice", ""));
  if (action === "participants") return { participants: listParticipants() };
  if (action === "distribution") return { distribution: getDistribution() };
  if (action === "state") return getFullState();

  throw new Error("Action GET tidak dikenal: " + action);
}

function routePost(event) {
  const body = parseJsonBody(event);
  const action = body.action || getParam(event, "action", "");
  const payload = body.payload || body;

  if (action === "publicBooking") return savePublicBooking(payload);

  requireAdminAccess(event, body);

  if (action === "saveAnimal") return { animal: saveAnimal(payload) };
  if (action === "deleteAnimal") return removeAnimal(payload.id);
  if (action === "saveParticipant") return { participant: saveParticipant(payload) };
  if (action === "deleteParticipant") return removeParticipant(payload.id);
  if (action === "saveDistribution") return { distribution: saveDistribution(payload) };
  if (action === "syncState") return syncState(payload, body.baseVersion);

  throw new Error("Action POST tidak dikenal: " + action);
}

function savePublicBooking(payload) {
  const animal = getAnimal(payload.animalId);
  if (!animal) throw new Error("Hewan tidak ditemukan.");
  const packageType = payload.packageType || (animal.type === "Sapi" ? "Patungan sapi" : animal.type + " individu");
  const total = Number(animal.price || 0) + Number(animal.cost || 0);
  const due = getPackageShareUnits(packageType, animal) >= getShareLimit(animal.type) ? total : Math.ceil(total / getShareLimit(animal.type));
  const participant = saveParticipant({
    id: "",
    token: "",
    name: payload.name,
    phone: payload.phone,
    address: payload.address,
    animalId: payload.animalId,
    packageType,
    paymentMethod: payload.paymentMethod,
    due,
    paid: 0,
    bookingStatus: "Menunggu validasi",
  });

  const publicData = getPublicAnimals();
  return {
    participant: sanitizePublicParticipant(participant),
    animals: publicData.animals,
    distribution: publicData.distribution,
    summary: publicData.summary,
  };
}

function sanitizePublicParticipant(participant) {
  if (!participant) return null;
  return {
    token: participant.token || "",
    name: participant.name || "",
    packageType: participant.packageType || "",
    paymentMethod: participant.paymentMethod || "",
    due: Number(participant.due || 0),
    paid: Number(participant.paid || 0),
    bookingStatus: participant.bookingStatus || "Menunggu validasi",
  };
}

function getFullState() {
  const modules = getModules();
  return {
    animals: listAnimals(),
    participants: listParticipants(),
    distribution: getDistribution(),
    modules,
    meta: modules.meta || { version: 1, updatedAt: getNowIso(), updatedBy: "backend" },
    summary: getSummary(),
  };
}

function getPublicAnimals() {
  const participants = listParticipants();
  const animals = listAnimals().map((animal) => {
    const capacity = getShareLimit(animal.type);
    const filled = participants
      .filter((participant) => String(participant.animalId) === String(animal.id))
      .reduce((sum, participant) => sum + getParticipantShareUnits(participant, animal), 0);
    return {
      id: animal.id,
      code: animal.code,
      type: animal.type,
      weight: animal.weight,
      age: animal.age,
      price: animal.price,
      cost: animal.cost,
      status: animal.status,
      schedule: animal.schedule,
      location: animal.location,
      carcassWeight: animal.carcassWeight,
      health: animal.health,
      photoUrl: animal.photoUrl,
      capacity,
      filled,
      available: Math.max(0, capacity - filled),
    };
  });

  return { animals, distribution: getDistribution(), summary: getSummary() };
}

function getPublicInvoice(invoice) {
  const normalizedInvoice = String(invoice || "").trim().toUpperCase();
  if (!normalizedInvoice) throw new Error("Nomor invoice wajib diisi.");
  const participant = listParticipants().find((item) => String(item.token || "").trim().toUpperCase() === normalizedInvoice);
  if (!participant) return { participant: null };
  const animal = listAnimals().find((item) => String(item.id) === String(participant.animalId));
  return {
    participant: sanitizePublicParticipant(participant),
    animal: animal ? {
      code: animal.code,
      type: animal.type,
    } : null,
  };
}

function syncState(payload, baseVersion) {
  payload = normalizePayloadDates(payload || {});
  const modulesBefore = getModules();
  const currentMeta = modulesBefore.meta || {};
  const currentVersion = Number(currentMeta.version || 0);
  const incomingVersion = Number(payload.meta && payload.meta.version || 0);
  const expectedVersion = Number(baseVersion || incomingVersion || 0);

  if (currentVersion > expectedVersion) {
    return {
      ok: false,
      conflict: true,
      error: "Data backend sudah berubah. Muat ulang data sebelum menyimpan ulang.",
      currentVersion,
      expectedVersion,
      state: getFullState(),
    };
  }

  const animals = payload.animals || [];
  const participants = payload.participants || [];
  const distribution = payload.distribution || {};
  const modules = payload.modules || {};
  const syncedDistributionModules = syncDistributionRecipientsPayload(distribution, modules);
  const nextMeta = payload.meta || {};
  nextMeta.version = Math.max(currentVersion, incomingVersion) || 1;
  nextMeta.updatedAt = toUtcIso(nextMeta.updatedAt) || getNowIso();
  syncedDistributionModules.modules.meta = nextMeta;

  writeRows(APP_CONFIG.sheets.animals, APP_CONFIG.headers.animals, animals.map(validateAnimal));
  writeRows(APP_CONFIG.sheets.participants, APP_CONFIG.headers.participants, participants.map(validateParticipant));
  saveDistribution(syncedDistributionModules.distribution);
  saveModules(syncedDistributionModules.modules);

  return getFullState();
}
