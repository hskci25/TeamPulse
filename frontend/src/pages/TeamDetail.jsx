import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getTeam, getPlansByTeam } from '../api';

export default function TeamDetail() {
  const { teamId } = useParams();
  const location = useLocation();
  const [team, setTeam] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, p] = await Promise.all([getTeam(teamId), getPlansByTeam(teamId)]);
        if (!cancelled) {
          setTeam(t);
          setPlans(p || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load team.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [teamId]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-600">Loading…</p></div>;
  if (error || !team) return <div className="min-h-screen bg-slate-50 p-8"><p className="text-red-600">{error || 'Team not found.'}</p><Link to="/" className="text-indigo-600 mt-4 inline-block">← Home</Link></div>;

  const created = location.state?.created;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {created && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800 text-sm">
            Team created. Welcome emails have been sent to all members.
          </div>
        )}
        <h1 className="text-2xl font-bold text-slate-800">{team.name}</h1>
        {team.city && <p className="text-slate-600">{team.city}</p>}
        <div className="mt-8 flex gap-4">
          <Link
            to={`/plans/new?teamId=${team.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Create a plan
          </Link>
          <Link to="/" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">← Home</Link>
        </div>
        <h2 className="mt-10 text-lg font-semibold text-slate-800">Plans</h2>
        {plans.length === 0 ? (
          <p className="mt-2 text-slate-500">No plans yet. Create one above.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {plans.map((plan) => (
              <li key={plan.id}>
                <Link to={`/plans/${plan.id}`} className="block rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50">
                  <span className="font-medium text-slate-800">{plan.title}</span>
                  <span className="ml-2 text-sm text-slate-500">{plan.status}</span>
                  {plan.voteCount != null && plan.memberCount != null && (
                    <span className="ml-2 text-sm text-slate-500">— {plan.voteCount}/{plan.memberCount} voted</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
