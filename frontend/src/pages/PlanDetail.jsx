import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPlan, getVoteCount } from '../api';

const IconArrowBack = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
  </svg>
);
const IconGroup = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const IconEvent = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconInfo = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconOption = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString();
}

export default function PlanDetail() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [voteCount, setVoteCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [p, v] = await Promise.all([getPlan(planId), getVoteCount(planId).catch(() => ({ count: 0 }))]);
      setPlan(p);
      setVoteCount(v?.count ?? p?.voteCount);
    } catch (err) {
      setError(err.message || 'Failed to load plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    load();
    const t = setInterval(() => { if (!cancelled) load(); }, 15000);
    return () => { cancelled = true; clearInterval(t); };
  }, [planId]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <p className="text-slate-500 animate-pulse">Loading…</p>
      </main>
    );
  }

  if (error || !plan) {
    return (
      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-[768px] mx-auto">
          <p className="text-red-600 font-medium">{error || 'Plan not found.'}</p>
          <Link to="/" className="inline-flex items-center gap-2 text-[#5048e5] hover:underline font-medium text-sm mt-4">
            <IconArrowBack />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const count = voteCount ?? plan.voteCount ?? 0;
  const total = plan.memberCount ?? 0;
  const isPending = plan.status === 'PENDING';
  const deadlineStr = plan.deadline
    ? new Date(plan.deadline).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : '';

  const statusBadge = () => {
    if (plan.status === 'CONFIRMED') {
      return (
        <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold tracking-wider uppercase">
          Confirmed
        </span>
      );
    }
    if (plan.status === 'CANCELLED') {
      return (
        <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wider uppercase">
          Cancelled
        </span>
      );
    }
    return (
      <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold tracking-wider uppercase">
        Pending
      </span>
    );
  };

  return (
    <main className="flex-1 py-12 px-4 sm:px-6">
      <div className="max-w-[768px] mx-auto">
        {/* Back link */}
        <nav className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#5048e5] hover:underline font-medium text-sm transition-all"
          >
            <IconArrowBack />
            Back to Home
          </Link>
        </nav>

        {/* Plan header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{plan.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              {total > 0 && (
                <div className="flex items-center gap-1">
                  <IconGroup />
                  {count} of {total} members have voted
                </div>
              )}
              {deadlineStr && (
                <div className="flex items-center gap-1">
                  <IconEvent />
                  Deadline: {deadlineStr}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center">{statusBadge()}</div>
        </div>

        {/* Options */}
        {plan.options?.length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Options</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {plan.options.map((opt) => {
                const isWinner = plan.winnerOptionId === opt.id;
                const votes = opt.voteCount ?? 0;
                return (
                  <div
                    key={opt.id}
                    className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${
                          isWinner ? 'bg-[#5048e5]/10 text-[#5048e5]' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <IconOption />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{opt.name}</p>
                        <p className="text-xs text-slate-500">{opt.category || 'Option'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isWinner && (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">
                          Winner
                        </span>
                      )}
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          isWinner ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {votes} vote{votes !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Info note */}
        {isPending && (
          <div className="p-6 bg-[#5048e5]/5 border border-[#5048e5]/10 rounded-xl flex gap-4">
            <span className="text-[#5048e5]"><IconInfo /></span>
            <p className="text-sm leading-relaxed text-slate-600">
              Members vote via their email link. Results and calendar invite are sent automatically when the deadline
              passes{deadlineStr ? ` (${deadlineStr})` : ''}. Plan confirms if 70%+ vote.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          {plan.createdBy && (
            <p className="text-xs text-slate-400">
              Created by {plan.createdBy}
              {plan.createdAt && ` • ${formatRelativeTime(plan.createdAt)}`}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
