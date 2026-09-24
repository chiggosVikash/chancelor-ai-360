# [PATTERN: Repository] — Encapsulates reading and querying biographical knowledge base
# [SOLID: SRP] — Sole responsibility is loading and searching verified Chancellor data
import json
import os
from typing import List, Dict, Any, Optional
from app.models import Milestone

class KnowledgeService:
    def __init__(self, data_path: Optional[str] = None):
        if not data_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, "data", "chancellor_profile.json")
        self.data_path = data_path
        self._profile_cache: Dict[str, Any] = self._load_data()

    def _load_data(self) -> Dict[str, Any]:
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Chancellor profile not found at {self.data_path}")
        with open(self.data_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def get_chancellor_overview(self) -> Dict[str, Any]:
        return {
            "name": self._profile_cache.get("name"),
            "title": self._profile_cache.get("title"),
            "biography": self._profile_cache.get("biography"),
            "core_pillars": self._profile_cache.get("core_pillars", []),
            "leadership_roles": self._profile_cache.get("leadership_roles", []),
            "quotes": self._profile_cache.get("quotes", [])
        }

    def get_all_milestones(self) -> List[Milestone]:
        raw_milestones = self._profile_cache.get("milestones", [])
        return [Milestone(**m) for m in raw_milestones]

    def find_milestones(self, query: str = "", category: Optional[str] = None) -> List[Milestone]:
        q = query.lower().strip()
        # Stem common search terms for robust matching
        normalized_q = q.replace("ayurveda", "ayurved") if "ayurveda" in q else q
        results: List[Milestone] = []

        for m_data in self._profile_cache.get("milestones", []):
            milestone = Milestone(**m_data)

            # Check category filter
            if category and category.lower() != "all":
                if milestone.category.lower() != category.lower():
                    continue

            # Check search match across fields including category
            if q:
                match_text = f"{milestone.year} {milestone.title} {milestone.category} {milestone.summary} {milestone.narrative} {' '.join(milestone.citations)}".lower()
                if q not in match_text and normalized_q not in match_text:
                    continue

            results.append(milestone)

        return results
