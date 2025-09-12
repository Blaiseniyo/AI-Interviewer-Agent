import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video, Copy, Send } from "lucide-react";
import { getAllInterviews } from "@/lib/actions/general.action";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const AdminDashboard = async () => {
  let interviews: Interview[] = [];
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
            Welcome back, Admin!
          </h1>
          <p className="text-light-100">AI-Driven Interviews</p>
        </div>
      </div>

      <div className="px-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-200 rounded-xl p-6 shadow-sm border border-light-600/20 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-200 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-gray-300" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Create New Interview
            </h3>
            <p className="text-light-100 text-sm mb-4">
              Create AI interviews and schedule them with candidates
            </p>
            <Button
              asChild
              className="bg-primary-200 hover:bg-primary-200/80 text-dark-100"
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
          {Array.isArray(interviews) && interviews.length > 0 ? (
            interviews.slice(0, 4).map((interview) => (
              <div
                key={interview.id}
                className="bg-dark-200 rounded-xl p-6 shadow-sm border border-light-600/20 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-primary-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-300 font-semibold text-sm">
                      {interview.role.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-light-100">
                    {formatDate(interview.createdAt)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {interview.role}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-light-600/30 text-light-100 hover:bg-light-600/20"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-primary-200 hover:bg-primary-200/80 text-dark-100"
                  >
                    <Link href={`/admin/interviews/${interview.id}`}>
                      <Send className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>Ooops! No interviews found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
