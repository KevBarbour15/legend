"use client";

import React, { useState } from "react";
import type { JobApplicationListItem } from "@/data/jobApplication";
import {
  getHowSoonLabel,
} from "@/components/job-applications/JobApplicationDetailContent";
import JobApplicationDetailContent from "@/components/job-applications/JobApplicationDetailContent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface JobApplicationsTableProps {
  applications: JobApplicationListItem[];
  onApplicationUpdate?: (
    id: string,
    patch: { viewed?: boolean; contacted?: boolean }
  ) => void;
}

export default function JobApplicationsTable({
  applications,
  onApplicationUpdate,
}: JobApplicationsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="sticky top-0 z-10 border-stone-200 bg-white hover:bg-transparent">
          <TableHead className="w-8"></TableHead>
          <TableHead className="font-semibold text-stone-700">Name</TableHead>
          <TableHead className="font-semibold text-stone-700">Date</TableHead>
          <TableHead className="font-semibold text-stone-700">How soon</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => {
          const name = `${application.firstName} ${application.lastName}`.trim();
          const isExpanded = expandedId === application._id;
          return (
            <React.Fragment key={application._id}>
              <TableRow
                className={cn(
                  "cursor-pointer transition-colors",
                  isExpanded && "bg-stone-100"
                )}
                onClick={() => toggle(application._id)}
              >
                <TableCell className="w-8 py-2">
                  {isExpanded ? (
                    <CaretDown size={16} weight="bold" className="text-stone-600" />
                  ) : (
                    <CaretRight size={16} weight="bold" className="text-stone-400" />
                  )}
                </TableCell>
                <TableCell className="font-medium capitalize">
                  {name || "Unnamed"}
                </TableCell>
                <TableCell className="text-stone-600">
                  {new Date(application.submittedAt).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  })}
                </TableCell>
                <TableCell className="text-stone-600">
                  {getHowSoonLabel(application.howSoonStart)}
                </TableCell>
              </TableRow>
              {isExpanded && (
                <TableRow key={`${application._id}-detail`} className="bg-stone-50">
                  <TableCell colSpan={4} className="p-4">
                    <JobApplicationDetailContent
                      application={application}
                      onApplicationUpdate={onApplicationUpdate}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
