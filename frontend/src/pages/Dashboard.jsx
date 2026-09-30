import { useCallback, useEffect, useState } from 'react';
import api, { getErrorCode } from '../utils/api.js';
import { useI18n } from '../utils/i18nTranslations.js';
import BmiChart from '../components/BmiChart.jsx';

const CATEGORY_STYLES = {
  underweight: 'bg-sky-50 text-sky-600',
  normal: 'bg-emerald-50 text-emerald-600',
  overweight: 'bg-amber-50 text-amber-600',
  obese: 'bg-rose-50 text-rose-600',
};

// BMI scale from 15 to 40, split by WHO category boundaries.
const SCALE = [
  { key: 'underweight', width: '14%', color: 'bg-sky-400' },
  { key: 'normal', width: '26%', color: 'bg-emerald-400' },
  { key: 'overweight', width: '20%', color: 'bg-amber-400' },
  { key: 'obese', width: '40%', color: 'bg-rose-400' },
];

export default function Dashboard({ user, onUserUpdate }) {
  const { t } = useI18n();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState('');
  const [form, setForm] = useState({ weightKg: user.weightKg || '', heightCm: user.heightCm || '' });

  const loadLogs = useCallback(async () => {
    try {
      const { data } = await api.get('/health/logs');
      setLogs(data.logs);
    } catch (err) {
      setErrorCode(getErrorCode(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorCode('');
    try {
      const { data } = await api.post('/health/logs', form);
      onUserUpdate(data.user);
      await loadLogs();
    } catch (err) {
      setErrorCode(getErrorCode(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete('/health/logs/' + id);
      setLogs((current) => current.filter((log) => log._id !== id));
    } catch (err) {
      setErrorCode(getErrorCode(err));
    }
  };

  const latest = logs[logs.length - 1];
  const markerPosition = latest ? Math.min(100, Math.max(0, ((latest.bmi - 15) / 25) * 100)) : 0;
  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500';

  return (
    <div className="space-y-4 p-4">
      {/* Greeting */}
      <div className="flex items-center gap-3">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h2 className="text-lg font-bold text-slate-800">
          {t('dashboard.greeting')}, {user.name.split(' ')[0]}!
        </h2>
      </div>

      {/* BMI card */}
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t('dashboard.yourBmi')}</p>
        {loading ? (
          <p className="mt-2 text-sm text-slate-400">{t('common.loading')}</p>
        ) : latest ? (
          <>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-4xl font-extrabold text-slate-800">{latest.bmi}</span>
              <span className={'rounded-full px-3 py-1 text-xs font-semibold ' + CATEGORY_STYLES[latest.category]}>
                {t('bmi.' + latest.category)}
              </span>
            </div>
            <div className="relative mt-4">
              <div className="flex h-2 overflow-hidden rounded-full">
                {SCALE.map((segment) => (
                  <div key={segment.key} style={{ width: segment.width }} className={segment.color} />
                ))}
              </div>
              <div
                className="absolute -top-1 h-4 w-1 rounded bg-slate-800"
                style={{ left: markerPosition + '%' }}
              />
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-500">{t('dashboard.noData')}</p>
        )}
      </section>

      {/* Trend chart */}
      {logs.length > 0 && (
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">{t('dashboard.trend')}</h3>
          <BmiChart logs={logs} />
        </section>
      )}

      {/* Add entry */}
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">{t('dashboard.addEntry')}</h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="number" step="0.1" name="weightKg" required value={form.weightKg} onChange={handleChange} placeholder={t('dashboard.weight')} className={inputClass} />
            <input type="number" step="0.1" name="heightCm" required value={form.heightCm} onChange={handleChange} placeholder={t('dashboard.height')} className={inputClass} />
          </div>
          {errorCode && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{t('err.' + errorCode)}</p>}
          <button type="submit" className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
            {t('dashboard.add')}
          </button>
        </form>
      </section>

      {/* History */}
      {logs.length > 0 && (
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">{t('dashboard.history')}</h3>
          <ul className="divide-y divide-slate-100">
            {[...logs].reverse().slice(0, 5).map((log) => (
              <li key={log._id} className="flex items-center justify-between py-2 text-xs text-slate-600">
                <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                <span>
                  {log.weightKg} kg · BMI {log.bmi}
                </span>
                <button onClick={() => handleDelete(log._id)} className="text-rose-500 hover:underline">
                  {t('dashboard.delete')}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
