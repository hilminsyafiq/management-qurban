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
  return toUtcIso(new Date());
}

function getSpreadsheetTimeZone() {
  try {
    return getSpreadsheet().getSpreadsheetTimeZone() || "UTC";
  } catch (error) {
    return "UTC";
  }
}

function isDateObject(value) {
  return Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime());
}

function toUtcIso(value) {
  if (!value) return "";
  if (isDateObject(value)) {
    return Utilities.formatDate(value, "UTC", "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  }

  const text = String(value || "").trim();
  if (!text) return "";
  const parsed = new Date(text);
  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, "UTC", "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  }
  return text;
}

function toDateOnly(value) {
  if (!value) return "";
  if (isDateObject(value)) {
    return Utilities.formatDate(value, getSpreadsheetTimeZone(), "yyyy-MM-dd");
  }

  const text = String(value || "").trim();
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const parsed = new Date(text);
  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, getSpreadsheetTimeZone(), "yyyy-MM-dd");
  }
  return text;
}

function normalizePayloadDates(value) {
  if (Array.isArray(value)) return value.map(normalizePayloadDates);
  if (!value || typeof value !== "object" || isDateObject(value)) return value;

  const next = {};
  Object.keys(value).forEach((key) => {
    const item = value[key];
    if (["createdAt", "updatedAt", "scannedAt", "at"].indexOf(key) !== -1) {
      next[key] = toUtcIso(item);
    } else if (["date", "start", "end", "schedule"].indexOf(key) !== -1) {
      next[key] = toDateOnly(item);
    } else {
      next[key] = normalizePayloadDates(item);
    }
  });
  return next;
}
