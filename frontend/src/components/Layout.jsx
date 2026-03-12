import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconBolt = () => (
  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { isAuthenticated, email, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f8]">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-2 text-[#5048e5] hover:opacity-90 transition-opacity">
              <IconBolt />
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">TeamPulse</span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/teams/new"
                    className="text-sm font-semibold text-slate-600 hover:text-[#5048e5] transition-colors hidden sm:block"
                  >
                    New team
                  </Link>
                  <Link
                    to="/plans/new"
                    className="text-sm font-semibold text-slate-600 hover:text-[#5048e5] transition-colors hidden sm:block"
                  >
                    New plan
                  </Link>
                  <Link
                    to="/plans/my-plans"
                    className="text-sm font-semibold text-slate-600 hover:text-[#5048e5] transition-colors hidden sm:block"
                  >
                    My plans
                  </Link>
                  <span className="text-sm text-slate-500 truncate max-w-[140px] hidden md:block" title={email}>
                    {email}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-sm font-semibold text-slate-600 hover:text-[#5048e5] transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-600 hover:text-[#5048e5] transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#5048e5] hover:bg-[#4338ca] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className={isHome ? 'flex-1' : 'flex-1 py-8 sm:py-10 px-4 sm:px-6'}>
        {children}
      </main>
    </div>
  );
}
