function getSummary() {
  const animals = listAnimals();
  const participants = listParticipants();
  const distribution = getDistribution();
  const capacity = animals.reduce((sum, animal) => sum + getShareLimit(animal.type), 0);
  const paidAmount = participants.reduce((sum, participant) => sum + Number(participant.paid || 0), 0);
  const packages = Number(distribution.warga || 0) + Number(distribution.mustahik || 0) + Number(distribution.panitia || 0) + Number(distribution.peserta || 0);

  return {
    totalAnimals: animals.length,
    filledShares: participants.length,
    capacity,
    paidAmount,
    packages,
  };
}
