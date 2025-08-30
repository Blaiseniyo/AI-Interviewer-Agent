import Link from "next/link";
import { Button } from "@/components/ui/button";

import InterviewCard from "@/components/InterviewCard";
import { getFilteredInterviews } from "@/lib/actions/general.action";
import { Suspense } from "react";
import AdminFiltersClient from "@/components/AdminFiltersClient";

type AdminPageSearchParams = {
  searchParams?: {
    role?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    candidate?: string;
  };
};

const AdminDashboard = async ({ searchParams }: AdminPageSearchParams) => {
  const interviews = await getFilteredInterviews({
    role: searchParams?.role,
    type: searchParams?.type,
    dateFrom: searchParams?.dateFrom,
    dateTo: searchParams?.dateTo,
    candidate: searchParams?.candidate,
  });

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage and analyze all interviews</p>
        </div>
        <Button asChild className="btn-primary">
          <Link href="/admin/interviews/new">Create Interview</Link>
        </Button>
      </div>

      <Suspense>
        <AdminFiltersClient />
      </Suspense>

      {interviews?.length === 0 ? (
        <div className="no-results">
          <p>No interviews found.</p>
          <Button variant="outline" asChild>
            <Link href="/admin">Clear Filters</Link>
          </Button>
        </div>
      ) : (
        <div className="interviews-grid">
          {interviews?.map((interview) => (
            <InterviewCard
              key={interview.id}
              interviewId={interview.id}
              userId={interview.userId}
              role={interview.role}
              type={interview.type}
              techstack={interview.techstack}
              createdAt={interview.createdAt}
              showCandidate
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
