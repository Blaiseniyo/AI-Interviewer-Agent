export interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId?: string;
  createdBy?: string;
  type: string;
  finalized?: boolean;
  isAdminCreated?: boolean;
  rubric?: string;
  coverImage?: string;
}

export interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

export interface ChatMessage {
  id: string;
  interviewId: string;
  senderId: string;
  senderType: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Invitation {
  id: string;
  interviewId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: string;
  invitationToken: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface User {
  name: string;
  email: string;
  id: string;
  role: UserRole;
  profileURL?: string;
}

export interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  showCandidate?: boolean;
  isAdmin?: boolean;
}

export interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

export interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

export interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

export interface GetLatestInterviewsParams {
  userId?: string;
  limit?: number;
}

export interface SignInParams {
  email: string;
  idToken: string;
}

export interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

export type FormType = "sign-in" | "sign-up";

export interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

export interface TechIconProps {
  techStack: string[];
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface SendInvitationEmailParams {
  recipientEmail: string;
  senderName: string;
  receiverName: string;
  invitationLink: string;
  interviewRole: string;
  interviewLevel: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  status: string;
  score: number;
  completedAt: string | null;
}

export interface InterviewDetailsProps {
  candidates: Candidate[];
  interviewId: string;
  interviewRole: string;
}

export interface InterviewTranscriptProps {
  interviewId: string;
  userId: string;
  compact?: boolean;
  fullPage?: boolean;
  previewMode?: boolean;
  maxPreviewMessages?: number;
  user: User;
}

export interface CandidatesTableProps {
  candidates: Candidate[];
  interviewId: string;
}