// [PATTERN: Gateway] — Centralized API and WebSocket communication gateway
export const getApiBaseUrl = (): string => {
  // 1. If explicit environment variable is set (e.g. in Vercel or .env.local), honor it first
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envUrl && !envUrl.includes("localhost:8000")) {
    return envUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // 2. Only auto-bind port 8000 if accessing via a private LAN IP (e.g. 192.168.x.x or 10.x.x.x)
    const isPrivateLanIp = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(host);
    if (isPrivateLanIp) {
      return `http://${host}:8000`;
    }
  }

  // 3. Fallback to env or localhost
  return envUrl || "http://localhost:8000";
};

export const getWsBaseUrl = (): string => {
  const envWs = process.env.NEXT_PUBLIC_WS_URL?.trim();
  if (envWs && !envWs.includes("localhost:8000")) {
    return envWs.replace(/\/$/, "");
  }

  const apiUrl = getApiBaseUrl();
  if (apiUrl.startsWith("https://")) {
    return `${apiUrl.replace("https://", "wss://")}/ws/wishes`;
  }
  if (apiUrl.startsWith("http://")) {
    return `${apiUrl.replace("http://", "ws://")}/ws/wishes`;
  }

  return envWs || "ws://localhost:8000/ws/wishes";
};

export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_URL = getWsBaseUrl();

export interface StudentWish {
  id: string;
  student_name: string;
  department: string;
  message: string;
  timestamp: string;
  avatar_color?: string;
  turnstile_token?: string;
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

export async function generateBirthdayTribute(sinceTimestamp?: number): Promise<BirthdayTributeResponse> {
  const res = await fetch(`${API_BASE_URL}/api/tribute/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      language: "bilingual",
      since_timestamp: sinceTimestamp 
    }),
  });
  if (!res.ok) throw new Error("Failed to generate tribute poem");
  return res.json();
}

export async function fetchWishes(): Promise<StudentWish[]> {
  const res = await fetch(`${API_BASE_URL}/api/wishes`);
  if (!res.ok) throw new Error("Failed to fetch wishes");
  return res.json();
}
