export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("nexora_token");
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

export async function register(name: string, email: string, password: string) {
  const data = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  localStorage.setItem("nexora_token", data.token);
  return data.user;
}

export async function login(email: string, password: string) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("nexora_token", data.token);
  return data.user;
}

export async function getMe() {
  return request("/api/me");
}

export async function updateProfile(fields: { ageRange?: string; interests?: string[]; goal?: string }) {
  return request("/api/me", {
    method: "PATCH",
    body: JSON.stringify(fields),
  });
}

export async function updateName(name: string) {
  return request("/api/me", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return request("/api/me", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function logout() {
  localStorage.removeItem("nexora_token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("nexora_token");
}

export type QuizSummary = {
  id: string;
  title: string;
  category: string;
  description: string;
  questionCount: number;
};

export type QuizDetail = {
  id: string;
  title: string;
  category: string;
  description: string;
  questions: { id: string; text: string; options: { id: string; text: string }[] }[];
};

export type QuizResult = {
  score: number;
  correctCount: number;
  totalQuestions: number;
  breakdown: { questionId: string; correct: boolean; correctOptionId: string }[];
  updatedReadinessScore: number;
  updatedXp: number;
};

export async function getQuizzes(): Promise<QuizSummary[]> {
  return request("/api/quizzes/list");
}

export async function getQuiz(id: string): Promise<QuizDetail> {
  return request(`/api/quizzes/detail?id=${id}`);
}

export async function submitQuiz(id: string, answers: Record<string, string>): Promise<QuizResult> {
  return request("/api/quizzes/submit", {
    method: "POST",
    body: JSON.stringify({ quizId: id, answers }),
  });
}

export type SimEvent = {
  roundIndex: number;
  totalRounds: number;
  title: string;
  description: string;
  choices: { id: string; label: string }[];
};

export type SimSession = {
  id: string;
  currentCash: number;
  startingCapital: number;
  equity: number;
  currentRound: number;
};

export type SimStartResponse = {
  session: SimSession;
  event: SimEvent;
};

export type SimDecideResponse = {
  consequence: string;
  cashBefore: number;
  cashAfter: number;
  equity: number;
  complete: boolean;
  session?: SimSession;
  nextEvent?: SimEvent;
  report?: {
    categoryScores: Record<string, number>;
    overallScore: number;
    scoreBand: ScoreBand;
    finalCash: number;
    startingCapital: number;
    finalEquity: number;
  };
  updatedReadinessScore?: number;
  updatedXp?: number;
};

export async function getCurrentSimulation(): Promise<{ session: SimSession | null; event?: SimEvent }> {
  return request("/api/simulation/start"); // GET checks without creating
}

export async function startSimulation(): Promise<SimStartResponse> {
  return request("/api/simulation/start", { method: "POST" });
}

export async function decideSimulation(choiceId: string): Promise<SimDecideResponse> {
  return request("/api/simulation/decide", {
    method: "POST",
    body: JSON.stringify({ choiceId }),
  });
}

export type Achievement = {
  key: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
};

export async function getAchievements(): Promise<{ achievements: Achievement[]; xpAwarded: number }> {
  return request("/api/progress/achievements");
}

export type Certificate = {
  key: string;
  title: string;
  description: string;
  issued: boolean;
  issuedAt: string | null;
  readinessScoreAtIssue: number | null;
  recipientName: string | null;
};

export async function getCertificates(): Promise<{ certificates: Certificate[] }> {
  return request("/api/progress/certificates");
}

export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  fileUrl: string;
  fileSize: number | null;
  createdAt: string;
  lastPage: number | null;
  totalPages: number | null;
};

export async function getBooks(): Promise<{ books: Book[] }> {
  return request("/api/books/list");
}

export type ConnectResource = {
  id: string;
  category: string;
  name: string;
  description: string;
  contactInfo: string;
  link: string | null;
  createdAt: string;
};

export async function getConnectResources(): Promise<{ resources: ConnectResource[] }> {
  return request("/api/connect/list");
}

export async function addConnectResource(data: {
  adminKey: string;
  category: string;
  name: string;
  description: string;
  contactInfo: string;
  link: string;
}): Promise<{ resource: ConnectResource }> {
  return request("/api/connect/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type Idea = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  targetMarket: string;
  stage: string;
  createdAt: string;
  updatedAt: string;
};

export async function getIdeas(): Promise<{ ideas: Idea[] }> {
  return request("/api/ideas/list");
}

export async function createIdea(data: {
  title: string;
  problem: string;
  solution: string;
  targetMarket: string;
  stage: string;
}): Promise<{ idea: Idea }> {
  return request("/api/ideas/create", { method: "POST", body: JSON.stringify(data) });
}

export async function updateIdea(
  id: string,
  data: { title: string; problem: string; solution: string; targetMarket: string; stage: string }
): Promise<{ idea: Idea }> {
  return request("/api/ideas/update", { method: "PATCH", body: JSON.stringify({ id, ...data }) });
}

export async function deleteIdea(id: string): Promise<{ success: boolean }> {
  return request(`/api/ideas/delete?id=${id}`, { method: "DELETE" });
}

export type CaseStudySummary = {
  id: string;
  title: string;
  summary: string;
  answered: boolean;
};

export type CaseStudyQuestion = { id: string; prompt: string };

export type CaseStudyDetail = {
  id: string;
  title: string;
  summary: string;
  scenario: string;
  questions: CaseStudyQuestion[];
};

export async function getCaseStudies(): Promise<{ caseStudies: CaseStudySummary[] }> {
  return request("/api/casestudies/list");
}

export async function getCaseStudyDetail(
  id: string
): Promise<{ caseStudy: CaseStudyDetail; response: { answers: Record<string, string>; updatedAt: string } | null }> {
  return request(`/api/casestudies/detail?id=${id}`);
}

export async function submitCaseStudy(
  caseStudyId: string,
  answers: Record<string, string>
): Promise<{ response: { answers: Record<string, string>; updatedAt: string } }> {
  return request("/api/casestudies/submit", {
    method: "POST",
    body: JSON.stringify({ caseStudyId, answers }),
  });
}

export type Challenge = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  reflection: string | null;
  completedAt: string | null;
};

export async function getChallenges(): Promise<{ challenges: Challenge[] }> {
  return request("/api/casestudies/list-challenges");
}

export async function completeChallenge(
  challengeId: string,
  reflection: string
): Promise<{ challenge: { id: string; reflection: string; completedAt: string }; xpAwarded: number }> {
  return request("/api/casestudies/complete-challenge", {
    method: "POST",
    body: JSON.stringify({ challengeId, reflection }),
  });
}

export type MentorMessage = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export async function getMentorHistory(): Promise<{ messages: MentorMessage[] }> {
  return request("/api/mentor/history");
}

export async function sendMentorMessage(message: string): Promise<{ message: MentorMessage }> {
  return request("/api/mentor/send", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function saveBookProgress(bookId: string, lastPage: number, totalPages: number): Promise<{ success: boolean }> {
  return request("/api/books/progress", {
    method: "POST",
    body: JSON.stringify({ bookId, lastPage, totalPages }),
  });
}

export type ContinueBook = {
  bookId: string;
  title: string;
  author: string;
  lastPage: number;
  totalPages: number | null;
  lastReadAt: string;
};

export async function getContinueBooks(): Promise<{ books: ContinueBook[] }> {
  return request("/api/books/continue");
}

export type Portfolio = {
  profile: { name: string; readinessScore: number; xp: number; level: string };
  ideas: { id: string; title: string; stage: string; updatedAt: string }[];
  caseStudies: { id: string; title: string; updatedAt: string }[];
  challenges: { id: string; title: string; completedAt: string }[];
  achievements: { key: string; unlockedAt: string }[];
  certificates: { key: string; title: string; issuedAt: string }[];
  quizzes: {
    attemptCount: number;
    averageScore: number | null;
    attempts: { quizTitle: string; score: number; createdAt: string }[];
  };
  simulation: {
    overallScore: number;
    categoryScores: Record<string, number>;
    finalCash: number;
    startingCapital: number;
    completedAt: string;
  } | null;
  books: { title: string; lastPage: number; totalPages: number | null; complete: boolean }[];
};

export async function getPortfolio(): Promise<Portfolio> {
  return request("/api/progress/portfolio");
}

// ---------- Simulation Level 2 ----------

export type ScoreBand = { label: string; color: string; description: string };

export type SimL2Event = {
  roundIndex: number;
  totalRounds: number;
  title: string;
  description: string;
  choices: { id: string; label: string }[];
};

export type SimL2Session = {
  id: string;
  cash: number;
  equity: number;
  valuation: number;
  customers: number;
  monthlyRevenue: number;
  currentRound: number;
};

export async function getLevel2Status(): Promise<{ unlocked: boolean }> {
  return request("/api/simulation/l2-status");
}

export async function getCurrentLevel2(): Promise<{ session: SimL2Session | null; event?: SimL2Event }> {
  return request("/api/simulation/l2-start");
}

export async function startLevel2(): Promise<{ session: SimL2Session; event: SimL2Event }> {
  return request("/api/simulation/l2-start", { method: "POST" });
}

export type SimL2DecideResponse = {
  consequence: string;
  complete: boolean;
  awaitingFollowUp?: boolean;
  session?: SimL2Session;
  nextEvent?: SimL2Event;
  followUpChoices?: { id: string; label: string }[];
  report?: {
    categoryScores: Record<string, number>;
    overallScore: number;
    scoreBand: ScoreBand;
    finalValuation: number;
    finalCash: number;
    finalEquity: number;
    customers: number;
    monthlyRevenue: number;
    ownershipValue: number;
    acquired: boolean;
    acquisitionPayout: number | null;
  };
  updatedReadinessScore?: number;
  updatedXp?: number;
};

export async function decideLevel2(choiceId: string): Promise<SimL2DecideResponse> {
  return request("/api/simulation/l2-decide", {
    method: "POST",
    body: JSON.stringify({ choiceId }),
  });
}

export type Announcement = { id: string; title: string; body: string; createdAt: string };

export async function getNotifications(): Promise<{ announcements: Announcement[]; unreadCount: number }> {
  return request("/api/me?notifications=1");
}

export async function markNotificationsRead() {
  return request("/api/me", {
    method: "PATCH",
    body: JSON.stringify({ markNotificationsRead: true }),
  });
}

export async function postAnnouncement(adminKey: string, title: string, body: string) {
  return request("/api/admin/post-announcement", {
    method: "POST",
    body: JSON.stringify({ key: adminKey, title, body }),
  });
}
