"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { ApiJob } from "@/lib/api-types";
import Footer from "@/components/layout/Footer";

export default function CareersPage() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [applyingJob, setApplyingJob] = useState<ApiJob | null>(null);
  const [appForm, setAppForm] = useState({ fullName: "", email: "", phone: "", coverNote: "" });
  const [appState, setAppState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [appMsg, setAppMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get<{ jobs: ApiJob[] }>("/api/careers")
      .then(r => setJobs(r.data?.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const departments = ["all", ...Array.from(new Set(jobs.map(j => j.department)))];
  const types = ["all", ...Array.from(new Set(jobs.map(j => j.type)))];

  const filtered = jobs.filter(j =>
    (departmentFilter === "all" || j.department === departmentFilter) &&
    (typeFilter === "all" || j.type === typeFilter)
  );

  const openApply = (job: ApiJob) => {
    setApplyingJob(job);
    setAppForm({ fullName: "", email: "", phone: "", coverNote: "" });
    setAppState("idle");
    setAppMsg("");
  };

  const submitApply = async () => {
    if (!applyingJob) return;
    if (!appForm.fullName || !appForm.email || !appForm.phone) {
      setAppState("error");
      setAppMsg("Please fill in name, email and phone");
      return;
    }
    setAppState("sending");
    const r = await api.post<{ application: unknown }>(`/api/careers/${applyingJob.id}/apply`, appForm);
    if (r.status < 400) {
      setAppState("sent");
      setAppMsg("Application received! We'll get back to you.");
    } else {
      setAppState("error");
      setAppMsg(r.error || "Failed to submit");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-6 lg:px-10 pt-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Home
        </Link>
      </div>
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 via-transparent to-emerald-900/10" />
        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-16 sm:pb-24">
          <p className="text-xs font-semibold text-brand-gold uppercase tracking-[0.15em] mb-4">Careers</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight">
            Work with us
          </h1>
          <p className="text-base text-white/60 mt-4 leading-relaxed max-w-xl">
            We&apos;re building the future of property in Kano. Join a team that cares about doing things right.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
            {[
              { v: "9", l: "Team members" },
              { v: "4", l: "Cities served" },
              { v: "Since 2025", l: "Established" },
            ].map(s => (
              <div key={s.l}>
                <p className="text-xl font-bold text-white">{s.v}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto w-full px-5 sm:px-6 lg:px-10 py-12 sm:py-16">
        {loading ? (
          <div className="text-center py-12 text-sm text-gray-400">Loading jobs…</div>
        ) : jobs.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No openings right now</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              We don&apos;t have any open roles at the moment. Send us your CV and we&apos;ll keep you in mind.
            </p>
            <Link href="/contact" className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors">
              Send your CV
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 mr-1">Department:</span>
                {departments.map(d => (
                  <button
                    key={d}
                    onClick={() => setDepartmentFilter(d)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${departmentFilter === d ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    {d === "all" ? "All" : d}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 mr-1">Type:</span>
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${typeFilter === t ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    {t === "all" ? "All" : t}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-10 text-center">
                <p className="text-sm text-gray-500">No roles match those filters.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filtered.map(j => (
                  <div key={j.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{j.title}</h3>
                      <span className="shrink-0 text-[10px] font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">
                        {j.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{j.department} · {j.location}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{j.description}</p>
                    <button onClick={() => openApply(j)} className="inline-flex items-center justify-center min-h-[40px] px-5 py-2 text-xs font-semibold rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{applyingJob.department}</p>
                <h2 className="text-lg font-semibold text-gray-900">{applyingJob.title}</h2>
              </div>
              <button onClick={() => setApplyingJob(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {appState === "sent" ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Application sent</p>
                <p className="text-xs text-gray-500 mb-5">{appMsg}</p>
                <button onClick={() => setApplyingJob(null)} className="text-xs font-semibold px-4 py-2 rounded-full bg-gray-900 text-white">Close</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full name *</label>
                  <input value={appForm.fullName} onChange={e => setAppForm({ ...appForm, fullName: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                  <input type="email" value={appForm.email} onChange={e => setAppForm({ ...appForm, email: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
                  <input type="tel" value={appForm.phone} onChange={e => setAppForm({ ...appForm, phone: e.target.value })} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">A few words about you</label>
                  <textarea value={appForm.coverNote} onChange={e => setAppForm({ ...appForm, coverNote: e.target.value })} rows={3} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30" />
                </div>
                {appState === "error" && <p className="text-xs text-red-600">{appMsg}</p>}
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setApplyingJob(null)} className="flex-1 text-sm font-semibold py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={submitApply} disabled={appState === "sending"} className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 disabled:opacity-50">
                    {appState === "sending" ? "Sending…" : "Submit"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
