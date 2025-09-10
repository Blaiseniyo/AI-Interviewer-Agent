import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Calendar, User, Award } from "lucide-react";
import { getInterviewById } from "@/lib/actions/general.action";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getUserById } from "@/lib/actions/auth.action";
import { notFound } from "next/navigation";
import { formatDate, getScoreColor, getScoreLabel } from "@/lib/utils";
import InterviewTranscript from "@/components/InterviewTranscription";

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

      <div className="px-8 mb-8">
        <div className="bg-dark-200 rounded-xl p-6 border border-light-600/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            Candidate Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-200" />
              </div>
              <div>
                <p className="text-sm text-light-100">Candidate</p>
                <p className="text-white font-medium">{candidate.name}</p>
                <p className="text-sm text-light-100">{candidate.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-200" />
              </div>
              <div>
                <p className="text-sm text-light-100">Completed</p>
                <p className="text-white font-medium">
                  {formatDate(feedback.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-primary-200" />
              </div>
              <div>
                <p className="text-sm text-light-100">Overall Score</p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(
                    feedback.totalScore
                  )}`}
                >
                  {feedback.totalScore}/100
                </p>
                <p className="text-sm text-light-100">
                  {getScoreLabel(feedback.totalScore)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Interview Transcript
          </h2>
          <Link href={`/admin/interviews/${params.id}/transcript/${params.candidateId}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-primary-200/50 text-primary-200 hover:bg-primary-200/10"
            >
              View Full Transcript
            </Button>
          </Link>
        </div>
        <InterviewTranscript
          interviewId={params.id}
          userId={params.candidateId}
          compact={false}
          previewMode={true}
          maxPreviewMessages={8}
          user={candidate}
        />
      </div>

      <div className="px-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Category Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback.categoryScores.map((category, index) => (
            <div
              key={index}
              className="bg-dark-200 rounded-xl p-6 border border-light-600/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span
                    className={`text-lg font-bold ${getScoreColor(
                      category.score
                    )}`}
                  >
                    {category.score}/100
                  </span>
                </div>
              </div>
              <p className="text-light-100 text-sm leading-relaxed">
                {category.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="px-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Strengths</h2>
        <div className="bg-dark-200 rounded-xl p-6 border border-light-600/20">
          <ul className="space-y-3">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-light-100">{strength}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Areas for Improvement
        </h2>
        <div className="bg-dark-200 rounded-xl p-6 border border-light-600/20">
          <ul className="space-y-3">
            {feedback.areasForImprovement.map((area, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-light-100">{area}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Final Assessment
        </h2>
        <div className="bg-dark-200 rounded-xl p-6 border border-light-600/20">
          <p className="text-light-100 leading-relaxed whitespace-pre-wrap">
            {feedback.finalAssessment}
          </p>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="flex gap-4">
          <Button
            asChild
            variant="outline"
            className="border-light-600/30 text-light-100 hover:text-white hover:bg-dark-300"
          >
            <Link href={`/admin/interviews/${params.id}`}>
              Back to Interview
            </Link>
          </Button>
          <Button className="bg-primary-200 hover:bg-primary-200/80 text-dark-100">
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackPage;
