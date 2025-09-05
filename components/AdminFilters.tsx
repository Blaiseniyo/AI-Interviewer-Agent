"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterState {
  candidate: string;
  role: string;
  type: string;
  dateFrom: string;
  dateTo: string;
}

interface AdminFiltersProps {
  filters: FilterState;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const AdminFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
}: AdminFiltersProps) => {
  return (
    <div className="filters-section">
      <div className="filters-grid">
        <div className="filter-group">
          <Label htmlFor="candidate">Candidate</Label>
          <Input
            id="candidate"
            placeholder="Search by candidate name..."
            value={filters.candidate}
            onChange={(e) => onFilterChange("candidate", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            placeholder="Filter by role..."
            value={filters.role}
            onChange={(e) => onFilterChange("role", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            className="filter-select"
            value={filters.type}
            onChange={(e) => onFilterChange("type", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Technical">Technical</option>
            <option value="Non-Technical">Non-Technical</option>
          </select>
        </div>

        <div className="filter-group">
          <Label htmlFor="dateFrom">Date From</Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Label htmlFor="dateTo">Date To</Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange("dateTo", e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="clear-filters-btn"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminFilters;
