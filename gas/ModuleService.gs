function getModules() {
  const rows = readRows("Modules");
  const data = {};
  rows.forEach((row) => {
    try {
      data[row.key] = JSON.parse(row.value || "[]");
    } catch (error) {
      data[row.key] = String(row.value || "");
    }
  });
  return data;
}

function saveModules(payload) {
  const now = getNowIso();
  const keys = ["savers", "savings", "committee", "periods", "transactions", "meatYield", "recipients", "minutes"];
  const rows = keys.map((key) => ({
    key,
    value: JSON.stringify(Array.isArray(payload[key]) ? payload[key] : []),
    updatedAt: now,
  }));
  writeRows("Modules", APP_CONFIG.headers.modules, rows);
  return getModules();
}
