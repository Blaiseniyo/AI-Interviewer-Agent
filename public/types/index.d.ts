interface Feedback {
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

interface Interview {
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

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
  rubric?: string;
}

interface ChatMessage {
  id: string;
  interviewId: string;
  senderId: string;
  senderType: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Invitation {
  id: string;
  interviewId: string;
  senderId: string;
  recipientId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'completed' | 'sent';
  createdAt: string;
  invitationToken: string;
  deadline?: string;     // Added deadline field
  acceptedAt?: string;
  completedAt?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  role: UserRole;
  profileURL?: string;
  temporaryAccount?: boolean;
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  showCandidate?: boolean;
  isAdmin?: boolean;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
  rubric?: string;
  invitationId?: string;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId?: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

interface SendInvitationEmailParams {
  recipientEmail: string;
  senderName: string;
  receiverName: string;
  invitationLink: string;
  interviewRole: string;
  interviewLevel: string;
}

interface InterviewDetailsProps {
  candidates: Candidate[];
  interviewId: string;
  interviewRole: string;
}

interface ChatMessage {
    id: string;
    content: string;
    senderType: 'user' | 'assistant';
    timestamp?: string;
}

interface InterviewTranscriptProps {
    interviewId: string;
    userId: string;
    user?: { name: string };
    compact?: boolean;
    fullPage?: boolean;
    previewMode?: boolean;
    maxPreviewMessages?: number;
}
