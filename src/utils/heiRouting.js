/**
 * Smart HEI Routing Algorithm (SIH 2026 Spec)
 * Matches challenge domain and district location with departmental specializations of Jharkhand HEIs.
 */

export const JHARKHAND_HEIS = [
  {
    id: 'hei-1',
    name: 'Birla Institute of Technology (BIT) Mesra',
    shortName: 'BIT Mesra',
    district: 'Ranchi',
    domains: ['Water Quality', 'Renewable Energy', 'Remote Sensing', 'Computer Science & AI', 'Civil Engineering'],
    departments: ['Environmental Engineering', 'Electrical & Electronics', 'Remote Sensing', 'CSE'],
    facultyCount: 142,
    activeProjects: 18
  },
  {
    id: 'hei-2',
    name: 'Indian Institute of Technology (IIT ISM) Dhanbad',
    shortName: 'IIT ISM Dhanbad',
    district: 'Dhanbad',
    domains: ['Mining & Environment Safety', 'Groundwater Hydrogeology', 'Air Pollution', 'Robotics & Automation'],
    departments: ['Environmental Science & Engineering', 'Mining Engineering', 'Chemical Engineering'],
    facultyCount: 215,
    activeProjects: 29
  },
  {
    id: 'hei-3',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    shortName: 'NIT Jamshedpur',
    district: 'East Singhbhum',
    domains: ['Metallurgy & Waste Recycling', 'Structural & Rural Infrastructure', 'Water Purification', 'IoT & Smart Sensors'],
    departments: ['Civil & Environmental Dept', 'Metallurgical Engineering', 'Mechanical Engineering'],
    facultyCount: 130,
    activeProjects: 14
  },
  {
    id: 'hei-4',
    name: 'Birsa Agricultural University (BAU) Kanke',
    shortName: 'BAU Kanke',
    district: 'Ranchi',
    domains: ['Agro-Tech & Soil Health', 'Organic Farming', 'Irrigation Engineering', 'Forestry & Bio-diversity'],
    departments: ['Agronomy', 'Soil Science & Agri-Chemistry', 'Agricultural Engineering'],
    facultyCount: 98,
    activeProjects: 22
  },
  {
    id: 'hei-5',
    name: 'Ranchi University',
    shortName: 'Ranchi Univ',
    district: 'Ranchi',
    domains: ['Healthcare & Community Health', 'Rural Sanitation', 'Sociological Impact', 'Biotechnology'],
    departments: ['Department of Biotechnology', 'Social Work & Public Health', 'Chemistry'],
    facultyCount: 180,
    activeProjects: 12
  }
];

export const routeChallengeToHei = (category, district) => {
  // Score institutions based on domain match (70%) and district proximity (30%)
  const scoredHEIs = JHARKHAND_HEIS.map(hei => {
    let score = 0;

    // Category / Domain Match
    if (hei.domains.some(d => d.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(d.toLowerCase()))) {
      score += 70;
    } else {
      score += 20; // baseline domain score
    }

    // District proximity match
    if (hei.district.toLowerCase() === district.toLowerCase()) {
      score += 30;
    } else {
      score += 15;
    }

    return { ...hei, matchScore: score };
  });

  // Sort by highest score first
  scoredHEIs.sort((a, b) => b.matchScore - a.matchScore);

  const primaryHei = scoredHEIs[0];
  const recommendedDepartment = primaryHei.departments[0];

  return {
    primaryHei,
    recommendedDepartment,
    matchConfidence: `${primaryHei.matchScore}%`,
    secondaryHei: scoredHEIs[1],
    allMatchedHeis: scoredHEIs
  };
};
