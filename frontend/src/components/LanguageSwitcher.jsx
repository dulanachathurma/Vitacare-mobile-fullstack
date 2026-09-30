import { LANGUAGES, useI18n } from '../utils/i18nTranslations.js';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs">
      {LANGUAGES.map((item) => (
        <button
          key={item.code}
          type="button"
          title={item.name}
          onClick={() => setLang(item.code)}
          className={
            'px-2.5 py-1 font-semibold transition ' +
            (lang === item.code ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-200')
          }
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
