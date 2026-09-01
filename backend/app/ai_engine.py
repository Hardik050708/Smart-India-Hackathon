import math
import re
from typing import List, Dict, Tuple, Optional, Any
from .models import SeverityLevel

# Comprehensive Critical Hazard Keyword Lexicon
CRITICAL_HAZARD_KEYWORDS = [
    "toxic", "arsenic", "poison", "contamination", "chemical spill", "groundwater",
    "bridge structural", "bridge collapse", "landslide", "outbreak", "cholera", "diarrhea",
    "washout", "road block emergency", "fire", "mine fire", "coal field", "gas leak",
    "high voltage", "electrocution", "flooding", "drowning", "sewage leak", "cyanide",
    "mine subsidence", "methane", "industrial effluent", "dam crack", "dam breach",
    "drinking water poisoning", "radiation", "fissure", "structural failure"
]

URGENCY_INTENSIFIERS = [
    "immediate", "urgent", "danger", "critical", "collapsed", "emergency",
    "dying", "acute", "fatal", "casualties", "expanding rapidly", "life threatening"
]

HIGH_URGENCY_TERMS = [
    "severe", "broken", "outage", "blocked", "contaminated", "overflowing", "hazardous"
]

MEDIUM_URGENCY_TERMS = [
    "repair", "clean", "maintenance", "decay", "pothole", "leakage", "damaged"
]

