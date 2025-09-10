"use client";

import { Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/FormFieldInput";
import InfoBox from "@/components/ui/InfoBox";
import { useInviteCandidate } from "@/hooks/useInviteCandidate";

interface InviteCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
    interviewId: string;
    interviewRole?: string;
}

const InviteCandidateModal = ({
    isOpen,
    onClose,
    interviewId,
    interviewRole = "Interview",
}: InviteCandidateModalProps) => {
    const { register, handleSubmit, errors, isSubmitting, resetForm } = useInviteCandidate({
        interviewId,
        onSuccess: onClose,
    });

    const handleClose = () => {
        if (!isSubmitting) {
            resetForm();
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Invite Candidate"
            description={`Send an interview invitation for: ${interviewRole}`}
            icon={<UserPlus className="w-5 h-5 text-primary-200" />}
            disabled={isSubmitting}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                    name="email"
                    label="Candidate Email Address"
                    type="email"
                    placeholder="candidate@example.com"
                    required
                    autoFocus
                    disabled={isSubmitting}
                    register={register}
                    error={errors.email}
                />

                <InfoBox
                    icon={<Mail className="w-4 h-4" />}
                    title="How it works"
                    description="An invitation email will be sent to the candidate with a direct link to join the interview. If they don't have an account, they'll be prompted to create one."
                    variant="info"
                />

                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 border-light-600/20 text-light-100 hover:text-white hover:bg-dark-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        loadingText="Sending..."
                        className="flex-1 bg-primary-200 hover:bg-primary-200/80 text-dark-100"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Invitation
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default InviteCandidateModal;
