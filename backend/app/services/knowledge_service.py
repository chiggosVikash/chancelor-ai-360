# [PATTERN: Repository] — Encapsulates reading and querying biographical knowledge base
# [SOLID: SRP] — Sole responsibility is loading, searching, and surfacing verified Chancellor data
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

    def reload(self):
        """Forces cache invalidation and reloading from disk."""
        self._profile_cache = self._load_data()

    def get_chancellor_overview(self) -> Dict[str, Any]:
        return {
            "name": self._profile_cache.get("name"),
            "title": self._profile_cache.get("title"),
            "origin": self._profile_cache.get("origin"),
            "office_location": self._profile_cache.get("office_location"),
            "persona_summary": self._profile_cache.get("persona_summary"),
            "biography": self._profile_cache.get("biography"),
            "core_pillars": self._profile_cache.get("core_pillars", []),
            "leadership_roles": self._profile_cache.get("leadership_roles", []),
            "publications_and_works": self._profile_cache.get("publications_and_works", []),
            "quotes": self._profile_cache.get("quotes", []),
            "international_engagements": self._profile_cache.get("international_engagements", [])
        }

    def get_all_milestones(self) -> List[Milestone]:
        raw_milestones = self._profile_cache.get("milestones", [])
        return [Milestone(**m) for m in raw_milestones]

    def find_milestones(self, query: str = "", category: Optional[str] = None) -> List[Milestone]:
        import re
        q = query.lower().strip()
        stop_words = {"tell", "me", "about", "the", "of", "in", "and", "for", "with", "what", "was"}
        tokens = [w for w in re.findall(r"\w+", q) if len(w) > 2 and w not in stop_words]
        results: List[Milestone] = []

        for m_data in self._profile_cache.get("milestones", []):
            milestone = Milestone(**m_data)

            if category and category.lower() != "all":
                if milestone.category.lower() != category.lower():
                    continue

            if tokens:
                searchable_text = f"{milestone.title} {milestone.year} {milestone.summary} {milestone.narrative} {milestone.category}".lower()
                if q in searchable_text or any(token in searchable_text for token in tokens):
                    results.append(milestone)
            else:
                results.append(milestone)

        return results

    def get_milestone_by_year(self, year: str) -> Optional[Milestone]:
        for m in self.get_all_milestones():
            if m.year == year or year in m.year:
                return m
        return None
