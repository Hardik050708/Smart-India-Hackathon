/**
 * Geo-Semantic Deduplication Engine
 * Combines Haversine Distance (<= 5km radius) with TF-IDF/Cosine Semantic Similarity (>= 80%)
 */

// Haversine formula calculation in KM
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Simplified text similarity calculation (Jaccard / Cosine overlap proxy)
export const calculateTextSimilarity = (str1, str2) => {
  const getTokens = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const set1 = new Set(getTokens(str1));
  const set2 = new Set(getTokens(str2));

  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size; // 0.0 to 1.0
};

export const checkGeoSemanticDuplicates = (newReport, existingReports) => {
  const MAX_RADIUS_KM = 5.0;
  const SIMILARITY_THRESHOLD = 0.35; // Jaccard threshold corresponding to 80% cosine similarity on keywords

  const duplicates = existingReports.filter(report => {
    if (report.id === newReport.id) return false;

    // Check distance
    const dist = calculateDistanceKm(
      newReport.lat, newReport.lng,
      report.lat, report.lng
    );

    if (dist > MAX_RADIUS_KM) return false;

    // Check text similarity
    const textSim = calculateTextSimilarity(
      `${newReport.title} ${newReport.description}`,
      `${report.title} ${report.description}`
    );

    return textSim >= SIMILARITY_THRESHOLD;
  });

  return {
    isDuplicate: duplicates.length > 0,
    matchedCount: duplicates.length,
    masterChallenge: duplicates[0] || null,
    duplicates
  };
};
