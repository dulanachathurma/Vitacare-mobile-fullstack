import { useState } from 'react';
import api, { getErrorCode } from '../utils/api.js';
import { SYMPTOM_IDS, useI18n } from '../utils/i18nTranslations.js';

export default function DoctorFinder() {
  const { t } = useI18n();
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [errorCode, setErrorCode] = useState('');
  const [loading, setLoading] = useState(false);

  const toggle = (id) =>
    setSelected((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));

  const handleSubmit = async () => {
    setErrorCode('');
    if (selected.length === 0) {
      setErrorCode('NONE_SELECTED');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/health/recommend', { symptoms: selected });
      setResult(data);
    } catch (err) {
      setErrorCode(getErrorCode(err));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
    setErrorCode('');
  };

  const errorText = errorCode === 'NONE_SELECTED' ? t('doctor.selectOne') : t('err.' + errorCode);

  // Results view
  if (result) {
    return (
      <div className="space-y-4 p-4">
        <h2 className="text-lg font-bold text-slate-800">{t('doctor.result')}</h2>

        {result.urgent && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
            🚨 {t('doctor.urgent')}
          </div>
        )}

        <ul className="space-y-3">
          {result.recommendations.map((item, index) => (
            <li key={item.specialty} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  {index === 0 ? '⭐ ' : ''}
                  {t('spec.' + item.specialty)}
                </span>
                <span className="text-xs font-semibold text-teal-600">
                  {item.percent}% {t('doctor.match')}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-teal-500" style={{ width: item.percent + '%' }} />
              </div>
            </li>
          ))}
        </ul>

        <p className="text-xs text-slate-400">{t('doctor.disclaimer')}</p>
        <button onClick={reset} className="w-full rounded-xl border border-teal-600 py-2.5 text-sm font-semibold text-teal-600">
          {t('doctor.reset')}
        </button>
      </div>
    );
  }

  // Questionnaire view
  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800">{t('doctor.title')}</h2>
        <p className="text-xs text-slate-500">{t('doctor.intro')}</p>
      </div>

      <ul className="space-y-2">
        {SYMPTOM_IDS.map((id) => {
          const active = selected.includes(id);
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => toggle(id)}
                className={
                  'flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition ' +
                  (active ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600')
                }
              >
                <span
                  className={
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ' +
                    (active ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300')
                  }
                >
                  {active ? '✓' : ''}
                </span>
                {t('symptom.' + id)}
              </button>
            </li>
          );
        })}
      </ul>

      {errorCode && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{errorText}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {loading ? t('auth.wait') : t('doctor.find')}
      </button>
    </div>
  );
}
