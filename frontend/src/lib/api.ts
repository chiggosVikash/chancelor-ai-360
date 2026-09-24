// [PATTERN: Gateway] — Centralized API and WebSocket communication gateway
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/wishes";

export interface StudentWish {
  id: string;
  student_name: string;
  department: string;
  message: string;
  timestamp: string;
  avatar_color?: string;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  category: string;
  summary: string;
  narrative: string;
  photos: string[];
  citations: string[];
}

export interface ChatResponse {
  answer: string;
  citations: string[];
  suggested_followups: string[];
}

export interface BirthdayTributeResponse {
  title: string;
  theme: string;
  poem_stanzas: string[];
  recitation_text: string;
  total_wishes_synthesized: number;
}

export async function fetchOverview() {
  const res = await fetch(`${API_BASE_URL}/api/overview`);
  if (!res.ok) throw new Error("Failed to fetch Chancellor overview");
  return res.json();
}

export async function fetchMilestones(query = "", category = "") {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (category && category !== "All") params.set("category", category);
  const res = await fetch(`${API_BASE_URL}/api/milestones?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch milestones");
  return res.json();
}

export async function askChancellorAI(question: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, include_citations: true }),
  });
  if (!res.ok) throw new Error("Failed to get AI response");
  return res.json();
}

export async function submitStudentWish(wish: Omit<StudentWish, "id" | "timestamp">): Promise<StudentWish> {
  const payload: StudentWish = {
    ...wish,
    id: `wish_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  const res = await fetch(`${API_BASE_URL}/api/wishes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to submit wish");
  return res.json();
}

export async function generateBirthdayTribute(): Promise<BirthdayTributeResponse> {
  const res = await fetch(`${API_BASE_URL}/api/tribute/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language: "bilingual" }),
  });
  if (!res.ok) throw new Error("Failed to generate tribute poem");
  return res.json();
}
