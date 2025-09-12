// import { Interview } from "@/public/types";
import dayjs from "dayjs";
import {
  Book,
  ClipboardPen,
  LayoutDashboard,
  List,
  Users,
} from "lucide-react";

export interface FilterState {
  role: string;
  type: string;
  dateFrom: string;
  dateTo: string;
}

export const filterInterviews = (
  interviews: Interview[],
  filters: FilterState
): Interview[] => {
  let filtered = interviews;

  if (filters.role) {
    filtered = filtered.filter((interview) =>
      interview.role.toLowerCase().includes(filters.role.toLowerCase())
    );
  }

  if (filters.type) {
    filtered = filtered.filter((interview) => interview.type === filters.type);
  }

  if (filters.dateFrom) {
    filtered = filtered.filter((interview) =>
      dayjs(interview.createdAt).isAfter(dayjs(filters.dateFrom).subtract(1, "day"))
    );
  }

  if (filters.dateTo) {
    filtered = filtered.filter((interview) =>
      dayjs(interview.createdAt).isBefore(dayjs(filters.dateTo).add(1, "day"))
    );
  }

  return filtered;
};

export const adminNavigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    name: "All Interview",
    href: "/admin/interviews",
    icon: List,
    isActive: false,
  },
  {
    name: "Interviews Invites",
    href: "/interviews",
    icon: ClipboardPen,
    isActive: false,
  },  
  {
    name: "Mock Interviews",
    href: "/mock-interviews",
    icon: Book,
    isActive: false,
  },
];