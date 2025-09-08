import { z } from "zod";

export const interviewFormSchema = z.object({
  role: z.string().min(1, "Role is required"),
  type: z.enum(["Technical", "Non-Technical", "Mixed"]),
  level: z.enum(["Entry", "Mid", "Senior"]),
  techStack: z.string().min(1, "Tech Stack is required"),
  questions: z
    .array(z.string().min(1, "Question cannot be empty"))
    .min(1, "At least one question is required"),
});

export type InterviewFormData = z.infer<typeof interviewFormSchema>;

export type RubricMode = "text" | "pdf";

export const INTERVIEW_TYPES = [
  { value: "Technical", label: "Technical" },
  { value: "Non-Technical", label: "Non-Technical" },
  { value: "Mixed", label: "Mixed" },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "Entry", label: "Entry Level" },
  { value: "Mid", label: "Mid Level" },
  { value: "Senior", label: "Senior Level" },
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const candidateInviteFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type CandidateInviteFormData = z.infer<typeof candidateInviteFormSchema>