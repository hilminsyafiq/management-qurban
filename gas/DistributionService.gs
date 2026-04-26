function getDistribution() {
  const rows = readRows(APP_CONFIG.sheets.distribution);
  const data = { warga: 0, mustahik: 0, panitia: 0, peserta: 0, notes: "", targets: [] };
  rows.forEach((row) => {
    if (row.key === "targets") {
      try {
        data.targets = JSON.parse(row.value || "[]");
      } catch (error) {
        data.targets = [];
      }
    } else {
      data[row.key] = ["notes"].includes(row.key) ? String(row.value || "") : Number(row.value || 0);
    }
  });
  return data;
}

function saveDistribution(payload) {
  const now = getNowIso();
  const data = {
    warga: Number(payload.warga || 0),
    mustahik: Number(payload.mustahik || 0),
    panitia: Number(payload.panitia || 0),
    peserta: Number(payload.peserta || 0),
    notes: String(payload.notes || "").trim(),
    targets: Array.isArray(payload.targets) ? payload.targets : [],
  };
  const rows = Object.keys(data).map((key) => ({ key, value: key === "targets" ? JSON.stringify(data[key]) : data[key], updatedAt: now }));
  writeRows(APP_CONFIG.sheets.distribution, APP_CONFIG.headers.distribution, rows);
  return data;
}
