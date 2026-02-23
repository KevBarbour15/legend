"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { generateProgress } from "@/utils/progress";
import Loading from "@/components/loading/Loading";
import JobApplicationsTable from "./JobApplicationsTable";
import DashboardEmptyState from "@/components/dashboard-detail/DashboardEmptyState";
import DashboardErrorState from "@/components/dashboard-detail/DashboardErrorState";
import type { JobApplicationListItem } from "@/data/jobApplication";
import { Briefcase, Eye, EyeSlash } from "@phosphor-icons/react";

const JobApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<JobApplicationListItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const notViewed = useMemo(
    () => applications.filter((a) => !(a.viewed ?? false)),
    [applications]
  );
  const viewed = useMemo(
    () => applications.filter((a) => a.viewed ?? false),
    [applications]
  );

  const handleApplicationUpdate = (
    id: string,
    patch: { viewed?: boolean; contacted?: boolean }
  ) => {
    setApplications((prev) =>
      prev.map((app) =>
        app._id === id ? { ...app, ...patch } : app
      )
    );
  };

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
        <DashboardErrorState
          message={error.message}
          onRetry={fetchApplications}
        />
      ) : applications.length === 0 ? (
        <DashboardEmptyState
          message="No applications yet"
          description="Job applications from your site will appear here."
          icon={<Briefcase weight="duotone" />}
        />
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-500">
              <EyeSlash weight="duotone" size={18} />
              Not viewed ({notViewed.length})
            </h2>
            {notViewed.length === 0 ? (
              <p className="rounded-md border border-stone-200 bg-stone-50 px-4 py-6 text-center text-sm text-stone-500">
                All applications have been marked as viewed.
              </p>
            ) : (
              <div className="rounded-md border border-stone-200 bg-white">
                <JobApplicationsTable
                  applications={notViewed}
                  onApplicationUpdate={handleApplicationUpdate}
                />
              </div>
            )}
          </section>
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-stone-500">
              <Eye weight="duotone" size={18} />
              Viewed ({viewed.length})
            </h2>
            {viewed.length === 0 ? (
              <p className="rounded-md border border-stone-200 bg-stone-50 px-4 py-6 text-center text-sm text-stone-500">
                No applications marked as viewed yet.
              </p>
            ) : (
              <div className="rounded-md border border-stone-200 bg-white">
                <JobApplicationsTable
                  applications={viewed}
                  onApplicationUpdate={handleApplicationUpdate}
                />
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default JobApplicationsList;
