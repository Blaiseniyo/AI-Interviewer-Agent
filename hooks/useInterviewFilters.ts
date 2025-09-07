import { useState, useEffect } from "react";
import { Interview, FilterState, filterInterviews } from "@/lib/admin-utils";

export const useInterviewFilters = (interviews: Interview[]) => {
  const [filteredInterviews, setFilteredInterviews] =
    useState<Interview[]>(interviews);
  const [filters, setFilters] = useState<FilterState>({
    candidate: "",
    role: "",
    type: "",
    dateFrom: "",
    dateTo: "",
  });

  // Apply filters whenever interviews or filters change
  useEffect(() => {
    const filtered = filterInterviews(interviews, filters);
    setFilteredInterviews(filtered);
  }, [interviews, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      candidate: "",
      role: "",
      type: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  return {
    filteredInterviews,
    filters,
    handleFilterChange,
    clearFilters,
  };
};
