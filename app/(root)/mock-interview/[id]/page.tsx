import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";
import RetakeHandler from "@/components/RetakeHandler";

import {
  getFeedbackByInterviewId,
  getMockInterviewById,
  getMockInterviewFeedbackByInterviewId,
} from "@/lib/actions/general.action";

import {
  getUserInvitation,
  verifyInvitationToken
} from "@/lib/actions/interviewInvitation.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getMockInterviewById(id);
  if (!interview) redirect("/");


  const feedback = await getMockInterviewFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
    <>
      {/* Client component to handle retake functionality */}
      <RetakeHandler interviewId={id} userId={user.id} />

      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user?.name!}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        isMockInterview={true}
      />
    </>
  );
};

export default InterviewDetails;
