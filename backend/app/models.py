import uuid
from datetime import datetime
# [SOLID: SRP] — Domain models isolate data contracts and validation from business logic
from pydantic import BaseModel, Field
from typing import List, Optional

class StudentWish(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: f"wish_{int(datetime.now().timestamp())}_{uuid.uuid4().hex[:6]}", description="Unique identifier for the wish")
    student_name: str = Field(..., description="Name of student or faculty member")
    department: str = Field(default="Shobhit University", description="Department or course, e.g., B.Tech CSE, Ayurveda")
    message: str = Field(..., description="Heartfelt birthday message")
    timestamp: Optional[str] = Field(default_factory=lambda: datetime.now().strftime("%I:%M %p"), description="Formatted timestamp")
    avatar_color: Optional[str] = Field(default="#F59E0B", description="Hex color for avatar badge")
    created_at: Optional[float] = Field(default_factory=lambda: datetime.now().timestamp(), description="Epoch timestamp in seconds")

class Milestone(BaseModel):
    id: str = Field(..., description="Unique identifier for milestone")
    year: str = Field(..., description="Year or date range of milestone")
    title: str = Field(..., description="Milestone title")
    category: str = Field(..., description="Education, Healthcare & Ayurveda, Global Leadership, or Youth Welfare")
    summary: str = Field(..., description="Brief one-line summary")
    narrative: str = Field(..., description="Historical context and impact narrative")
    photos: List[str] = Field(default_factory=list, description="Associated photograph URLs or paths")
    citations: List[str] = Field(default_factory=list, description="Official documentation references")

class ChatQuery(BaseModel):
    question: str = Field(..., description="Audience question about Chancellor's life or vision")
    include_citations: bool = Field(default=True, description="Whether to include official sources")

class ChatResponse(BaseModel):
    answer: str = Field(..., description="Biographical or visionary answer honoring the Chancellor")
    citations: List[str] = Field(default_factory=list, description="Verified source documents or speeches")
    suggested_followups: List[str] = Field(default_factory=list, description="Recommended follow-up questions")

class TributeGenerationRequest(BaseModel):
    filter_department: Optional[str] = Field(default=None, description="Optional department filter")
    language: str = Field(default="bilingual", description="english, hindi, or bilingual celebration")
    since_timestamp: Optional[float] = Field(default=None, description="Epoch timestamp or window start time to filter wishes")

class BirthdayTributeResponse(BaseModel):
    title: str = Field(..., description="Title of the tribute poem/anthem")
    theme: str = Field(..., description="Core collective sentiment")
    poem_stanzas: List[str] = Field(..., description="Stanzas of celebratory poem")
    recitation_text: str = Field(..., description="Continuous text optimized for voice narration")
    total_wishes_synthesized: int = Field(..., description="Number of wishes analyzed")
