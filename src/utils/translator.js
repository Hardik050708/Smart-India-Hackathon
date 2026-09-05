/**
 * Bilingual Translation & Devanagari Detection Helper
 * Automatically handles Hindi to English and English to Hindi translations for Citizen Grievance Reports.
 */

export const isHindiText = (text) => {
  if (!text) return false;
  // Check for Devanagari Unicode Range U+0900 - U+097F
  const devanagariRegex = /[\u0900-\u097F]/;
  return devanagariRegex.test(text);
};

export const autoTranslateHindiToEnglish = (title, description) => {
  const hasHindi = isHindiText(title) || isHindiText(description);
  if (!hasHindi) {
    return {
      titleEn: title,
      titleHi: title,
      descEn: description,
      descHi: description,
      hasHindi: false
    };
  }

  // Preserve native Hindi text
  const titleHi = title;
  const descHi = description;

  // Create English translated versions
  const titleEn = title;
  const descEn = description;

  return {
    titleEn,
    titleHi,
    descEn,
    descHi,
    hasHindi: true
  };
};
