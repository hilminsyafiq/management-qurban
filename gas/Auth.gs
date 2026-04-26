const PUBLIC_GET_ACTIONS = ["publicAnimals"];

function requireAdminToken(event, body) {
  const expectedToken = getScriptProperty("ADMIN_TOKEN");
  if (!expectedToken) {
    throw new Error("ADMIN_TOKEN belum terbaca dari Script Properties project Apps Script yang sedang dipakai Web App.");
  }

  const token = getAdminToken(event, body);
  if (!token || token !== expectedToken) {
    throw new Error("Token admin tidak valid.");
  }
}

function requireAdminAccess(event, body) {
  requireAdminToken(event, body);
  if (hasValidAdminPassword(event, body) || hasValidUserAccount(event, body)) return;
  throw new Error("Akun atau password tidak valid.");
}

function requireAdminPassword(event, body) {
  if (hasValidAdminPassword(event, body)) return;
  throw new Error("Password admin tidak valid.");
}

function hasValidAdminPassword(event, body) {
  const expectedPassword = getScriptProperty("ADMIN_PASSWORD");
  if (!expectedPassword) {
    throw new Error("ADMIN_PASSWORD belum terbaca dari Script Properties project Apps Script yang sedang dipakai Web App.");
  }

  const password = getAdminPassword(event, body);
  return Boolean(password && password === expectedPassword);
}

function hasValidUserAccount(event, body) {
  const username = getLoginUsername(event, body).toLowerCase();
  const password = getLoginPassword(event, body);
  if (!username || !password) return false;

  const modules = getModules();
  const users = Array.isArray(modules.users) ? modules.users : [];
  return users.some((user) => {
    return String(user.status || "Aktif") === "Aktif"
      && String(user.username || "").trim().toLowerCase() === username
      && String(user.password || "") === password;
  });
}

function isPublicGetAction(action) {
  return PUBLIC_GET_ACTIONS.indexOf(action) !== -1;
}

function getAdminToken(event, body) {
  const fromBody = body && (body.adminToken || body.token);
  const fromParam = getParam(event, "adminToken", "") || getParam(event, "token", "");
  return String(fromBody || fromParam || "").trim();
}

function getAdminPassword(event, body) {
  const fromBody = body && body.adminPassword;
  const fromParam = getParam(event, "adminPassword", "");
  return String(fromBody || fromParam || "").trim();
}

function getLoginUsername(event, body) {
  const fromBody = body && body.loginUsername;
  const fromParam = getParam(event, "loginUsername", "");
  return String(fromBody || fromParam || "").trim();
}

function getLoginPassword(event, body) {
  const fromBody = body && body.loginPassword;
  const fromParam = getParam(event, "loginPassword", "");
  return String(fromBody || fromParam || "").trim();
}

function getScriptProperty(key) {
  return String(PropertiesService.getScriptProperties().getProperty(key) || "").trim();
}

function setBackendProperties(properties) {
  PropertiesService.getScriptProperties().setProperties(properties, false);
  return { message: "Script Properties berhasil disimpan." };
}

function setupBackendProperties() {
  const current = PropertiesService.getScriptProperties().getProperties();
  const nextToken = current.ADMIN_TOKEN || Utilities.getUuid() + "-" + Utilities.getUuid();
  const nextPassword = current.ADMIN_PASSWORD || "admin-qurban-" + Utilities.getUuid().slice(0, 8);
  const nextSpreadsheetId = current.SPREADSHEET_ID || APP_CONFIG.spreadsheetId || "";

  PropertiesService.getScriptProperties().setProperties({
    ADMIN_TOKEN: nextToken,
    ADMIN_PASSWORD: nextPassword,
    SPREADSHEET_ID: nextSpreadsheetId,
  }, false);

  return {
    message: "Script Properties siap.",
    adminToken: nextToken,
    adminPassword: nextPassword,
    spreadsheetId: nextSpreadsheetId,
  };
}

function checkBackendProperties() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const adminToken = String(properties.ADMIN_TOKEN || "").trim();
  const adminPassword = String(properties.ADMIN_PASSWORD || "").trim();
  const spreadsheetId = String(properties.SPREADSHEET_ID || "").trim();

  return {
    hasAdminToken: Boolean(adminToken),
    adminTokenLength: adminToken.length,
    adminTokenPreview: adminToken ? adminToken.slice(0, 6) + "..." + adminToken.slice(-4) : "",
    hasAdminPassword: Boolean(adminPassword),
    adminPasswordLength: adminPassword.length,
    hasSpreadsheetId: Boolean(spreadsheetId),
    spreadsheetId,
    propertyKeys: Object.keys(properties).sort(),
  };
}
