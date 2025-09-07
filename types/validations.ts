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
