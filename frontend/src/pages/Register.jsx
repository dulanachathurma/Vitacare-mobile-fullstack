import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorCode } from '../utils/api.js';
import { useI18n } from '../utils/i18nTranslations.js';

export default function Register({ onAuth }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errorCode, setErrorCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorCode('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      onAuth(data);
      navigate('/profile');
    } catch (err) {
      setErrorCode(getErrorCode(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500';

  return (
    <div className="p-6">
      <div className="mb-6 mt-4 text-center">
        <div className="text-5xl">🩺</div>
        <h2 className="mt-3 text-xl font-bold text-slate-800">{t('auth.createAccount')}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" required value={form.name} onChange={handleChange} placeholder={t('auth.name')} className={inputClass} />
        <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder={t('auth.email')} className={inputClass} />
        <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} placeholder={t('auth.password')} className={inputClass} />

        {errorCode && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{t('err.' + errorCode)}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? t('auth.wait') : t('auth.register')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="font-semibold text-teal-600">
          {t('auth.login')}
        </Link>
      </p>
    </div>
  );
}
