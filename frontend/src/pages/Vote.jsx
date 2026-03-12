import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getPlanForVote, castVote, getVoteCount } from '../api';

const IconVisibilityOff = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);
const IconSchedule = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconOption = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function Vote() {
  const { planId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [plan, setPlan] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [voteCount, setVoteCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Missing vote link. Use the link from your email.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const p = await getPlanForVote(planId, token);
        if (!cancelled) setPlan(p);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Invalid or expired link.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [planId, token]);

  const refreshCount = async () => {
    try {
      const { count } = await getVoteCount(planId);
      setVoteCount(count);
    } catch (_) {}
  };

  useEffect(() => {
    if (!planId) return;
    refreshCount();
    const t = setInterval(refreshCount, 10000);
    return () => clearInterval(t);
  }, [planId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId || !token) return;
    setError('');
    setSubmitting(true);
    try {
      await castVote(planId, token, selectedId);
      setSuccess(true);
      refreshCount();
    } catch (err) {
      setError(err.message || 'Failed to submit vote.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <p className="text-slate-500 animate-pulse">Loading…</p>
      </main>
    );
  }

  if (error && !plan) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-sm text-slate-500 mt-2">Use the unique link sent to your email.</p>
        </div>
      </main>
    );
  }

  const isPending = plan?.status === 'PENDING';
  const deadlineStr = plan?.deadline ? new Date(plan.deadline).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';
  const total = plan?.memberCount ?? 0;
  const count = voteCount ?? plan?.voteCount ?? 0;
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-[640px] space-y-8">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{plan?.title}</h1>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-200/50 rounded-full text-sm font-medium text-slate-600">
            <IconVisibilityOff />
            Anonymous Voting
          </div>
        </div>

        {/* Participation card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Current Progress</p>
              <p className="text-lg font-medium text-slate-900">
                {total ? `${count} of ${total} members have voted` : 'Loading…'}
              </p>
            </div>
            {total > 0 && <p className="text-2xl font-bold text-[#5048e5]">{pct}%</p>}
          </div>
          {total > 0 && (
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5048e5] rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
          {deadlineStr && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <IconSchedule />
              Vote by: {deadlineStr}
            </div>
          )}
        </div>

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-sm font-medium text-center">
            Your vote was recorded. You can change it until the deadline.
          </div>
        )}

        {isPending ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">Select one option</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <ul className="space-y-3">
                {(plan?.options || []).map((opt) => (
                  <li key={opt.id}>
                    <label className="group relative flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl cursor-pointer hover:border-[#5048e5]/50 transition-all has-[:checked]:border-[#5048e5] has-[:checked]:bg-[#5048e5]/5">
                      <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center">
                          <input
                            className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-full checked:border-[#5048e5] transition-all cursor-pointer"
                            name="vote-option"
                            type="radio"
                            value={opt.id}
                            checked={selectedId === opt.id}
                            onChange={() => setSelectedId(opt.id)}
                          />
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-3 h-3 bg-[#5048e5] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold text-slate-900 group-hover:text-[#5048e5] transition-colors">
                            {opt.name}
                          </span>
                          {opt.category && (
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                              Category: {opt.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg group-hover:bg-[#5048e5]/10 transition-colors text-slate-500 group-hover:text-[#5048e5]">
                        <IconOption />
                      </div>
                    </label>
                  </li>
                ))}
              </ul>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
              )}

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={!selectedId || submitting}
                  className="w-full py-4 px-6 bg-[#5048e5] hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl shadow-lg shadow-[#5048e5]/25 transition-all active:scale-[0.98]"
                >
                  {submitting ? 'Submitting…' : 'Submit vote'}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  You can change your vote until the deadline.
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-3">
            <p className="text-slate-600 font-medium">
              {plan?.status === 'CONFIRMED'
                ? 'This plan is confirmed. Check your email for the result and calendar invite.'
                : 'Voting has ended for this plan.'}
            </p>
            {plan?.options?.length && plan.winnerOptionId && (
              <p className="text-lg font-bold text-slate-900">
                Winner: {plan.options.find((o) => o.id === plan.winnerOptionId)?.name ?? plan.winnerOptionId}
              </p>
            )}
          </div>
        )}
      </div>

      <footer className="py-8 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} TeamPulse. Privacy-first decision making.
      </footer>
    </main>
  );
}
