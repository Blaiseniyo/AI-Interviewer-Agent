"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function AdminLoading() {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname === "/admin/") {
    return (
      <div className="w-full">
        <div className="flex justify-between items-start p-8 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, Admin!
            </h1>
            <p className="text-light-100">AI-Driven Interviews</p>
          </div>
          <Image
            src="/user-avatar.png"
            alt="User Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        <div className="px-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCardSkeleton />
          </div>
        </div>

        <div className="px-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Previously Created Interviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <DashboardCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/interviews") {
    return (
      <section className="flex flex-col mx-6 gap-6 mt-8">
        <h2>Interviews</h2>
        <div className="interviews-section">
          {Array.from({ length: 6 }).map((_, i) => (
            <InterviewCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (pathname?.match(/^\/admin\/interviews\/[^/]+$/)) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-start p-8 pb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-md" />
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Loading Interview...
              </h1>
              <p className="text-light-100">
                Interview Details & Candidate Results
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 mb-8">
          <InterviewDetailsSkeleton />
        </div>

        <div className="px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Candidates</h2>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
          <CandidatesTableSkeleton />
        </div>
      </div>
    );
  }

  if (pathname?.match(/^\/admin\/interviews\/[^/]+\/feedback\/[^/]+$/)) {
    return <FeedbackPageSkeleton />;
  }

  return (
    <div className="flex h-screen admin-layout bg-dark-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-dark-200 rounded-xl p-6 border border-light-600/20"
                >
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCardSkeleton() {
  return (
    <div className="bg-dark-200 rounded-xl p-6 shadow-sm border border-light-600/20">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
      </div>
      <Skeleton className="h-6 w-40 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}

function InterviewCardSkeleton() {
  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg">
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="rounded-full size-[90px]" />
          <Skeleton className="h-6 w-40 mt-5" />
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Skeleton className="w-[22px] h-[22px]" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Skeleton className="w-[22px] h-[22px]" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function InterviewDetailsSkeleton() {
  return (
    <div className="bg-dark-200 rounded-xl p-6 border border-light-600/20">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div>
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-light-600/20">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

function CandidatesTableSkeleton() {
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
            {Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-12" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-8 w-28 rounded-md" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeedbackPageSkeleton() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-start p-8 pb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-md" />
          <div>
            <Skeleton className="h-8 w-64 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      <div className="px-8 mb-8">
        <div className="bg-dark-200 rounded-xl p-6 border border-light-600/20">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-24 mb-1" />
                  {i === 0 && <Skeleton className="h-3 w-32" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 mb-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-dark-200 rounded-xl p-6 border border-light-600/20"
            >
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-32" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="px-8 mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="bg-dark-200 rounded-xl p-6 border border-light-600/20">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="px-8 pb-8">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>
    </div>
  );
}
