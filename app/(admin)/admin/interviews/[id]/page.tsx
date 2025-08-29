import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Calendar, Code, Award } from "lucide-react";
import { getInterviewById } from "@/lib/actions/general.action";
import { notFound } from "next/navigation";
import CandidatesTable from "@/components/CandidatesTable";
import { getCandidatesByInterviewId } from "@/lib/actions/general.action";
import { formatDate } from "@/lib/utils";

type InterviewPageProps = {
  params: {
    id: string;
  };
};

async function InterviewPage({ params }: InterviewPageProps) {
  const interview = await getInterviewById(params.id);

  if (!interview) {
    notFound();
  }

  const candidates = await getCandidatesByInterviewId(params.id);

  return (
    <div className="w-full">
      <div className="flex justify-between items-start p-8 pb-6">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className="text-light-100 hover:text-white hover:bg-dark-300"
          >
            <Link href="/admin/interviews">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Interviews
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {interview.role} Interview
            </h1>
            <p className="text-light-100">
              Interview Details & Candidate Results
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 mb-8">
        <div className="bg-dark-200 rounded-xl p-6 border border-light-600/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            Interview Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-primary-200" />
              </div>
              <div>
                <p className="text-sm text-light-100">Role</p>
                <p className="text-white font-medium">{interview.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-200" />
              </div>
              <div>
                <p className="text-sm text-light-100">Type</p>
                <p className="text-white font-medium">{interview.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-200" />
              </div>
              <div>
                <p className="text-sm text-light-100">Created</p>
                <p className="text-white font-medium">
                  {formatDate(interview.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-200" />
              </div>
              <div>
                <p className="text-sm text-light-100">Candidates</p>
                <p className="text-white font-medium">{candidates.length}</p>
              </div>
            </div>
          </div>

          {interview.techstack && (
            <div className="mt-6 pt-6 border-t border-light-600/20">
              <p className="text-sm text-light-100 mb-2">Tech Stack</p>
              <p className="text-white">{interview.techstack}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Candidates</h2>
          <Button className="bg-primary-200 hover:bg-primary-200/80 text-dark-100">
            Invite Candidate
          </Button>
        </div>

        <CandidatesTable candidates={candidates} interviewId={params.id} />
      </div>
    </div>
  );
}

export default InterviewPage;
