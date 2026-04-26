function routeGet(event) {
  const action = getParam(event, "action", "publicAnimals");

  if (!isPublicGetAction(action)) requireAdminAccess(event);

  if (action === "setup") return setupSheets();
  if (action === "animals") return { animals: listAnimals(), participants: listParticipants(), summary: getSummary() };
  if (action === "publicAnimals") return getPublicAnimals();
  if (action === "participants") return { participants: listParticipants() };
  if (action === "distribution") return { distribution: getDistribution() };
  if (action === "state") return getFullState();

  throw new Error("Action GET tidak dikenal: " + action);
}

function routePost(event) {
  const body = parseJsonBody(event);
  const action = body.action || getParam(event, "action", "");
  const payload = body.payload || body;

  requireAdminAccess(event, body);

  if (action === "saveAnimal") return { animal: saveAnimal(payload) };
  if (action === "deleteAnimal") return removeAnimal(payload.id);
  if (action === "saveParticipant") return { participant: saveParticipant(payload) };
  if (action === "deleteParticipant") return removeParticipant(payload.id);
  if (action === "saveDistribution") return { distribution: saveDistribution(payload) };
  if (action === "syncState") return syncState(payload);

  throw new Error("Action POST tidak dikenal: " + action);
}

function getFullState() {
  return {
    animals: listAnimals(),
    participants: listParticipants(),
    distribution: getDistribution(),
    modules: getModules(),
    summary: getSummary(),
  };
}

function getPublicAnimals() {
  const participants = listParticipants();
  const animals = listAnimals().map((animal) => {
    const filled = participants.filter((participant) => String(participant.animalId) === String(animal.id)).length;
    const capacity = getShareLimit(animal.type);
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

function syncState(payload) {
  const animals = payload.animals || [];
  const participants = payload.participants || [];
  const distribution = payload.distribution || {};
  const modules = payload.modules || {};

  writeRows(APP_CONFIG.sheets.animals, APP_CONFIG.headers.animals, animals.map(validateAnimal));
  writeRows(APP_CONFIG.sheets.participants, APP_CONFIG.headers.participants, participants.map(validateParticipant));
  saveDistribution(distribution);
  saveModules(modules);

  return getFullState();
}
