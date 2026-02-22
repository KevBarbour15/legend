"use client";

import Divider from "@/components/divider/Divider";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { JobApplicationListItem } from "@/data/jobApplication";
import JobApplicationDetailContent from "@/components/job-applications/JobApplicationDetailContent";

interface JobApplicationCardProps {
  application: JobApplicationListItem;
  index: number;
}

const JobApplicationCard: React.FC<JobApplicationCardProps> = ({
  application,
}) => {
  const name = `${application.firstName} ${application.lastName}`.trim();

  return (
    <AccordionItem
      value={`application-${application._id}`}
      className="border-t-2 border-black"
    >
      <AccordionTrigger>
        <div className="flex w-full justify-between pr-3 text-base font-semibold md:pr-6 md:text-xl">
          <p className="text-nowrap">{name || "Unnamed"}</p>
          <Divider borderColor="grey" />
          <p className="flex items-center gap-3 md:gap-6">
            {new Date(application.submittedAt).toLocaleDateString("en-US", {
              timeZone: "UTC",
            })}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-black py-3">
        <JobApplicationDetailContent application={application} />
      </AccordionContent>
    </AccordionItem>
  );
};

export default JobApplicationCard;
