import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorCode } from '../utils/api.js';
import { useI18n } from '../utils/i18nTranslations.js';
import MetricChart from '../components/MetricChart.jsx';

// One entry per tracked metric. Names come from the translation files.
const TYPES = [
  { id: 'bloodSugar', icon: '🩸', unit: 'mg/dL', range: '70–99', specialty: 'endocrinologist' },
  { id: 'cholesterol', icon: '🧪', unit: 'mg/dL', range: '< 200', specialty: 'cardiologist' },
  { id: 'bloodPressure', icon: '🩺', unit: 'mmHg', range: '90/60 – 119/79', specialty: 'cardiologist' },
  { id: 'heartRate', icon: '💓', unit: 'bpm', range: '60–100', specialty: 'cardiologist' },
  { id: 'oxygen', icon: '🫁', unit: '%', range: '≥ 95', specialty: 'pulmonologist' },
  { id: 'temperature', icon: '🌡️', unit: '°C', range: '35.5–37.5', specialty: 'generalPhysician' },
];

const STATUS_STYLES = {
  low: 'bg-sky-50 text-sky-600',
  normal: 'bg-emerald-50 text-emerald-600',
  elevated: 'bg-amber-50 text-amber-600',
  high: 'bg-rose-50 text-rose-600',
};

const show = (m) => (m.value2 ? m.value + '/' + m.value2 : m.value);

export default function Metrics() {
  const { t } = useI18n();
  const [type, setType] = useState('bloodSugar');
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ value: '', value2: '', note: '' });
  const [errorCode, setErrorCode] = useState('');
  const [result, setResult] = useState(null);

  const loadMetrics = useCallback(async () => {
    try {
      const { data } = await api.get('/metrics');
      setAll(data.metrics);
    } catch (err) {
      setErrorCode(getErrorCode(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const current = TYPES.find((item) => item.id === type);
  const isBp = type === 'bloodPressure';
  const metrics = all.filter((m) => m.type === type);
  const latest = metrics[metrics.length - 1];

  const selectType = (id) => {
    setType(id);
    setForm({ value: '', value2: '', note: '' });
    setErrorCode('');
    setResult(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorCode('');
    setResult(null);
    try {
      const { data } = await api.post('/metrics', { type, ...form });
      setResult(data);
      setForm({ value: '', value2: '', note: '' });
      await loadMetrics();
    } catch (err) {
      setErrorCode(getErrorCode(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete('/metrics/' + id);
      setAll((list) => list.filter((m) => m._id !== id));
    } catch (err) {
      setErrorCode(getErrorCode(err));
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500';

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800">{t('metrics.title')}</h2>
        <p className="text-xs text-slate-500">{t('metrics.intro')}</p>
      </div>

      {/* Metric selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TYPES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectType(item.id)}
            className={
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ' +
              (type === item.id ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-200 bg-white text-slate-600')
            }
          >
            {item.icon} {t('cond.' + item.id)}
          </button>
        ))}
      </div>

      {/* Latest reading */}
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t('metric.' + type)}</p>
        {loading ? (
          <p className="mt-2 text-sm text-slate-400">{t('common.loading')}</p>
        ) : latest ? (
          <div className="mt-1 flex items-end justify-between">
            <div>
              <span className="text-3xl font-extrabold text-slate-800">{show(latest)}</span>
              <span className="ml-1 text-sm text-slate-400">{current.unit}</span>
            </div>
            <span className={'rounded-full px-3 py-1 text-xs font-semibold ' + STATUS_STYLES[latest.status]}>
              {t('status.' + latest.status)}
            </span>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">{t('metrics.none')}</p>
        )}
        <p className="mt-2 text-[11px] text-slate-400">
          {t('metrics.normalRange')}: {current.range} {current.unit}
        </p>
      </section>

      {/* Doctor suggestion: only shown when the latest reading is outside the normal range */}
      {latest && latest.status !== 'normal' && (
        <section
          className={
            'rounded-2xl border p-4 ' +
            (latest.urgent || latest.status === 'high' ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50')
          }
        >
          {latest.urgent && <p className="mb-2 text-sm font-bold text-rose-700">🚨 {t('metrics.urgent')}</p>}
          <p className="text-xs font-semibold text-slate-500">{t('metrics.seeSpecialist')}</p>
          <p className="text-base font-bold text-slate-800">🩺 {t('spec.' + current.specialty)}</p>
          <p className="mt-1 text-xs text-slate-600">{t('metrics.advice.' + latest.status)}</p>
          <Link
            to={'/doctors?spec=' + current.specialty}
            className="mt-3 inline-block rounded-full bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
          >
            {t('metrics.findDoctor')}
          </Link>
        </section>
      )}

      {/* Trend */}
      {metrics.length > 0 && (
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">{t('metrics.trend')}</h3>
          <MetricChart type={type} metrics={metrics} />
        </section>
      )}

      {/* Add reading */}
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <form onSubmit={handleAdd} className="space-y-3">
          <div className={isBp ? 'grid grid-cols-2 gap-3' : ''}>
            <input
              type="number"
              step="0.1"
              name="value"
              required
              value={form.value}
              onChange={handleChange}
              placeholder={isBp ? t('metrics.systolic') : t('metrics.value') + ' (' + current.unit + ')'}
              className={inputClass}
            />
            {isBp && (
              <input
                type="number"
                step="1"
                name="value2"
                required
                value={form.value2}
                onChange={handleChange}
                placeholder={t('metrics.diastolic')}
                className={inputClass}
              />
            )}
          </div>
          <input name="note" maxLength={200} value={form.note} onChange={handleChange} placeholder={t('metrics.note')} className={inputClass} />

          {errorCode && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{t('err.' + errorCode)}</p>}

          {result && (
            <p className={'rounded-lg px-3 py-2 text-xs font-semibold ' + STATUS_STYLES[result.metric.status]}>
              {show(result.metric)} {current.unit} — {t('status.' + result.metric.status)}
            </p>
          )}

          <button type="submit" className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
            {t('metrics.add')}
          </button>
        </form>
      </section>

      {/* History */}
      {metrics.length > 0 && (
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">{t('metrics.history')}</h3>
          <ul className="divide-y divide-slate-100">
            {[...metrics].reverse().slice(0, 6).map((m) => (
              <li key={m._id} className="flex items-center justify-between py-2 text-xs text-slate-600">
                <span>{new Date(m.measuredAt).toLocaleDateString()}</span>
                <span className="font-semibold">
                  {show(m)} {current.unit}
                </span>
                <span className={'rounded-full px-2 py-0.5 text-[10px] font-semibold ' + STATUS_STYLES[m.status]}>
                  {t('status.' + m.status)}
                </span>
                <button onClick={() => handleDelete(m._id)} className="text-rose-500 hover:underline">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="pb-2 text-[11px] text-slate-400">{t('metrics.disclaimer')}</p>
    </div>
  );
}
