import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { getStatusBadge, formatDate } from "@/lib/utils";
import { CandidatesTableProps } from "@/types";



const CandidatesTable = ({ candidates, interviewId }: CandidatesTableProps) => {
  return (
    <div className="bg-dark-200 rounded-xl border border-light-600/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-300 border-b border-light-600/20">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-light-100">
                Candidate
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-light-100">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-light-100">
                Score
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-light-100">
                Completed
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-light-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-600/20">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-dark-300/50">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-white font-medium">{candidate.name}</p>
                    <p className="text-sm text-light-100">{candidate.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                      candidate.status
                    )}`}
                  >
                    {candidate.status === "completed"
                      ? "Completed"
                      : candidate.status === "in_progress"
                      ? "In Progress"
                      : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {candidate.score ? (
                    <span className="text-white font-medium">
                      {candidate.score}%
                    </span>
                  ) : (
                    <span className="text-light-100">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {candidate.completedAt ? (
                    <span className="text-white">
                      {formatDate(candidate.completedAt)}
                    </span>
                  ) : (
                    <span className="text-light-100">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Button
                    asChild
                    size="sm"
                    className="bg-primary-200 hover:bg-primary-200/80 text-dark-100"
                  >
                    <Link
                      href={`/admin/interviews/${interviewId}/feedback/${candidate.id}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Feedback
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidatesTable;
