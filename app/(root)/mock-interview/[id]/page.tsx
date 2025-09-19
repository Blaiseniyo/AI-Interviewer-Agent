import { redirect } from "next/navigation";

import {
  getMockInterviewById,
  // getMockInterviewFeedbackByInterviewId,
} from "@/lib/actions/general.action";

import { getCurrentUser } from "@/lib/actions/auth.action";
import InterviewCall from "@/components/InterviewCall";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getMockInterviewById(id);
  if (!interview) redirect("/");


  // const feedback = await getMockInterviewFeedbackByInterviewId({
  //   interviewId: id,
  //   userId: user.id,
  // });

  return (

    <InterviewCall interview={interview} interviewId={id} user={user} retake={true} />
  );
};

export default InterviewDetails;
