"use client";

import { useState } from "react";
import {
  DetailCard,
  DetailSection,
  DetailField,
  DetailBody,
} from "@/components/dashboard-detail/DetailCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  howSoonStartOptions,
  type JobApplicationListItem,
} from "@/data/jobApplication";

interface JobApplicationDetailContentProps {
  application: JobApplicationListItem;
  onApplicationUpdate?: (
    id: string,
    patch: { viewed?: boolean; contacted?: boolean }
  ) => void;
}

export function getHowSoonLabel(value: string): string {
  const option = howSoonStartOptions.find((o) => o.value === value);
  return option?.label ?? value;
}

export default function JobApplicationDetailContent({
  application,
  onApplicationUpdate,
}: JobApplicationDetailContentProps) {
  const name = `${application.firstName} ${application.lastName}`.trim();
  const resumeUrl = `/api/job-application/${application._id}/resume`;
  const [viewed, setViewed] = useState(application.viewed ?? false);
  const [contacted, setContacted] = useState(application.contacted ?? false);

  const handleViewedChange = async (checked: boolean) => {
    try {
      const res = await fetch(`/api/job-application/${application._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewed: checked }),
      });
      if (res.ok) {
        setViewed(checked);
        onApplicationUpdate?.(application._id, { viewed: checked });
      }
    } catch {
      // revert on error
      setViewed(!checked);
    }
  };

  const handleContactedChange = async (checked: boolean) => {
    try {
      const res = await fetch(`/api/job-application/${application._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacted: checked }),
      });
      if (res.ok) {
        setContacted(checked);
        onApplicationUpdate?.(application._id, { contacted: checked });
      }
    } catch {
      setContacted(!checked);
    }
  };

  return (
    <DetailCard>
      <DetailSection title="Status">
        <div className="flex flex-wrap items-center gap-6 py-2 sm:py-1.5">
          <div className="flex items-center gap-2">
            <Switch
              id={`viewed-${application._id}`}
              checked={viewed}
              onCheckedChange={handleViewedChange}
            />
            <Label
              htmlFor={`viewed-${application._id}`}
              className="text-sm font-medium text-stone-700"
            >
              Viewed
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id={`contacted-${application._id}`}
              checked={contacted}
              onCheckedChange={handleContactedChange}
            />
            <Label
              htmlFor={`contacted-${application._id}`}
              className="text-sm font-medium text-stone-700"
            >
              Contacted
            </Label>
          </div>
        </div>
      </DetailSection>
      <DetailSection title="Contact">
        <DetailField label="Name" value={name || "—"} />
        <DetailField
          label="Email"
          value={application.email}
          href={`mailto:${application.email}`}
        />
        <DetailField label="Phone" value={application.phone} />
        <DetailField
          label="Start"
          value={getHowSoonLabel(application.howSoonStart)}
        />
        <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-center sm:gap-3 sm:py-1.5">
          <span className="min-w-[100px] text-sm text-stone-500">Resume</span>
          <Button variant="outline" size="sm" asChild>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              View resume
            </a>
          </Button>
        </div>
      </DetailSection>

      <DetailSection title="How did you hear about Legend Has It?">
        <DetailBody>{application.hearAbout}</DetailBody>
      </DetailSection>

      <DetailSection title="What made you want to apply here specifically?">
        <DetailBody>{application.whyApply}</DetailBody>
      </DetailSection>

      <DetailSection title="Genres or eras of music you listen to or are curious about">
        <DetailBody>{application.musicGenres}</DetailBody>
      </DetailSection>

      <DetailSection title="3 albums you'd play behind the bar">
        <DetailBody>{application.threeAlbums}</DetailBody>
      </DetailSection>

      <DetailSection title="Bar or restaurant experience">
        <DetailBody>{application.barExperience}</DetailBody>
      </DetailSection>

      <DetailSection title="Experience with craft beer and/or natural wine">
        <DetailBody>{application.craftBeerWine}</DetailBody>
      </DetailSection>

      <DetailSection title="Time you worked through a busy rush">
        <DetailBody>{application.busyRush}</DetailBody>
      </DetailSection>

      <DetailSection title="Time you received difficult feedback">
        <DetailBody>{application.difficultFeedback}</DetailBody>
      </DetailSection>

      <DetailSection title="Current availability">
        <DetailBody>{application.availability}</DetailBody>
      </DetailSection>

      {application.anythingElse && (
        <DetailSection title="Anything else">
          <DetailBody>{application.anythingElse}</DetailBody>
        </DetailSection>
      )}
    </DetailCard>
  );
}
