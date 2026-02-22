"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { generateProgress } from "@/utils/progress";
import Loading from "@/components/loading/Loading";
import JobApplicationsTable from "./JobApplicationsTable";
import type { JobApplicationListItem } from "@/data/jobApplication";

const JobApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<JobApplicationListItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || loading) return;
    gsap.fromTo(
      "#job-applications-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.15, delay: 0.15, ease: "sine.inOut" }
    );
  }, [loading]);

  const updateProgress = (start: number, end: number, delay = 0) => {
    setTimeout(() => setProgress(generateProgress(start, end)), delay);
  };

  const fetchApplications = async () => {
    try {
      updateProgress(34, 66);
      const response = await fetch("/api/job-application");
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
      const data: JobApplicationListItem[] = await response.json();
      updateProgress(67, 99, 750);
      setApplications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      setProgress(0);
    } finally {
      updateProgress(100, 100);
      setTimeout(() => setLoading(false), 750);
    }
  };

  useEffect(() => {
    setProgress(generateProgress(1, 33));
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch on mount only
  }, []);

  return (
    <div
      ref={containerRef}
      id="job-applications-container"
      className="block text-black"
    >
      {loading ? (
        <Loading
          progress={progress}
          message="Loading job applications..."
          textColor="black"
          borderColor="border-black"
        />
      ) : error ? (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center">
          <h2 className="mb-6 text-3xl md:text-4xl">{error.message}</h2>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center">
          <h2 className="mb-6 text-3xl md:text-4xl">No applications yet.</h2>
        </div>
      ) : (
        <div className="rounded-md border border-stone-200 bg-white">
          <JobApplicationsTable applications={applications} />
        </div>
      )}
    </div>
  );
};

export default JobApplicationsList;
