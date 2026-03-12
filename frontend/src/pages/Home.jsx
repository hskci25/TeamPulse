import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconBolt = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const IconGroupAdd = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);
const IconEvent = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const IconShield = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconArrow = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-12 sm:pt-20 pb-16 sm:pb-32">
        <div className="max-w-[768px] w-full text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              No more &ldquo;what are we doing Friday?&rdquo;
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Set up your team once, vote anonymously on options, and get a confirmed plan automatically. No signup needed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              to="/teams/new"
              className="w-full sm:w-auto min-w-[200px] h-14 bg-[#5048e5] hover:bg-[#4338ca] text-white rounded-xl text-lg font-bold shadow-lg shadow-[#5048e5]/20 transition-all flex items-center justify-center gap-2"
            >
              <IconGroupAdd />
              Create a team
            </Link>
            <Link
              to="/plans/new"
              className="w-full sm:w-auto min-w-[200px] h-14 border-2 border-slate-200 hover:border-[#5048e5] text-slate-900 rounded-xl text-lg font-bold transition-all bg-white flex items-center justify-center gap-2"
            >
              <IconEvent />
              Create a plan
            </Link>
          </div>

          <p className="text-sm text-slate-500 font-medium">
            Vote via the link in your email — <span className="text-[#5048e5]">no signup needed.</span>
            {isAuthenticated && (
              <>
                {' '}
                <Link to="/plans/my-plans" className="text-[#5048e5] hover:underline font-semibold">My plans</Link>
              </>
            )}
          </p>

          {/* Feature card */}
          <div className="mt-16 w-full group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row text-left">
              <div className="md:w-1/2 h-56 sm:h-64 md:h-80 relative overflow-hidden bg-gradient-to-br from-[#5048e5]/20 to-[#5048e5]/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-white/80 shadow-lg flex items-center justify-center">
                    <IconBolt />
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#5048e5]/10 text-[#5048e5]">
                  <IconShield />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Trustworthy & Minimal</h3>
                <p className="text-slate-600 leading-relaxed">
                  Experience the easiest way to coordinate with your team. No accounts, no password fatigue, just friction-free planning.
                </p>
                <Link
                  to="/teams/new"
                  className="text-[#5048e5] font-bold inline-flex items-center gap-1 hover:gap-2 transition-all w-fit"
                >
                  Learn more about our process
                  <IconArrow />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-12">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">10k+</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Teams Active</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">0</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Logins Required</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Anonymous</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">2min</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Setup Time</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[#5048e5]"><IconBolt /></span>
            <span className="font-bold tracking-tight text-slate-600">TeamPulse</span>
          </div>
          <div className="flex gap-6 sm:gap-8">
            <a href="#" className="text-sm text-slate-500 hover:text-[#5048e5] transition-colors">Privacy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-[#5048e5] transition-colors">Terms</a>
            <a href="#" className="text-sm text-slate-500 hover:text-[#5048e5] transition-colors">Support</a>
          </div>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} TeamPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
