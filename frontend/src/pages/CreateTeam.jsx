import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTeam } from '../api';

const IconLocation = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconArrowForward = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);
const IconArrowBack = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
  </svg>
);

const inputClass =
  'block w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-[#5048e5] focus:ring-2 focus:ring-[#5048e5]/20 transition-all outline-none';
const labelClass = 'text-slate-900 text-sm font-semibold uppercase tracking-wider';

export default function CreateTeam() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [emailsText, setEmailsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const memberEmails = emailsText
      .split(/[\n,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (!name.trim()) {
      setError('Team name is required.');
      return;
    }
    if (memberEmails.length === 0) {
      setError('Add at least one member email.');
      return;
    }
    setLoading(true);
    try {
      const team = await createTeam({
        name: name.trim(),
        city: city.trim() || undefined,
        memberEmails,
      });
      navigate(`/teams/${team.id}`, { state: { created: true } });
    } catch (err) {
      setError(err.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-[640px] bg-white p-8 md:p-12 rounded-xl shadow-sm border border-slate-200">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-slate-900 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-2">
            Create your team
          </h1>
          <p className="text-slate-500 text-lg">Set up your team and start collaborating.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className={labelClass}>
              Team name <span className="text-[#5048e5]">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Design Team"
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="city" className={labelClass}>City</label>
              <span className="text-slate-400 text-xs font-medium uppercase italic">Optional</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconLocation />
              </span>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`${inputClass} pl-11`}
                placeholder="e.g. Mumbai"
              />
            </div>
          </div>

          {/* Member Emails */}
          <div className="flex flex-col gap-2">
            <label htmlFor="emails" className={labelClass}>
              Member emails <span className="text-[#5048e5]">*</span>
            </label>
            <textarea
              id="emails"
              rows={4}
              required
              value={emailsText}
              onChange={(e) => setEmailsText(e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="One per line or comma-separated"
            />
            <p className="text-slate-400 text-xs mt-1 italic">Invite your colleagues to join the workspace. You’ll be set as the organiser.</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5048e5] hover:bg-[#4338ca] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-[#5048e5]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating…' : 'Create team'}</span>
              {!loading && <IconArrowForward />}
            </button>
          </div>
        </form>

        {/* Back home */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
          <Link
            to="/"
            className="text-slate-500 hover:text-[#5048e5] flex items-center gap-2 font-medium transition-colors"
          >
            <IconArrowBack />
            Back home
          </Link>
        </div>
      </div>

      <p className="py-10 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} TeamPulse. Powering high-performance teams.
      </p>
    </main>
  );
}
