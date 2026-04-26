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
  const keys = [
    "savers",
    "savings",
    "committee",
    "periods",
    "transactions",
    "meatYield",
    "recipients",
    "minutes",
    "appSettings",
    "areas",
    "users",
    "coupons",
    "scanHistory",
    "profile",
  ];
  const rows = keys.map((key) => {
    const fallback = ["appSettings", "profile"].indexOf(key) !== -1 ? {} : [];
    const value = payload[key] === undefined ? fallback : payload[key];
    return {
      key,
      value: JSON.stringify(value),
      updatedAt: now,
    };
  });
  writeRows("Modules", APP_CONFIG.headers.modules, rows);
  return getModules();
}
