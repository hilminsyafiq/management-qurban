const APP_CONFIG = {
  spreadsheetId: "",
  sheets: {
    animals: "Animals",
    participants: "Participants",
    distribution: "Distribution",
  },
  headers: {
    animals: ["id", "code", "type", "weight", "age", "price", "cost", "status", "schedule", "location", "carcassWeight", "brightEyes", "healthyCoat", "noDefect", "photoUrl", "createdAt", "updatedAt"],
    participants: ["id", "token", "name", "phone", "address", "animalId", "packageType", "paymentMethod", "due", "paid", "bookingStatus", "createdAt", "updatedAt"],
    distribution: ["key", "value", "updatedAt"],
    modules: ["key", "value", "updatedAt"],
  },
};

function getSpreadsheet() {
  const id = getScriptProperty("SPREADSHEET_ID") || APP_CONFIG.spreadsheetId;
  if (id) return SpreadsheetApp.openById(id);
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getNowIso() {
  return new Date().toISOString();
}
