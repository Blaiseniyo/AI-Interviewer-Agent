import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getInterviewById } from "@/lib/actions/general.action";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getUserById } from "@/lib/actions/auth.action";
import { notFound } from "next/navigation";
import FeedbackTabs from "@/components/FeedbackTabs";

type FeedbackPageProps = {
  params: {
    id: string;
    candidateId: string;
  };
};

async function FeedbackPage({ params }: FeedbackPageProps) {
  const interview = await getInterviewById(params.id);
  const feedback = await getFeedbackByInterviewId({
    interviewId: params.id,
    userId: params.candidateId,
  });
  const candidate = await getUserById(params.candidateId);

  if (!interview || !feedback || !candidate) {
    notFound();
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-start p-8 pb-6">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className="text-light-100 hover:text-white hover:bg-dark-300"
          >
            <Link href={`/admin/interviews/${params.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Candidate Feedback
            </h1>
            <p className="text-light-100">
              {interview.role} Interview - {candidate.name}
            </p>
          </div>
        </div>
      </div>
      <FeedbackTabs
        interview={interview}
        feedback={feedback}
        candidate={candidate}
        interviewId={params.id}
      />
    </div>
  );
}

export default FeedbackPage;
