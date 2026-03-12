import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyPlans } from '../api';

const IconEvent = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const IconGroup = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusBadge(status) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  switch (status) {
    case 'PENDING': return <span className={`${base} bg-amber-100 text-amber-800`}>Pending</span>;
    case 'CONFIRMED': return <span className={`${base} bg-emerald-100 text-emerald-800`}>Confirmed</span>;
    case 'CANCELLED': return <span className={`${base} bg-slate-100 text-slate-600`}>Cancelled</span>;
    default: return <span className={`${base} bg-slate-100 text-slate-600`}>{status}</span>;
  }
}

export default function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyPlans()
      .then((list) => setPlans(Array.isArray(list) ? list : []))
      .catch((err) => setError(err.message || 'Failed to load plans.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <p className="text-slate-500 animate-pulse">Loading your plans…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-[640px] flex flex-col gap-8">
        <div>
          <h1 className="text-slate-900 text-3xl font-bold tracking-tight">My plans</h1>
          <p className="text-slate-500 mt-1">Plans you’re part of across all your teams.</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {plans.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <div className="w-12 h-12 mx-auto text-slate-300 mb-3 flex items-center justify-center">
                <IconEvent />
              </div>
              <p className="font-medium text-slate-700">No plans yet</p>
              <p className="text-sm mt-1">Create a team and a plan to see them here.</p>
              <div className="mt-4 flex gap-4 justify-center">
                <Link to="/teams/new" className="text-[#5048e5] font-medium hover:underline">Create a team</Link>
                <Link to="/plans/new" className="text-[#5048e5] font-medium hover:underline">Create a plan</Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {plans.map((plan, index) => (
                <li key={plan.id || index}>
                  <Link
                    to={`/plans/${plan.id}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900 truncate">{plan.title}</span>
                        {statusBadge(plan.status)}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        {plan.teamName && (
                          <span className="inline-flex items-center gap-1">
                            <IconGroup />
                            {plan.teamName}
                          </span>
                        )}
                        <span>{formatDate(plan.dateTime)}</span>
                        {plan.memberCount != null && plan.voteCount != null && (
                          <span>{plan.voteCount} of {plan.memberCount} voted</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[#5048e5] font-medium text-sm shrink-0">View →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
