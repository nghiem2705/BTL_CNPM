CONCEPT_MAP = {
    "cs_algo": "Algorithms",
    "cs_ds": "Data Structures",
    "cs_os": "Operating Systems",
    "cs_net": "Computer Networks",
    "cs_db": "Databases",
    "cs_se": "Software Engineering",
    "cs_ml": "Machine Learning",
    "ee_circuit": "Circuit Analysis",
    "ee_digital": "Digital Logic",
    "ee_signal": "Signal Processing",
    "ch_thermo": "Thermodynamics",
    "ch_react": "Reaction Engineering",
    "soft_comm": "Communication",
    "soft_team": "Teamwork",
    "soft_lead": "Leadership",
    "soft_crit": "Critical Thinking",
    "soft_fast": "Fast Learning"
}

MAJOR_MAP = {
    "cs": "Computer Science",
    "ee": "Electrical Engineering",
    "ch": "Chemical Engineering"
}

BOOK_CATEGORIES_MAP = {
    "general": "DAI CUONG",
    "major": "CHUYEN NGANH",
    "paper": "BAI BAO KHOA HOC",
    "other": "KHAC"
}

def get_concept_name(concept_id):
    """Return human-readable concept name for concept_id or the id if unknown."""
    return CONCEPT_MAP.get(concept_id, concept_id)

def get_major_name(major_id):
    """Return human-readable major name for major_id or the id if unknown."""
    return MAJOR_MAP.get(major_id, major_id)