import { useState } from 'react';
import api, { getErrorCode } from '../utils/api.js';
import { useI18n } from '../utils/i18nTranslations.js';

// Crops to a centred square and shrinks the photo so it stays small in the database.
const resizeImage = (file, size = 256) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        canvas
          .getContext('2d')
          .drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

export default function Profile({ user, onUserUpdate }) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: user.name || '',
    age: user.age || '',
    heightCm: user.heightCm || '',
    weightKg: user.weightKg || '',
    avatarUrl: user.avatarUrl || '',
  });
  const [errorCode, setErrorCode] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setSaved(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorCode('INVALID_IMAGE');
      return;
    }
    try {
      const dataUrl = await resizeImage(file);
      setErrorCode('');
      setSaved(false);
      setForm((current) => ({ ...current, avatarUrl: dataUrl }));
    } catch (err) {
      setErrorCode('INVALID_IMAGE');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorCode('');
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      onUserUpdate(data.user);
      setSaved(true);
    } catch (err) {
      setErrorCode(getErrorCode(err));
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500';
  const labelClass = 'mb-1 block text-xs font-semibold text-slate-500';

  return (
    <div className="p-4">
      <div className="mb-5 flex flex-col items-center">
        {form.avatarUrl ? (
          <img src={form.avatarUrl} alt="" className="h-24 w-24 rounded-full border-4 border-white object-cover shadow" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-3xl font-bold text-teal-700">
            {(form.name || '?').charAt(0).toUpperCase()}
          </div>
        )}
        <h2 className="mt-3 text-lg font-bold text-slate-800">{t('profile.title')}</h2>
        <p className="text-xs text-slate-400">{user.email}</p>

        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer rounded-full bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-700">
            {t('profile.choosePhoto')}
            <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </label>
          {form.avatarUrl && (
            <button
              type="button"
              onClick={() => {
                setSaved(false);
                setForm({ ...form, avatarUrl: '' });
              }}
              className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              {t('profile.removePhoto')}
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={labelClass}>{t('auth.name')}</label>
          <input name="name" required value={form.name} onChange={handleChange} className={inputClass} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>{t('profile.age')}</label>
            <input type="number" name="age" min="1" max="120" value={form.age} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('profile.height')}</label>
            <input type="number" step="0.1" name="heightCm" value={form.heightCm} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('profile.weight')}</label>
            <input type="number" step="0.1" name="weightKg" value={form.weightKg} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {errorCode && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{t('err.' + errorCode)}</p>}
        {saved && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-600">{t('profile.saved')}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {saving ? t('auth.wait') : t('profile.save')}
        </button>
      </form>
    </div>
  );
}
