import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { createPlan, getTeams } from '../api';
import { useAuth } from '../context/AuthContext';

const IconArrowBack = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
  </svg>
);
const IconAdd = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconDelete = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#5048e5] focus:ring-2 focus:ring-[#5048e5]/20 transition-all outline-none';
const selectClass =
  'appearance-none w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#5048e5] focus:ring-2 focus:ring-[#5048e5]/20 transition-all outline-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat';
const CATEGORIES = ['Food', 'Activity', 'Workshop', 'Other'];

export default function CreatePlan() {
  const navigate = useNavigate();
  const { email } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedTeamId = searchParams.get('teamId');

  const memberEmail = email || '';
  const [teamId, setTeamId] = useState(preselectedTeamId || '');
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [options, setOptions] = useState([{ name: '', category: 'Food' }, { name: '', category: 'Food' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setTeamsLoading(true);
    getTeams()
      .then((list) => { if (!cancelled) setTeams(list || []); })
      .catch(() => { if (!cancelled) setTeams([]); })
      .finally(() => { if (!cancelled) setTeamsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (preselectedTeamId && teams.some((t) => t.id === preselectedTeamId)) setTeamId(preselectedTeamId);
  }, [preselectedTeamId, teams]);

  const addOption = () => setOptions((o) => [...o, { name: '', category: 'Food' }]);
  const removeOption = (i) => setOptions((o) => o.filter((_, j) => j !== i));
  const updateOption = (i, field, value) => setOptions((o) => o.map((opt, j) => (j === i ? { ...opt, [field]: value } : opt)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!teamId.trim()) {
      setError('Please select a team.');
      return;
    }
    if (!title.trim()) {
      setError('Plan title is required.');
      return;
    }
    const opts = options.filter((o) => o.name.trim());
    if (opts.length < 2) {
      setError('Add at least two options.');
      return;
    }
    const date = dateTime ? new Date(dateTime) : new Date();
    const deadlineDate = deadline ? new Date(deadline) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    setLoading(true);
    try {
      const plan = await createPlan({
        teamId: teamId.trim(),
        title: title.trim(),
        dateTime: date.toISOString(),
        deadline: deadlineDate.toISOString(),
        createdBy: email || undefined,
        options: opts.map((o) => ({ name: o.name.trim(), category: (o.category || 'OTHER').toUpperCase().replace(/\s+/g, '_') })),
      });
      navigate(`/plans/${plan.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create plan.');
    } finally {
      setLoading(false);
    }
  };

  const defaultDeadline = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(18, 0, 0, 0);
    if (!deadline) setDeadline(d.toISOString().slice(0, 16));
  };

  return (
    <main className="flex-1 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-[640px] flex flex-col gap-8">
        {/* Back link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[#5048e5] font-medium hover:underline text-sm transition-colors"
          >
            <IconArrowBack />
            Back home
          </Link>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 text-3xl font-bold tracking-tight">Create a new plan</h1>
          <p className="text-slate-500">Set up a new activity or event for your team to vote on.</p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          {/* Your email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="memberEmail" className="text-sm font-semibold text-slate-700">
              Your account
            </label>
            <input
              id="memberEmail"
              type="email"
              required
              value={memberEmail}
              readOnly
              className={inputClass + ' bg-slate-50'}
              placeholder="alex@company.com"
            />
            <p className="text-xs text-slate-500">We only show teams you’re a member of.</p>
          </div>

          {/* Team */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="teamId" className="text-sm font-semibold text-slate-700">
              Team <span className="text-[#5048e5]">*</span>
            </label>
            <select
              id="teamId"
              required
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className={selectClass}
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235048e5'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e")` }}
              disabled={teamsLoading}
            >
              <option value="">
                {teamsLoading ? 'Loading…' : 'Select a team'}
              </option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}{t.city ? ` (${t.city})` : ''}</option>
              ))}
            </select>
            {teams.length === 0 && !teamsLoading && (
              <p className="text-xs text-slate-500">
                You’re not in any teams yet. <Link to="/teams/new" className="text-[#5048e5] hover:underline">Create a team</Link> first.
              </p>
            )}
          </div>

          {/* Plan title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-semibold text-slate-700">
              Plan title <span className="text-[#5048e5]">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. Friday Lunch"
            />
          </div>

          {/* Date & time row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dateTime" className="text-sm font-semibold text-slate-700">
                Activity date & time (Optional)
              </label>
              <input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="deadline" className="text-sm font-semibold text-slate-700">
                Voting deadline <span className="text-[#5048e5]">*</span>
              </label>
              <input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onFocus={defaultDeadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
            <label className="text-base font-bold text-slate-900">Options</label>
            {options.map((opt, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="flex-1 w-full md:min-w-0">
                  <input
                    type="text"
                    value={opt.name}
                    onChange={(e) => updateOption(i, 'name', e.target.value)}
                    className={inputClass}
                    placeholder="Option name"
                  />
                </div>
                <div className="w-full md:w-1/3 md:min-w-[120px]">
                  <select
                    value={opt.category}
                    onChange={(e) => updateOption(i, 'category', e.target.value)}
                    className={selectClass}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235048e5'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e")` }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 shrink-0"
                  aria-label="Remove option"
                >
                  <IconDelete />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-2 text-[#5048e5] font-semibold text-sm hover:bg-[#5048e5]/5 w-fit px-4 py-2 rounded-lg transition-colors"
            >
              <IconAdd />
              Add option
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
          )}

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5048e5] hover:bg-[#4338ca] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-[#5048e5]/20 transition-all active:scale-[0.98]"
            >
              {loading ? 'Creating…' : 'Create plan'}
            </button>
          </div>
        </form>

        {/* Footer help */}
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-slate-500 text-sm">
            Plans are shared with all members of the selected team.<br />
            Participants will receive an email notification.
          </p>
        </div>
      </div>
    </main>
  );
}
