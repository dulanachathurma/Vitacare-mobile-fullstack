import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '../utils/i18nTranslations.js';
import { CONDITIONS, SPECIALTIES } from '../utils/doctorData.js';

/** Find a doctor: pick an illness / problem, get the right specialist + a nearby-map search. */
export default function ConditionFinder() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const spec = params.get('spec') || 'all';
  const chooseSpec = (id) => {
    setSelected(null);
    setParams(id === 'all' ? {} : { spec: id });
  };

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CONDITIONS.filter(
      (c) =>
        (spec === 'all' || c.specialty === spec) &&
        (!needle || t('fd.c.' + c.id).toLowerCase().includes(needle))
    );
  }, [query, spec, t]);

  const activeSpecId = selected ? selected.specialty : spec !== 'all' ? spec : null;
  const activeSpec = SPECIALTIES.find((s) => s.id === activeSpecId);
  const mapUrl = activeSpec
    ? 'https://www.google.com/maps/search/' + encodeURIComponent(activeSpec.query + ' near me')
    : '';

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-bold text-slate-800">{t('fd.title')}</h2>
        <p className="text-xs text-slate-500">{t('fd.intro')}</p>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('fd.search')}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      {/* Specialist filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[{ id: 'all', icon: '✨' }, ...SPECIALTIES].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => chooseSpec(s.id)}
            className={
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ' +
              (spec === s.id ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-200 bg-white text-slate-600')
            }
          >
            {s.icon} {s.id === 'all' ? t('fd.all') : t('fd.s.' + s.id)}
          </button>
        ))}
      </div>

      {/* Suggested doctor */}
      {activeSpec ? (
        <section
          className={
            'rounded-2xl border p-4 ' +
            (selected && selected.urgent ? 'border-rose-200 bg-rose-50' : 'border-teal-200 bg-teal-50')
          }
        >
          {selected && <p className="text-xs font-semibold text-slate-500">{selected.icon} {t('fd.c.' + selected.id)}</p>}
          {selected && selected.urgent && <p className="my-1 text-sm font-bold text-rose-700">🚨 {t('fd.urgent')}</p>}
          <p className="mt-1 text-xs font-semibold text-slate-500">{t('fd.specialist')}</p>
          <p className="text-base font-bold text-slate-800">
            {activeSpec.icon} {t('fd.s.' + activeSpec.id)}
          </p>
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block rounded-full bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
          >
            📍 {t('fd.findNearby')}
          </a>
        </section>
      ) : (
        <p className="text-xs text-slate-400">{t('fd.pick')}</p>
      )}

      {/* Illness list */}
      {list.length === 0 ? (
        <p className="text-sm text-slate-500">{t('fd.noResults')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {list.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c)}
              className={
                'flex items-center gap-2 rounded-2xl border p-3 text-left text-xs font-semibold shadow-sm transition ' +
                (selected && selected.id === c.id
                  ? 'border-teal-600 bg-teal-50 text-teal-800'
                  : 'border-slate-100 bg-white text-slate-700 hover:border-teal-300')
              }
            >
              <span className="text-xl">{c.icon}</span>
              <span>{t('fd.c.' + c.id)}</span>
            </button>
          ))}
        </div>
      )}

      <p className="pb-2 text-[11px] text-slate-400">{t('fd.disclaimer')}</p>
    </div>
  );
}