def calculate_haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Haversine distance formula in kilometers between two GPS coordinates.
    d = 2R * arcsin(sqrt(sin^2(dlat/2) + cos(lat1)*cos(lat2)*sin^2(dlon/2)))
    """
    R = 6371.0  # Earth's radius in kilometers
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2 +
        math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2)
    )
    # Clamp 'a' to [0, 1] to prevent floating point domain errors
    a = max(0.0, min(1.0, a))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def tokenize(text: str) -> List[str]:
    """Tokenize and clean text into lowercase words."""
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    return [w for w in cleaned.split() if len(w) > 2]

def calculate_text_similarity(text1: str, text2: str) -> float:
    """
    Calculates TF-IDF / Cosine token overlap similarity between two strings.
    Returns value between 0.0 and 1.0.
    """
    tokens1 = tokenize(text1)
    tokens2 = tokenize(text2)

    if not tokens1 or not tokens2:
        return 0.0

    # Build term frequency vectors
    all_terms = list(set(tokens1 + tokens2))
    
    vec1 = [tokens1.count(term) for term in all_terms]
    vec2 = [tokens2.count(term) for term in all_terms]

    dot_product = sum(v1 * v2 for v1, v2 in zip(vec1, vec2))
    magnitude1 = math.sqrt(sum(v1 ** 2 for v1 in vec1))
    magnitude2 = math.sqrt(sum(v2 ** 2 for v2 in vec2))

    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0

    return dot_product / (magnitude1 * magnitude2)

def assess_ai_severity(
    title: str,
    description: str,
    category: str,
    population_affected: int = 100,
    duplicate_count: int = 0
) -> Dict[str, Any]:
    """
    AI Seriousness & Severity Assessment Engine (SIH-26043 Spec)
    Layer 1: Keyword-based Critical Hazard Screening (0-100)
    Layer 2: Zero-shot Semantic Urgency Classification (0-100)
    Layer 3: Priority_Score = (0.40 * Hazard) + (0.35 * Urgency) + (0.15 * Pop_Scale) + (0.10 * Duplicate_Spike)
    Threshold: Score > 85 triggers STATUS: CRITICAL.
    """
    full_text = f"{title} {description} {category}".lower()

    # Layer 1: Critical Hazard Screening
    matched_keywords = [kw for kw in CRITICAL_HAZARD_KEYWORDS if kw in full_text]
    if len(matched_keywords) == 0:
        hazard_score = 20.0
    elif len(matched_keywords) == 1:
        hazard_score = 60.0
    elif len(matched_keywords) == 2:
        hazard_score = 80.0
    else:
        hazard_score = min(100.0, 80.0 + (len(matched_keywords) - 2) * 10.0)

    # Layer 2: Semantic Urgency Classification
    has_urgency_intensifier = any(term in full_text for term in URGENCY_INTENSIFIERS)
    has_high_urgency = any(term in full_text for term in HIGH_URGENCY_TERMS)
    has_medium_urgency = any(term in full_text for term in MEDIUM_URGENCY_TERMS)

    if has_urgency_intensifier or len(matched_keywords) >= 2:
        urgency_score = 95.0
        urgency_tier = SeverityLevel.CRITICAL
    elif has_high_urgency or len(matched_keywords) == 1:
        urgency_score = 75.0
        urgency_tier = SeverityLevel.HIGH
    elif has_medium_urgency:
        urgency_score = 55.0
        urgency_tier = SeverityLevel.MEDIUM
    else:
        urgency_score = 30.0
        urgency_tier = SeverityLevel.LOW

    # Layer 3: Dynamic Severity Escalation Formula
    # Population scale normalized
    if population_affected > 5000:
        pop_scale_score = 100.0
    elif population_affected > 1000:
        pop_scale_score = 80.0
    elif population_affected > 300:
        pop_scale_score = 60.0
    elif population_affected > 50:
        pop_scale_score = 40.0
    else:
        pop_scale_score = 20.0

    # Duplicate spike score (0 - 100)
    duplicate_spike_score = min(100.0, float(duplicate_count * 25.0))

    # Priority Score Formula (MANDATORY WEIGHTS)
    priority_score = (
        (0.40 * hazard_score) +
        (0.35 * urgency_score) +
        (0.15 * pop_scale_score) +
        (0.10 * duplicate_spike_score)
    )
    priority_score = round(priority_score, 1)

    # Threshold Check: Score > 85 triggers STATUS: CRITICAL
    is_emergency = priority_score > 85.0

    # Determine final severity level
    if is_emergency or priority_score >= 85.0:
        final_severity = SeverityLevel.CRITICAL
    elif priority_score >= 65.0:
        final_severity = SeverityLevel.HIGH
    elif priority_score >= 45.0:
        final_severity = SeverityLevel.MEDIUM
    else:
        final_severity = SeverityLevel.LOW

    return {
        "hazard_score": hazard_score,
        "urgency_score": urgency_score,
        "population_score": pop_scale_score,
        "duplicate_score": duplicate_spike_score,
        "priority_score": priority_score,
        "severity_level": final_severity,
        "is_emergency": is_emergency,
        "matched_keywords": matched_keywords,
        "breakdown": {
            "hazard_contribution": round(0.40 * hazard_score, 2),
            "urgency_contribution": round(0.35 * urgency_score, 2),
            "population_contribution": round(0.15 * pop_scale_score, 2),
            "duplicate_contribution": round(0.10 * duplicate_spike_score, 2),
        }
    }

def check_geo_semantic_deduplication(
    new_lat: float,
    new_lon: float,
    new_title: str,
    new_description: str,
    existing_reports: List[Any],
    max_radius_km: float = 5.0,
    similarity_threshold: float = 0.80
) -> Dict[str, Any]:
    """
    Geo-Semantic Deduplication:
    Flags reports within 5km radius and >= 80% text similarity.
    """
    matched_duplicates = []
    new_text = f"{new_title} {new_description}"

    for report in existing_reports:
        # Distance check using Haversine
        dist = calculate_haversine_distance_km(new_lat, new_lon, report.lat, report.lon)
        if dist <= max_radius_km:
            # Text similarity check
            rep_text = f"{report.title} {report.description}"
            sim = calculate_text_similarity(new_text, rep_text)
            if sim >= similarity_threshold:
                matched_duplicates.append({
                    "id": report.id,
                    "title": report.title,
                    "distance_km": round(dist, 2),
                    "similarity": round(sim, 3)
                })

    is_duplicate = len(matched_duplicates) > 0
    return {
        "is_duplicate": is_duplicate,
        "matched_count": len(matched_duplicates),
        "primary_match": matched_duplicates[0] if is_duplicate else None,
        "all_matches": matched_duplicates
    }

# Jharkhand HEI Knowledge Base for Smart Routing
JHARKHAND_HEI_ROUTING_PROFILES = [
    {
        "name": "Birsa Agricultural University (BAU) Kanke",
        "short_name": "BAU Kanke",
        "district": "Ranchi",
        "specialization": "Agro-Tech, Soil Health, Organic Farming & Irrigation Systems",
        "domains": ["Agro-Tech", "Soil Health", "Agriculture", "Irrigation", "Crop Protection", "Organic Farming", "Bio-diversity", "Forestry"],
        "departments": ["Agronomy", "Soil Science & Agricultural Chemistry", "Agricultural Engineering", "Horticulture"]
    },
    {
        "name": "Indian Institute of Technology (IIT ISM) Dhanbad",
        "short_name": "IIT ISM Dhanbad",
        "district": "Dhanbad",
        "specialization": "Mining & Environmental Safety, Hydrogeology, Groundwater, Air Pollution",
        "domains": ["Mining & Environment", "Groundwater", "Hydrogeology", "Air Pollution", "Mine Fire", "Geotechnical", "Robotics"],
        "departments": ["Environmental Science & Engineering", "Mining Engineering", "Chemical Engineering", "Applied Geology"]
    },
    {
        "name": "National Institute of Technology (NIT) Jamshedpur",
        "short_name": "NIT Jamshedpur",
        "district": "East Singhbhum",
        "specialization": "Metallurgy, Slag Recycling, Structural Engineering, Rural Infrastructure",
        "domains": ["Metallurgy & Waste Recycling", "Structural Engineering", "Infrastructure", "Road & Bridge", "IoT & Smart Sensors"],
        "departments": ["Civil & Environmental Dept", "Metallurgical Engineering", "Mechanical Engineering", "Electronics"]
    },
    {
        "name": "Birla Institute of Technology (BIT) Mesra",
        "short_name": "BIT Mesra",
        "district": "Ranchi",
        "specialization": "Water Quality, Renewable Solar Energy, Remote Sensing, AI & Computing",
        "domains": ["Water Quality", "Renewable Energy", "Solar Microgrids", "Remote Sensing & GIS", "Computer Science & AI"],
        "departments": ["Environmental Engineering", "Electrical & Electronics", "Remote Sensing", "Computer Science"]
    },
    {
        "name": "Rajendra Institute of Medical Sciences (RIMS) Ranchi",
        "short_name": "RIMS Ranchi",
        "district": "Ranchi",
        "specialization": "Epidemiology, Community Health, Waterborne Disease Control, Sanitation",
        "domains": ["Public Health", "Sanitation", "Healthcare", "Disease Outbreak", "Community Medicine", "Biomedical"],
        "departments": ["Community Medicine & Preventive Healthcare", "Microbiology", "Biochemistry", "Pathology"]
    },
    {
        "name": "Indian Institute of Information Technology (IIIT) Ranchi",
        "short_name": "IIIT Ranchi",
        "district": "Ranchi",
        "specialization": "Digital E-Governance, IoT Sensor Networks, Citizen Portals & AI",
        "domains": ["IT & Governance", "IoT Sensor Networks", "Smart City", "Data Analytics", "Cybersecurity"],
        "departments": ["Computer Science & Engineering", "Electronics & Communication"]
    }
]

def route_challenge_to_smart_hei(category: str, district: str, description: str = "") -> Dict[str, Any]:
    """
    Smart HEI Routing:
    Matches challenge domain with institution specializations (70% weight) and district proximity (30% weight).
    """
    query_text = f"{category} {description}".lower()
    scored_heis = []

    for hei in JHARKHAND_HEI_ROUTING_PROFILES:
        score = 0.0

        # Domain / Specialization match
        domain_matches = [d for d in hei["domains"] if d.lower() in query_text or query_text in d.lower()]
        if domain_matches:
            score += 70.0 + min(15.0, len(domain_matches) * 5.0)
        else:
            score += 20.0  # baseline general capacity

        # District proximity match
        if hei["district"].lower() == district.lower():
            score += 30.0
        else:
            score += 15.0

        scored_heis.append({
            "name": hei["name"],
            "short_name": hei["short_name"],
            "district": hei["district"],
            "specialization": hei["specialization"],
            "recommended_department": hei["departments"][0],
            "match_score": min(100.0, round(score, 1))
        })

    scored_heis.sort(key=lambda x: x["match_score"], reverse=True)
    primary = scored_heis[0]

    return {
        "primary_hei_name": primary["name"],
        "primary_hei_short_name": primary["short_name"],
        "recommended_department": primary["recommended_department"],
        "match_confidence": f"{int(primary['match_score'])}%",
        "all_ranked_heis": scored_heis
    }
