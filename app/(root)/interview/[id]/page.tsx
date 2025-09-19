import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";

import {
  getUserInvitation,
  verifyInvitationToken
} from "@/lib/actions/interviewInvitation.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import InterviewCall from "@/components/InterviewCall";

const InterviewDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { invitationToken } = await searchParams;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  // Check if the interview was admin-created
  const isAdminCreated = interview.isAdminCreated === true;

  // Get user's invitation for this interview if it exists
  const userInvitation = await getUserInvitation(id, user.id);

  console.log("User Invitation:", userInvitation);

  // Check if feedback exists for this user and interview
  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  // Case 1: If invitation token is provided, validate it
  if (invitationToken) {
    const validInvitation = await verifyInvitationToken(id, invitationToken);

    if (!validInvitation || validInvitation.recipientId !== user.id) {
      // Invalid token or token not assigned to current user
      redirect("/");
    }

    // If user completed the interview, redirect to feedback page
    if (feedback && validInvitation.status === "completed") {
      redirect(`/interview/${id}/feedback`);
    }
  }
  // Case 2: No token provided
  else {
    // If admin created and user has no invitation, redirect
    if (isAdminCreated && !userInvitation) {
      redirect("/");
    }

    // If user has invitation and has completed the interview, redirect to feedback
    if (userInvitation && userInvitation.status === "completed" && feedback) {
      redirect(`/interview/${id}/feedback`);
    }

    // If no invitation exists at all for admin-created interviews, redirect
    if (isAdminCreated && !userInvitation) {
      redirect("/");
    }
  }

  return (
    <InterviewCall interview={interview} interviewId={id} user={user} userInvitation={userInvitation!} />
  );
};

export default InterviewDetails;
