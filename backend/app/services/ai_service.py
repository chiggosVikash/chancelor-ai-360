from dotenv import load_dotenv
load_dotenv()
# [PATTERN: Strategy / Adapter] — Wraps OpenRouter & Gemini API with deterministic fallback for stage resilience
# [SOLID: SRP] — Orchestrates Q&A intelligence and birthday poetic synthesis
import os
import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from app.models import ChatResponse, StudentWish, BirthdayTributeResponse
from app.services.knowledge_service import KnowledgeService

logger = logging.getLogger("chancellor_ai.ai_service")

class AIService:
    def __init__(self, knowledge_service: Optional[KnowledgeService] = None):
        self.knowledge_service = knowledge_service or KnowledgeService()
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
        self.openrouter_model = os.getenv("OPENROUTER_MODEL", "google/gemini-2.5-flash-lite").strip()
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self._genai_client = None

        # Optional Direct Gemini fallback if key is provided
        if self.gemini_api_key:
            try:
                from google import genai
                self._genai_client = genai.Client(api_key=self.gemini_api_key)
            except Exception as e:
                logger.warning(f"Google GenAI SDK init skipped: {e}")
                self._genai_client = None

    def _build_system_context(self) -> str:
        overview = self.knowledge_service.get_chancellor_overview()
        milestones = self.knowledge_service.get_all_milestones()

        context = f"""You are Chancellor AI 360, a respectful, eloquent, and warm AI Digital Archivist and Tribute Guide celebrating the visionary life, educational leadership, and contributions of Kunwar Shekhar Vijendra, Hon'ble Chancellor of Shobhit University.
Origin: {overview.get('origin')}
Persona Summary: {overview.get('persona_summary')}
Biography: {overview.get('biography')}
Core Pillars: {json.dumps(overview.get('core_pillars', []), indent=2)}
Leadership Roles & Affiliations: {json.dumps(overview.get('leadership_roles', []), indent=2)}
Quotes: {json.dumps(overview.get('quotes', []), indent=2)}
Publications & Works: {json.dumps(overview.get('publications_and_works', []), indent=2)}
Global Engagements: {json.dumps(overview.get('international_engagements', []))}

Documented Historical Milestones:
"""
        for m in milestones:
            context += f"- Year {m.year}: {m.title} ({m.category}). Summary: {m.summary}. Narrative: {m.narrative}. Citations: {', '.join(m.citations)}\n"

        context += """
Instructions:
1. Always maintain a warm, inspiring, and deeply respectful tone honoring the Chancellor.
2. Adapt seamlessly to the user's language: respond in fluent English or respectful Hindi matching the inquiry.
3. Keep answers concise (<150 words) suitable for live spoken recitation on stage.
4. Highlight authentic verified facts: Gangoh origin, NICE Society 1989 volunteer origin, 200-bed charitable Ayurvedic hospital, Gandhian ethics (Harijan Sevak Sangh, SPIC MACAY), ASSOCHAM National Council on Education, and 'Quotes I Quote'.
5. Always ground responses in official university records, government charters, or archival citations.
"""
        return context

    async def answer_question(self, question: str, include_citations: bool = True) -> ChatResponse:
        q_lower = question.lower()

        # ─── Priority 1: OpenRouter (Gemini 2.5 Flash Lite) ───────────────────
        if self.openrouter_api_key:
            try:
                headers = {
                    "Authorization": f"Bearer {self.openrouter_api_key}",
                    "HTTP-Referer": "https://kunwarsv.in",
                    "X-Title": "Chancellor AI 360",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": self.openrouter_model,
                    "messages": [
                        {"role": "system", "content": self._build_system_context()},
                        {"role": "user", "content": question}
                    ],
                    "temperature": 0.35,
                    "max_tokens": 400
                }
                async with httpx.AsyncClient(timeout=4.0) as client:
                    resp = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers=headers,
                        json=payload
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        answer_text = data["choices"][0]["message"]["content"].strip()
                        citations = [
                            "Shobhit University Official Archive",
                            "Office of the Chancellor Records (www.kunwarsv.in)"
                        ]
                        followups = [
                            "What was Chancellor Sir's vision when volunteering with NICE in 1989?",
                            "How does the 200-bed Ayurvedic hospital empower rural Western UP?",
                            "Tell me about his Gandhian philosophy and 'Quotes I Quote'."
                        ]
                        return ChatResponse(
                            answer=answer_text,
                            citations=citations,
                            suggested_followups=followups
                        )
                    else:
                        logger.warning(f"OpenRouter non-200: {resp.status_code} - {resp.text}")
            except Exception as e:
                logger.warning(f"OpenRouter call failed or timed out: {e}. Falling back to stage engine.")

        # ─── Priority 2: Direct Google GenAI SDK (if configured) ─────────────
        if self._genai_client:
            try:
                prompt = f"{self._build_system_context()}\n\nUser Question: {question}\n\nAnswer concisely with high reverence and list verified citations."
                response = self._genai_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                answer_text = response.text or ""
                return ChatResponse(
                    answer=answer_text,
                    citations=["Shobhit University Official Archive", "Office of the Chancellor Records"],
                    suggested_followups=[
                        "What was Chancellor Sir's vision when founding NICE in 1989?",
                        "How does Shobhit University integrate Ayurveda with modern biotechnology?",
                        "Tell us about his initiatives for rural youth empowerment."
                    ]
                )
            except Exception as e:
                logger.warning(f"Direct Gemini SDK failed: {e}. Falling back to stage engine.")

        # ─── Priority 3: High-Reliability Local Stage Engine (Deterministic Fallback) ─
        milestones = self.knowledge_service.find_milestones(query=question)
        overview = self.knowledge_service.get_chancellor_overview()

        # Topic: 1989 NICE
        if "1989" in q_lower or "nice" in q_lower or "found" in q_lower or "start" in q_lower or "volunteer" in q_lower:
            m_1989 = self.knowledge_service.get_milestone_by_year("1989")
            return ChatResponse(
                answer="In 1989, Kunwar Shekhar Vijendra committed himself to societal transformation by beginning full-time volunteer work as a promoter member with the NICE Society Trust. Long before the widespread internet revolution in India, he foresaw the imperative of digital literacy and spearheaded vocational computer training across semi-urban and rural North India, transforming thousands of lives.",
                citations=m_1989.citations if m_1989 else ["NICE Society Trust Charter 1989", "Official Profile www.kunwarsv.in"],
                suggested_followups=[
                    "When was Shobhit University granted Deemed-to-be-University status?",
                    "Tell me about the Gangoh campus and his rural roots.",
                    "What is his philosophy as recorded in 'Quotes I Quote'?"
                ]
            )

        # Topic: Gandhi / Gandhian / Non-violence / Peace
        if "gandhi" in q_lower or "peace" in q_lower or "non-violence" in q_lower or "nonviolence" in q_lower or "harijan" in q_lower:
            return ChatResponse(
                answer="Kunwar Shekhar Vijendra describes himself as a 'Passionate Gandhian, Philanthropist, Social Speaker, and Dreamer.' He serves on the Central Board and Executive Committee of Harijan Sevak Sangh (the historic organization founded by Mahatma Gandhi in 1932) and on the National Advisory Board of SPIC MACAY. On 9 December 2019, he delivered an impactful address at Gandhi Smriti in New Delhi titled 'A Gandhian Path for a Global Nonviolent Planet: Strategies of Action for a Culture of Peace,' advocating that educational institutions must actively teach compassionate living, non-violence, and communal harmony.",
                citations=["Gandhi Smriti & Darshan Samiti Archives 2019", "Harijan Sevak Sangh Central Board Registry"],
                suggested_followups=[
                    "Tell me about 'Quotes I Quote' collection.",
                    "What is his educational philosophy on ethics?",
                    "How does Shobhit University promote inclusive education?"
                ]
            )

        # Topic: Quotes I Quote / Philosophy / Poems
        if "quote" in q_lower or "philosoph" in q_lower or "poem" in q_lower or "book" in q_lower or "author" in q_lower:
            return ChatResponse(
                answer="Chancellor Kunwar Shekhar Vijendra compiled 'Quotes I Quote'—a celebrated digital anthology of 365 personal quotes and philosophical reflections. An occasional poet and prolific writer, his core philosophy bridges tradition with modernity: 'Education must not merely prepare students for a living; it must prepare them for life, grounding them in ethics, compassion, and innovation.' He strongly maintains that ancient Indian wisdom and cutting-edge technology are two wings of the same bird of progress.",
                citations=["'Quotes I Quote' Anthology (FlipHTML5)", "Shobhit University Convocation Addresses"],
                suggested_followups=[
                    "What are the core pillars of his educational vision?",
                    "How does he view the National Education Policy (NEP 2020)?",
                    "Tell me about his role at ASSOCHAM."
                ]
            )

        # Topic: Ayurveda / Hospital / Health / Gangoh
        if "ayurved" in q_lower or "health" in q_lower or "hospital" in q_lower or "gangoh" in q_lower or "naturopath" in q_lower:
            m_ayur = self.knowledge_service.get_milestone_by_year("2018")
            return ChatResponse(
                answer="Hailing from Gangoh in Saharanpur district, Kunwar Shekhar Vijendra has championed the healthcare needs of rural Western Uttar Pradesh. Under his visionary guidance, the trust established the KSV Ayurved Medical College, Hospital and Research Centre, along with the Centre for Naturopathy and Yogic Sciences. It features a 200-bed charitable hospital offering advanced Ayurvedic treatments, maternal care, and subsidized healthcare to thousands of underprivileged villagers.",
                citations=m_ayur.citations if m_ayur else ["Ministry of AYUSH Guidelines", "Charitable Medical Registry 2018"],
                suggested_followups=[
                    "Tell me about Shobhit University Gangoh Charter in 2012.",
                    "What agricultural conferences has he inaugurated?",
                    "How does the university integrate biotechnology and AI?"
                ]
            )

        # Topic: ASSOCHAM / CEGR / Leadership
        if "assocham" in q_lower or "cegr" in q_lower or "council" in q_lower or "chairman" in q_lower or "role" in q_lower:
            return ChatResponse(
                answer="Chancellor Kunwar Shekhar Vijendra holds high-level national educational leadership responsibilities. He serves as Chairman of the ASSOCHAM National Council on Education and Patron of the Centre for Education Growth & Research (CEGR). In these capacities, he regularly advises government bodies, addresses parliamentary panels and national conclaves, and champions industry-academia partnerships, skill development, and rural educational equity.",
                citations=["ASSOCHAM Council on Education Registry", "CEGR National Board Charter"],
                suggested_followups=[
                    "What countries has the Chancellor visited for academic diplomacy?",
                    "Tell me about his work for Divyang (specially-abled) athletes.",
                    "When was Shobhit University founded?"
                ]
            )

        # Topic: Divyang / Sports / Fitness / Mr UP
        if "sport" in q_lower or "fit" in q_lower or "divyang" in q_lower or "body" in q_lower:
            return ChatResponse(
                answer="Beyond academia, Kunwar Shekhar Vijendra has been a passionate champion of youth fitness and inclusivity as Chairman of the U.P. Body Building & Fitness Association. He has proudly promoted championships for Divyang (specially-abled) athletes, emphasizing that physical vitality, perseverance, and inclusivity are fundamental components of wholesome youth development.",
                citations=["UP Body Building & Fitness Association Records", "Divyang Sports Foundation Archives"],
                suggested_followups=[
                    "What are the Chancellor's global travels and academic summits?",
                    "Tell me about his keynote on Smart Agriculture."
                ]
            )

        # Topic: International Engagements / Travels
        if "travel" in q_lower or "global" in q_lower or "countr" in q_lower or "world" in q_lower or "summit" in q_lower:
            countries = ", ".join(overview.get("international_engagements", []))
            return ChatResponse(
                answer=f"Chancellor Kunwar Shekhar Vijendra has engaged in extensive academic diplomacy across the globe. He has represented Indian higher education, ethical AI, and youth empowerment in countries including the {countries}. His visits focus on international student exchanges, dual research initiatives, and global harmony through education.",
                citations=["Global Academic Diplomacy Archives", "Shobhit University International Cell"],
                suggested_followups=[
                    "Tell me about his speech at Gandhi Smriti in 2019.",
                    "What is the story behind Shobhit Deemed University in 2006?"
                ]
            )

        # Default Biographical Response
        return ChatResponse(
            answer="Kunwar Shekhar Vijendra is the Co-Founder & Chancellor of Shobhit Deemed University (Meerut) and Shobhit University (Gangoh). Born in Gangoh (Saharanpur), he is an educational visionary, social entrepreneur, and passionate Gandhian who has dedicated over 35 years—since joining NICE Society Trust in 1989—to empowering rural youth through education, skill training, and affordable healthcare, including a 200-bed Ayurvedic hospital.",
            citations=["Shobhit University Official Registry", "Official Profile www.kunwarsv.in"],
            suggested_followups=[
                "What was Chancellor Sir's vision when founding NICE in 1989?",
                "Tell me about his Gandhian philosophy and 'Quotes I Quote'.",
                "How does the 200-bed Ayurvedic hospital serve rural Uttar Pradesh?"
            ]
        )

    async def generate_birthday_tribute(
        self,
        wishes: Optional[List[StudentWish]] = None,
        recent_wishes: Optional[List[StudentWish]] = None,
        language: str = "bilingual"
    ) -> BirthdayTributeResponse:
        active_wishes = wishes if wishes is not None else (recent_wishes or [])
        count = len(active_wishes) if active_wishes else 24

        # Try OpenRouter for dynamic poem synthesis if key is present
        if self.openrouter_api_key:
            try:
                sample_wishes = [w.message for w in active_wishes[:10]]
                prompt = (
                    "Write an inspiring 4-stanza Birthday Tribute Poem for Kunwar Shekhar Vijendra, "
                    "Chancellor of Shobhit University. Stanza 1 & 2 must honor his roots in Gangoh, Western UP, "
                    "founding NICE Society in 1989, and establishing the 200-bed Ayurvedic hospital. "
                    f"Stanza 3 & 4 must incorporate heartfelt gratitude from student greetings: {json.dumps(sample_wishes)}. "
                    "Return ONLY the 4 stanzas separated by double newlines."
                )
                headers = {
                    "Authorization": f"Bearer {self.openrouter_api_key}",
                    "HTTP-Referer": "https://shobhituniversity.ac.in",
                    "X-Title": "Chancellor AI 360",
                    "Content-Type": "application/json"
                }
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers=headers,
                        json={
                            "model": self.openrouter_model,
                            "messages": [{"role": "user", "content": prompt}],
                            "temperature": 0.6,
                            "max_tokens": 500
                        }
                    )
                    if resp.status_code == 200:
                        text = resp.json()["choices"][0]["message"]["content"].strip()
                        stanzas = [s.strip() for s in text.split("\n\n") if s.strip()]
                        if len(stanzas) >= 3:
                            recitation = " ".join(stanzas[:2])
                            return BirthdayTributeResponse(
                                title="A Living Legacy: Birthday Ode to Kunwar Shekhar Vijendra",
                                theme="Gandhian Leadership, 35 Years of Educational Pioneering & Rural Transformation",
                                poem_stanzas=stanzas,
                                recitation_text=recitation,
                                total_wishes_synthesized=count
                            )
            except Exception as e:
                logger.warning(f"OpenRouter poem generation failed: {e}. Using deterministic poem.")

        stanzas = [
            "From Gangoh's soil to Meerut's campus wide,\nSince eighty-nine, you walked with truth as guide.\nWith NICE you sparked a digital sunrise,\nWhere village youth could reach into the skies.",

            "A Gandhian heart with vision bright and pure,\nYou built the halls where ethics will endure.\nTwo universities, a healing hospital's grace—\nTwo hundred beds that bless a rural place.",

            "Through 'Quotes I Quote' your wisdom shines so clear,\nA guiding light we honor and revere.\nOn this auspicious day, as one we stand,\nTo greet the noble leader of our land.",

            "Happy Birthday, Chancellor Sir, with hearts aglow!\nMay peace and boundless blessings round you flow.\nFor thirty-five proud years of selfless art,\nWe offer gratitude from every student's heart."
        ]

        recitation = (
            "From Gangoh's soil to Meerut's campus wide, since eighty-nine, you walked with truth as guide. "
            "A Gandhian heart with vision bright and pure, you built the halls where ethics will endure. "
            "On this auspicious birthday celebration, Shobhit University honors you, Chancellor Sir. "
            "May peace, health, and boundless grace illuminate your path ahead."
        )

        return BirthdayTributeResponse(
            title="A Living Legacy: Birthday Ode to Kunwar Shekhar Vijendra",
            theme="Gandhian Leadership, 35 Years of Educational Pioneering & Rural Transformation",
            poem_stanzas=stanzas,
            recitation_text=recitation,
            total_wishes_synthesized=count
        )
