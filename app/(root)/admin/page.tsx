import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { getAllInterviews } from "@/lib/actions/general.action";
import { toast } from "sonner";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { IconContainer } from "@/components/ui/IconContainer";

const AdminDashboard = async () => {
  let interviews: Interview[] = [];
  const user = await getCurrentUser();
  const userName = user?.name.split(' ')[0];

  try {
    const result = await getAllInterviews();
    interviews = Array.isArray(result) ? result : [];
  } catch (error: any) {
    toast.error(error.message || "Error fetching interviews");
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-start p-8 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back, {userName}!
          </h1>
          <p className="text-light-100">AI-Driven Interviews</p>
        </div>
      </div>

      <div className="px-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-200 rounded-xl p-6 shadow-sm border border-light-600/20 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <IconContainer icon={Video} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Create New Interview
            </h3>
            <p className="text-light-100 text-sm mb-4">
              Create AI interviews and schedule them with candidates
            </p>
            <Button
              asChild
              className="font-medium"
            >
              <Link href="/admin/interviews/new">Create Interview</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Previously Created Interviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {interviews.length > 0 ? (
            interviews.slice(0, 4).map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                isAdmin={true}
              />
            ))
          ) : (
            <p>Ooops! You have not created any interviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
