function doGet(event) {
  try {
    return publicResponse(event, routeGet(event));
  } catch (error) {
    return publicResponse(event, { error: error.message, details: error.stack }, false);
  }
}

function doPost(event) {
  try {
    return jsonResponse(routePost(event));
  } catch (error) {
    return errorResponse(error.message, error.stack);
  }
}

function installBackend() {
  return setupSheets();
}

function installSecureBackend() {
  const properties = setupBackendProperties();
  const sheets = setupSheets();
  return { properties, sheets };
}
