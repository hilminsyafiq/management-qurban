const ALLOWED_GET_ACTIONS = new Set([
  "publicAnimals",
  "animals",
  "participants",
  "distribution",
  "state",
  "setup",
]);

const ALLOWED_POST_ACTIONS = new Set([
  "saveAnimal",
  "deleteAnimal",
  "saveParticipant",
  "deleteParticipant",
  "saveDistribution",
  "syncState",
]);

export default async function handler(request, response) {
  const gasUrl = process.env.GAS_WEB_APP_URL;
  const adminToken = process.env.GAS_ADMIN_TOKEN;

  if (!gasUrl) {
    response.status(500).json({
      ok: false,
      error: "Environment variable GAS_WEB_APP_URL belum diatur di Vercel.",
    });
    return;
  }

  try {
    if (request.method === "GET") {
      await handleGet(request, response, gasUrl, adminToken);
      return;
    }

    if (request.method === "POST") {
      await handlePost(request, response, gasUrl, adminToken);
      return;
    }

    response.setHeader("Allow", "GET, POST");
    response.status(405).json({ ok: false, error: "Method tidak didukung." });
  } catch (error) {
    response.status(502).json({
      ok: false,
      error: "Gagal meneruskan request ke Google Apps Script.",
      details: error.message,
    });
  }
}

async function handleGet(request, response, gasUrl, adminToken) {
  const action = getQueryValue(request.query.action) || "publicAnimals";
  if (!ALLOWED_GET_ACTIONS.has(action)) {
    response.status(400).json({ ok: false, error: "Action GET tidak diizinkan." });
    return;
  }

  if (action !== "publicAnimals" && !adminToken) {
    response.status(500).json({
      ok: false,
      error: "Environment variable GAS_ADMIN_TOKEN belum diatur di Vercel.",
    });
    return;
  }

  const url = new URL(gasUrl);
  url.searchParams.set("action", action);
  if (action !== "publicAnimals") {
    url.searchParams.set("adminToken", adminToken);
    url.searchParams.set("adminPassword", getAdminPassword(request));
  }

  const gasResponse = await fetch(url.toString(), { method: "GET" });
  const payload = await readJson(gasResponse);
  response.status(getResponseStatus(gasResponse, payload)).json(payload);
}

async function handlePost(request, response, gasUrl, adminToken) {
  const action = request.body && request.body.action;
  if (!ALLOWED_POST_ACTIONS.has(action)) {
    response.status(400).json({ ok: false, error: "Action POST tidak diizinkan." });
    return;
  }

  if (!adminToken) {
    response.status(500).json({
      ok: false,
      error: "Environment variable GAS_ADMIN_TOKEN belum diatur di Vercel.",
    });
    return;
  }

  const gasResponse = await fetch(gasUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...request.body, adminToken, adminPassword: getAdminPassword(request) }),
  });

  const payload = await readJson(gasResponse);
  response.status(getResponseStatus(gasResponse, payload)).json(payload);
}

async function readJson(fetchResponse) {
  const text = await fetchResponse.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: "Response Google Apps Script bukan JSON valid.",
      raw: text.slice(0, 500),
    };
  }
}

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function getResponseStatus(fetchResponse, payload) {
  if (!fetchResponse.ok) return fetchResponse.status;
  return payload && payload.ok === false ? 400 : 200;
}

function getAdminPassword(request) {
  const provided = request.headers["x-admin-password"];
  return typeof provided === "string" ? provided : "";
}
