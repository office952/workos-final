import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJobOverview } from "../../../jobsApi";
import { useContinuityFacts } from "../../shell/ObjectContinuity";

type JobRow = {
  jobId: string;
  inscription: string;
  href: string;
  stageLabel: string;
  nextActionLabel: string;
};

export function JobsLaunch() {
  useContinuityFacts({});
  const [jobs, setJobs] = useState<JobRow[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchJobOverview()
      .then((overview) => {
        if (cancelled) {
          return;
        }
        setJobs(
          overview.jobs.map((job) => ({
            jobId: job.jobId,
            inscription: job.inscription,
            href: job.href,
            stageLabel: job.stageLabel,
            nextActionLabel: job.nextActionLabel,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="ui20-status">Lucrările nu au putut fi încărcate.</p>;
  }
  if (!jobs) {
    return <p className="ui20-status">Se încarcă lucrările…</p>;
  }

  return (
    <article className="ui20-surface" data-surface="lucrari">
      <h1>Lucrări</h1>
      <p className="ui20-kicker">
        Listă de lucrări pe același motor. Nu este Acasă și nu înlocuiește runtime-ul
        curent.
      </p>
      {jobs.length === 0 ? <p>Nicio lucrare încă.</p> : null}
      {jobs.map((job) => (
        <Link key={job.jobId} className="ui20-row" to={job.href}>
          <span className="ui20-v">{job.inscription}</span>
          <span className="ui20-k">
            {job.stageLabel} · {job.nextActionLabel}
          </span>
        </Link>
      ))}
    </article>
  );
}
