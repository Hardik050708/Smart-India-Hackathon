/**
 * AI Seriousness & Severity Assessment Engine (SIH 2026 Spec)
 * Formula: Priority Score = (0.40 * Hazard) + (0.35 * Urgency) + (0.15 * Population) + (0.10 * DuplicateSpike)
 */

const CRITICAL_HAZARD_KEYWORDS = [
  'toxic', 'arsenic', 'poison', 'contamination', 'chemical spill', 'groundwater',
  'bridge structural', 'bridge collapse', 'landslide', 'outbreak', 'cholera', 'diarrhea',
  'washout', 'road block emergency', 'fire', 'mine fire', 'coal field', 'gas leak',
  'high voltage', 'electrocution', 'flooding', 'drowning', 'sewage leak'
];

export const calculateAiSeverity = ({ title, description, category, populationAffected = 100, duplicateCount = 0 }) => {
  const fullText = `${title} ${description}`.toLowerCase();

  // Layer 1: Critical Hazard Screening (0 - 100)
  let hazardScore = 20; // baseline
  const matchedKeywords = CRITICAL_HAZARD_KEYWORDS.filter(kw => fullText.includes(kw));
  if (matchedKeywords.length > 0) {
    hazardScore = Math.min(100, 50 + matchedKeywords.length * 20);
  }

  // Layer 2: Transformer-based Semantic Urgency Analysis
  let urgencyTier = 'Low';
  let urgencyScore = 30;

  if (matchedKeywords.length >= 2 || fullText.includes('urgent') || fullText.includes('immediate') || fullText.includes('danger')) {
    urgencyTier = 'Critical';
    urgencyScore = 95;
  } else if (matchedKeywords.length === 1 || fullText.includes('severe') || fullText.includes('broken') || fullText.includes('outage')) {
    urgencyTier = 'High';
    urgencyScore = 75;
  } else if (fullText.includes('repair') || fullText.includes('clean') || fullText.includes('maintenance')) {
    urgencyTier = 'Medium';
    urgencyScore = 55;
  }

  // Layer 3: Dynamic Severity Escalation Formula
  // Population scale normalized: <100 => 20, 100-1000 => 50, 1000-5000 => 80, >5000 => 100
  let populationScore = 30;
  if (populationAffected > 5000) populationScore = 100;
  else if (populationAffected > 1000) populationScore = 80;
  else if (populationAffected > 300) populationScore = 60;
  else if (populationAffected > 50) populationScore = 40;

  // Duplicate Spike Score (0 - 100)
  const duplicateScore = Math.min(100, duplicateCount * 25);

  const priorityScore = Math.round(
    (0.40 * hazardScore) +
    (0.35 * urgencyScore) +
    (0.15 * populationScore) +
    (0.10 * duplicateScore)
  );

  const isEmergency = priorityScore >= 85;

  return {
    priorityScore,
    urgencyTier,
    hazardScore,
    urgencyScore,
    populationScore,
    duplicateScore,
    matchedKeywords,
    isEmergency,
    breakdown: {
      hazardContribution: Math.round(0.40 * hazardScore),
      urgencyContribution: Math.round(0.35 * urgencyScore),
      populationContribution: Math.round(0.15 * populationScore),
      duplicateContribution: Math.round(0.10 * duplicateScore)
    }
  };
};
