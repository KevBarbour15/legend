"use client";

import Divider from "@/components/divider/Divider";
import { Card, CardContent } from "@/components/ui/card";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  howSoonStartOptions,
  type JobApplicationListItem,
} from "@/data/jobApplication";
import {
  UserCircle,
  EnvelopeSimple,
  Phone,
  CalendarBlank,
  FilePdf,
} from "@phosphor-icons/react";

interface JobApplicationCardProps {
  application: JobApplicationListItem;
  index: number;
}

function getHowSoonLabel(value: string): string {
  const option = howSoonStartOptions.find((o) => o.value === value);
  return option?.label ?? value;
}

const JobApplicationCard: React.FC<JobApplicationCardProps> = ({
  application,
}) => {
  const name = `${application.firstName} ${application.lastName}`.trim();
  const resumeUrl = `/api/job-application/${application._id}/resume`;

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
        <Card className="p-3 md:p-6">
          <CardContent className="space-y-4 text-base md:text-lg">
            <div className="text-nowrap border-b-2 border-black pb-3">
              <h2 className="mb-3 text-center text-2xl font-semibold">
                Job Application
              </h2>
              <div className="mb-3 flex w-full items-center justify-between">
                <UserCircle
                  size={32}
                  weight="regular"
                  className="flex-shrink-0"
                />
                <Divider borderColor="grey" />
                <p className="capitalize">{name || "—"}</p>
              </div>
              <div className="mb-3 flex w-full items-center justify-between">
                <EnvelopeSimple
                  size={32}
                  weight="regular"
                  className="flex-shrink-0"
                />
                <Divider borderColor="grey" />
                <a
                  href={`mailto:${application.email}`}
                  className="cursor-pointer transition-all hover:underline"
                >
                  {application.email}
                </a>
              </div>
              <div className="mb-3 flex w-full items-center justify-between">
                <Phone size={32} weight="regular" className="flex-shrink-0" />
                <Divider borderColor="grey" />
                <p>{application.phone}</p>
              </div>
              <div className="mb-3 flex w-full items-center justify-between">
                <CalendarBlank
                  size={32}
                  weight="regular"
                  className="flex-shrink-0"
                />
                <Divider borderColor="grey" />
                <p>{getHowSoonLabel(application.howSoonStart)}</p>
              </div>
              <div className="flex w-full items-center justify-between">
                <FilePdf size={32} weight="regular" className="flex-shrink-0" />
                <Divider borderColor="grey" />
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer font-semibold transition-all hover:underline"
                >
                  View resume (PDF)
                </a>
              </div>
            </div>

            <LabeledBlock label="How did you hear about Legend Has It?" />
            <p className="whitespace-pre-wrap pl-2">{application.hearAbout}</p>

            <LabeledBlock label="What made you want to apply here specifically?" />
            <p className="whitespace-pre-wrap pl-2">{application.whyApply}</p>

            <LabeledBlock label="Genres or eras of music you listen to or are curious about" />
            <p className="whitespace-pre-wrap pl-2">
              {application.musicGenres}
            </p>

            <LabeledBlock label="3 albums you'd play behind the bar" />
            <p className="whitespace-pre-wrap pl-2">
              {application.threeAlbums}
            </p>

            <LabeledBlock label="Bar or restaurant experience" />
            <p className="whitespace-pre-wrap pl-2">
              {application.barExperience}
            </p>

            <LabeledBlock label="Experience with craft beer and/or natural wine" />
            <p className="whitespace-pre-wrap pl-2">
              {application.craftBeerWine}
            </p>

            <LabeledBlock label="Time you worked through a busy rush" />
            <p className="whitespace-pre-wrap pl-2">{application.busyRush}</p>

            <LabeledBlock label="Time you received difficult feedback" />
            <p className="whitespace-pre-wrap pl-2">
              {application.difficultFeedback}
            </p>

            <LabeledBlock label="Current availability" />
            <p className="whitespace-pre-wrap pl-2">
              {application.availability}
            </p>

            {application.anythingElse && (
              <>
                <LabeledBlock label="Anything else" />
                <p className="whitespace-pre-wrap pl-2">
                  {application.anythingElse}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};

function LabeledBlock({ label }: { label: string }) {
  return (
    <h3 className="border-t border-black/20 pt-3 text-lg font-semibold">
      {label}
    </h3>
  );
}

export default JobApplicationCard;
