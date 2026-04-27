function getDistribution() {
  const rows = readRows(APP_CONFIG.sheets.distribution);
  const data = { warga: 0, mustahik: 0, panitia: 0, peserta: 0, notes: "", targets: [] };
  rows.forEach((row) => {
    if (row.key === "targets") {
      try {
        data.targets = normalizePayloadDates(JSON.parse(row.value || "[]"));
      } catch (error) {
        data.targets = [];
      }
    } else {
      data[row.key] = ["notes"].includes(row.key) ? String(row.value || "") : Number(row.value || 0);
    }
  });
  return data;
}

function getDistributionRecipientKey(name, category) {
  return String(name || "").trim().toLowerCase() + "|" + String(category || "").trim().toLowerCase();
}

function moduleRecipientFromDistributionTarget(target) {
  return {
    name: String(target.destination || "").trim(),
    category: target.category || "Warga",
    bags: String(Number(target.bags || 0)),
    status: target.status || "Belum diproses",
  };
}

function syncDistributionRecipientsPayload(distribution, modules) {
  distribution = distribution || {};
  modules = modules || {};
  distribution.targets = Array.isArray(distribution.targets) ? distribution.targets : [];
  modules.recipients = Array.isArray(modules.recipients) ? modules.recipients : [];

  const targetKeys = {};
  distribution.targets.forEach((target) => {
    targetKeys[getDistributionRecipientKey(target.destination, target.category)] = true;
  });
  modules.recipients.forEach((recipient) => {
    const key = getDistributionRecipientKey(recipient.name, recipient.category);
    if (!recipient.name || targetKeys[key]) return;
    distribution.targets.push({
      destination: String(recipient.name || "").trim(),
      category: recipient.category || "Warga",
      bags: Number(recipient.bags || 0),
      pic: "",
      status: recipient.status || "Belum diproses",
      recipients: [],
    });
    targetKeys[key] = true;
  });

  const merged = {};
  const ordered = [];
  distribution.targets.forEach((target) => {
    const normalized = {
      destination: String(target.destination || "").trim(),
      category: target.category || "Warga",
      bags: Number(target.bags || 0),
      pic: target.pic || "",
      status: target.status || "Belum diproses",
      recipients: Array.isArray(target.recipients) ? target.recipients : [],
    };
    if (!normalized.destination) return;
    const key = getDistributionRecipientKey(normalized.destination, normalized.category);
    if (!merged[key]) {
      merged[key] = normalized;
      ordered.push(normalized);
      return;
    }
    merged[key].bags = Number(merged[key].bags || 0) || Number(normalized.bags || 0);
    merged[key].pic = merged[key].pic || normalized.pic || "";
    merged[key].status = merged[key].status || normalized.status;
    merged[key].recipients = merged[key].recipients.concat(normalized.recipients);
  });

  distribution.targets = ordered;
  modules.recipients = ordered.map(moduleRecipientFromDistributionTarget);
  return { distribution, modules };
}

function saveDistribution(payload) {
  const now = getNowIso();
  const data = {
    warga: Number(payload.warga || 0),
    mustahik: Number(payload.mustahik || 0),
    panitia: Number(payload.panitia || 0),
    peserta: Number(payload.peserta || 0),
    notes: String(payload.notes || "").trim(),
    targets: normalizePayloadDates(Array.isArray(payload.targets) ? payload.targets : []),
  };
  const modules = getModules();
  modules.recipients = data.targets.map(moduleRecipientFromDistributionTarget);
  const rows = Object.keys(data).map((key) => ({ key, value: key === "targets" ? JSON.stringify(data[key]) : data[key], updatedAt: now }));
  writeRows(APP_CONFIG.sheets.distribution, APP_CONFIG.headers.distribution, rows);
  saveModules(modules);
  return data;
}
