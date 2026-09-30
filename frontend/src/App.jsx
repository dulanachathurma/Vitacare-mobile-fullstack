import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MobileFrame from './components/MobileFrame.jsx';
import Navbar from './components/Navbar.jsx';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Metrics from './pages/Metrics.jsx';
import Profile from './pages/Profile.jsx';
import DoctorFinder from './pages/ConditionFinder.jsx';
import api, { TOKEN_KEY, USER_KEY } from './utils/api.js';
import { useI18n } from './utils/i18nTranslations.js';

// Restores the saved session (if any) from localStorage.
const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw && localStorage.getItem(TOKEN_KEY) ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export default function App() {
  const { t } = useI18n();
  const [user, setUser] = useState(loadStoredUser);

  const saveUser = (nextUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const handleAuth = ({ token, user: authUser }) => {
    localStorage.setItem(TOKEN_KEY, token);
    saveUser(authUser);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  // Refresh the profile from the server when the app opens with a saved token.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    api
      .get('/users/profile')
      .then(({ data }) => saveUser(data.user))
      .catch(() => {});
  }, []);

  const header = (
    <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
      <div>
        <h1 className="text-base font-bold text-teal-700">❤️ {t('app.name')}</h1>
        <p className="text-[11px] text-slate-400">{t('app.tagline')}</p>
      </div>
      <LanguageSwitcher />
    </header>
  );

  const footer = user ? <Navbar onLogout={handleLogout} /> : null;

  // Wrapper for pages that require a logged-in user.
  const Private = ({ children }) => (user ? children : <Navigate to="/login" replace />);

  return (
    <MobileFrame header={header} footer={footer}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onAuth={handleAuth} />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register onAuth={handleAuth} />} />
        <Route path="/" element={<Private><Dashboard user={user} onUserUpdate={saveUser} /></Private>} />
        <Route path="/metrics" element={<Private><Metrics /></Private>} />
        <Route path="/profile" element={<Private><Profile user={user} onUserUpdate={saveUser} /></Private>} />
        <Route path="/doctors" element={<Private><DoctorFinder /></Private>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MobileFrame>
  );
}
