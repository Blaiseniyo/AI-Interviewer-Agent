import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { candidateInviteFormSchema, CandidateInviteFormData } from "@/public/types/validations";

interface UseInviteCandidateProps {
    interviewId: string;
    onSuccess?: () => void;
}

export const useInviteCandidate = ({ interviewId, onSuccess }: UseInviteCandidateProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CandidateInviteFormData>({
        resolver: zodResolver(candidateInviteFormSchema),
        defaultValues: {
            email: "",
            deadline: "",
        },
    });

    const { register, handleSubmit, formState: { errors }, reset } = form;

    const submitInvitation = async (data: CandidateInviteFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/invitation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    interviewId,
                    recipientEmail: data.email,
                    deadline: data.deadline,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Failed to send invitation");
            }

            const message = result.emailSent
                ? `Invitation sent successfully to ${data.email}`
                : `Invitation created for ${data.email}. ${result.emailStatus || "Email service not configured."}`;

            toast.success(message);

            reset();
            onSuccess?.();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to send invitation"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        reset();
    };

    return {
        register,
        handleSubmit: handleSubmit(submitInvitation),
        errors,
        isSubmitting,
        resetForm,
    };
};