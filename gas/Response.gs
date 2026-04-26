function jsonResponse(payload, status) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: status !== false, ...payload }))
    .setMimeType(ContentService.MimeType.JSON);
}

function publicResponse(event, payload, status) {
  const body = { ok: status !== false, ...payload };
  const callback = getParam(event, "callback", "");
  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + JSON.stringify(body) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return jsonResponse(payload, status);
}

function errorResponse(message, details) {
  return jsonResponse({ error: message, details: details || null }, false);
}

function parseJsonBody(event) {
  if (!event || !event.postData || !event.postData.contents) return {};
  try {
    return JSON.parse(event.postData.contents);
  } catch (error) {
    throw new Error("Body JSON tidak valid.");
  }
}

function getParam(event, key, fallback) {
  return event && event.parameter && event.parameter[key] ? event.parameter[key] : fallback;
}
