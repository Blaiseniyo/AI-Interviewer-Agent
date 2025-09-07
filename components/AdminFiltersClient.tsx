"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminFilters from "./AdminFilters";

function useDebouncedCallback(
  callback: (key: string, value: string) => void,
  delayMs = 600
) {
  const timeoutRef = useMemo<{ id: NodeJS.Timeout | null }>(
    () => ({ id: null }),
    []
  );
  return (key: string, value: string) => {
    if (timeoutRef.id) clearTimeout(timeoutRef.id);
    timeoutRef.id = setTimeout(() => callback(key, value), delayMs);
  };
}

const AdminFiltersClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const filters = useMemo(
    () => ({
      candidate: searchParams.get("candidate") || "",
      role: searchParams.get("role") || "",
      type: searchParams.get("type") || "",
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
    }),
    [searchParams]
  );

  const updateParam = useDebouncedCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }, 300);

  const handleFilterChange = (
    key: string,
    value: string,
    opts?: { commit?: boolean }
  ) => {
    const isText = key === "candidate" || key === "role";
    if (isText && !opts?.commit) updateParam(key, value);
    else {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    }
  };

  const clearFilters = () => {
    startTransition(() => router.replace(pathname));
  };

  return (
    <div aria-busy={isPending}>
      <AdminFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default AdminFiltersClient;
