function setupSheets() {
  const spreadsheet = getSpreadsheet();
  ensureSheet(spreadsheet, APP_CONFIG.sheets.animals, APP_CONFIG.headers.animals);
  ensureSheet(spreadsheet, APP_CONFIG.sheets.participants, APP_CONFIG.headers.participants);
  ensureSheet(spreadsheet, APP_CONFIG.sheets.distribution, APP_CONFIG.headers.distribution);
  ensureSheet(spreadsheet, "Modules", APP_CONFIG.headers.modules);
  return { message: "Sheet backend siap digunakan." };
}

function ensureSheet(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);

  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = currentHeaders.some((value) => value);
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getSheet(name) {
  setupSheets();
  return getSpreadsheet().getSheetByName(name);
}

function readRows(name) {
  const sheet = getSheet(name);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  return values.slice(1).filter((row) => row.some((cell) => cell !== "")).map((row) => {
    return headers.reduce((record, header, index) => {
      record[header] = row[index];
      return record;
    }, {});
  });
}

function writeRows(name, headers, rows) {
  const sheet = getSheet(name);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) {
    const values = rows.map((row) => headers.map((header) => row[header] === undefined ? "" : row[header]));
    sheet.getRange(2, 1, values.length, headers.length).setValues(values);
  }
}

function upsertRow(name, headers, id, data) {
  const rows = readRows(name);
  const now = getNowIso();
  const index = rows.findIndex((row) => String(row.id) === String(id));
  const next = { ...data, id, updatedAt: now };

  if (index >= 0) {
    next.createdAt = rows[index].createdAt || now;
    rows[index] = { ...rows[index], ...next };
  } else {
    next.createdAt = now;
    rows.push(next);
  }

  writeRows(name, headers, rows);
  return next;
}

function deleteRow(name, headers, id) {
  const rows = readRows(name);
  const nextRows = rows.filter((row) => String(row.id) !== String(id));
  writeRows(name, headers, nextRows);
  return { deleted: rows.length !== nextRows.length };
}
