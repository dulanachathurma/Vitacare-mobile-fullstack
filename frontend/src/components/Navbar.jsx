import { NavLink } from 'react-router-dom';
import { useI18n } from '../utils/i18nTranslations.js';

const items = [
  { to: '/', icon: '🏠', key: 'nav.home' },
  { to: '/metrics', icon: '📈', key: 'nav.metrics' },
  { to: '/doctors', icon: '🩺', key: 'nav.doctors' },
  { to: '/profile', icon: '👤', key: 'nav.profile' },
];

const base = 'flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[11px] transition';

/** Bottom tab bar: teal gradient background, white text/icons, active tab = white pill. */
export default function Navbar({ onLogout }) {
  const { t } = useI18n();

  return (
    <nav className="flex shrink-0 gap-1 border-t border-teal-800/30 bg-gradient-to-r from-teal-600 to-emerald-600 px-2 pb-2 pt-1.5 shadow-lg">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            base + (isActive ? ' bg-white font-bold text-teal-700 shadow-md' : ' font-medium text-white hover:bg-white/20')
          }
        >
          <span className="text-xl leading-none">{item.icon}</span>
          <span>{t(item.key)}</span>
        </NavLink>
      ))}
      <button
        type="button"
        onClick={onLogout}
        className={base + ' font-medium text-white hover:bg-rose-500'}
      >
        <span className="text-xl leading-none">🚪</span>
        <span>{t('nav.logout')}</span>
      </button>
    </nav>
  );
}
