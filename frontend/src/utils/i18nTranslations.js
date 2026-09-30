import { createContext, createElement, useContext, useEffect, useState } from 'react';

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'si', label: 'සිං', name: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்', name: 'தமிழ்' },
];

// Must match the symptom ids used by backend/controllers/healthController.js
export const SYMPTOM_IDS = [
  'chestPain', 'palpitations', 'shortBreath', 'cough', 'fever', 'headache',
  'dizziness', 'rash', 'itching', 'jointPain', 'backPain', 'stomachPain',
  'nausea', 'thirst', 'urination', 'anxiety', 'lowMood', 'sleep',
  'blurredVision', 'earPain', 'soreThroat', 'toothache',
];

export const translations = {
  en: {
    'app.name': 'HealthPulse AI',
    'app.tagline': 'Your pocket health companion',
    'nav.home': 'Home',
    'nav.doctors': 'Doctors',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',

    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full name',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    'auth.welcomeBack': 'Welcome back',
    'auth.createAccount': 'Create your account',
    'auth.wait': 'Please wait...',

    'dashboard.greeting': 'Hello',
    'dashboard.yourBmi': 'Your BMI',
    'dashboard.trend': 'BMI trend',
    'dashboard.noData': 'No data yet. Add your height and weight below.',
    'dashboard.addEntry': 'New measurement',
    'dashboard.weight': 'Weight (kg)',
    'dashboard.height': 'Height (cm)',
    'dashboard.add': 'Add entry',
    'dashboard.history': 'Recent entries',
    'dashboard.delete': 'Delete',
    'dashboard.healthyRange': 'Healthy range',
    'dashboard.bmi': 'BMI',

    'bmi.underweight': 'Underweight',
    'bmi.normal': 'Normal',
    'bmi.overweight': 'Overweight',
    'bmi.obese': 'Obese',

    'profile.title': 'My profile',
    'profile.age': 'Age',
    'profile.height': 'Height (cm)',
    'profile.weight': 'Weight (kg)',
    'profile.avatar': 'Avatar photo URL',
    'profile.save': 'Save changes',
    'profile.saved': 'Profile updated!',

    'doctor.title': 'Find a doctor',
    'doctor.intro': 'Tick every symptom you are experiencing.',
    'doctor.find': 'Get recommendation',
    'doctor.selectOne': 'Please select at least one symptom.',
    'doctor.result': 'Recommended specialists',
    'doctor.match': 'match',
    'doctor.urgent': 'This could be an emergency. Go to the nearest hospital or call emergency services right away.',
    'doctor.disclaimer': 'This is not a medical diagnosis. Always consult a qualified doctor.',
    'doctor.reset': 'Start over',

    'common.loading': 'Loading...',

    'err.MISSING_FIELDS': 'Please fill in all fields (password needs 6+ characters).',
    'err.EMAIL_EXISTS': 'This email is already registered.',
    'err.INVALID_CREDENTIALS': 'Incorrect email or password.',
    'err.AUTH_REQUIRED': 'Please log in again.',
    'err.INVALID_INPUT': 'Some values are invalid. Please check and try again.',
    'err.SERVER_ERROR': 'Something went wrong. Please try again.',

    'symptom.chestPain': 'Do you have chest pain or tightness?',
    'symptom.palpitations': 'Does your heart race or flutter?',
    'symptom.shortBreath': 'Do you have shortness of breath?',
    'symptom.cough': 'Do you have a persistent cough?',
    'symptom.fever': 'Do you have a fever or chills?',
    'symptom.headache': 'Do you have frequent headaches?',
    'symptom.dizziness': 'Do you feel dizzy or faint?',
    'symptom.rash': 'Do you have a skin rash or spots?',
    'symptom.itching': 'Do you have itchy skin?',
    'symptom.jointPain': 'Do you have joint or muscle pain?',
    'symptom.backPain': 'Do you have back or neck pain?',
    'symptom.stomachPain': 'Do you have stomach pain or heartburn?',
    'symptom.nausea': 'Do you feel nauseous or have diarrhoea?',
    'symptom.thirst': 'Are you unusually thirsty or hungry?',
    'symptom.urination': 'Do you urinate more often than usual?',
    'symptom.anxiety': 'Do you feel anxious or panicky?',
    'symptom.lowMood': 'Do you feel sad or hopeless?',
    'symptom.sleep': 'Do you have trouble sleeping?',
    'symptom.blurredVision': 'Is your vision blurry?',
    'symptom.earPain': 'Do you have ear pain or hearing trouble?',
    'symptom.soreThroat': 'Do you have a sore throat or blocked nose?',
    'symptom.toothache': 'Do you have tooth or gum pain?',

    'spec.cardiologist': 'Cardiologist',
    'spec.pulmonologist': 'Pulmonologist',
    'spec.generalPhysician': 'General Physician',
    'spec.neurologist': 'Neurologist',
    'spec.dermatologist': 'Dermatologist',
    'spec.orthopedic': 'Orthopaedic Specialist',
    'spec.gastroenterologist': 'Gastroenterologist',
    'spec.endocrinologist': 'Endocrinologist',
    'spec.psychiatrist': 'Psychiatrist',
    'spec.ophthalmologist': 'Eye Specialist',
    'spec.ent': 'ENT Specialist',
    'spec.dentist': 'Dentist',
  },

  si: {
    'app.name': 'HealthPulse AI',
    'app.tagline': 'ඔබේ සාක්කු සෞඛ්‍ය සහකාරයා',
    'nav.home': 'මුල් පිටුව',
    'nav.doctors': 'වෛද්‍යවරු',
    'nav.profile': 'පැතිකඩ',
    'nav.logout': 'පිටවීම',

    'auth.login': 'පිවිසෙන්න',
    'auth.register': 'ලියාපදිංචි වන්න',
    'auth.email': 'ඊමේල්',
    'auth.password': 'මුරපදය',
    'auth.name': 'සම්පූර්ණ නම',
    'auth.noAccount': 'ගිණුමක් නැද්ද?',
    'auth.haveAccount': 'දැනටමත් ගිණුමක් තිබේද?',
    'auth.welcomeBack': 'නැවත සාදරයෙන් පිළිගනිමු',
    'auth.createAccount': 'ගිණුමක් සාදන්න',
    'auth.wait': 'කරුණාකර රැඳී සිටින්න...',

    'dashboard.greeting': 'ආයුබෝවන්',
    'dashboard.yourBmi': 'ඔබේ BMI',
    'dashboard.trend': 'BMI ප්‍රවණතාව',
    'dashboard.noData': 'තවමත් දත්ත නැත. පහතින් ඔබේ උස සහ බර එක් කරන්න.',
    'dashboard.addEntry': 'නව මිනුමක්',
    'dashboard.weight': 'බර (kg)',
    'dashboard.height': 'උස (cm)',
    'dashboard.add': 'එක් කරන්න',
    'dashboard.history': 'මෑත සටහන්',
    'dashboard.delete': 'මකන්න',
    'dashboard.healthyRange': 'සෞඛ්‍ය සම්පන්න පරාසය',
    'dashboard.bmi': 'BMI',

    'bmi.underweight': 'බර අඩුය',
    'bmi.normal': 'සාමාන්‍ය',
    'bmi.overweight': 'අධික බර',
    'bmi.obese': 'තරබාරුය',

    'profile.title': 'මගේ පැතිකඩ',
    'profile.age': 'වයස',
    'profile.height': 'උස (cm)',
    'profile.weight': 'බර (kg)',
    'profile.avatar': 'පැතිකඩ ඡායාරූප URL',
    'profile.save': 'වෙනස්කම් සුරකින්න',
    'profile.saved': 'පැතිකඩ යාවත්කාලීන විය!',

    'doctor.title': 'වෛද්‍යවරයකු සොයන්න',
    'doctor.intro': 'ඔබට දැනෙන සියලු රෝග ලක්ෂණ තෝරන්න.',
    'doctor.find': 'නිර්දේශය ලබාගන්න',
    'doctor.selectOne': 'කරුණාකර අවම වශයෙන් එක් ලක්ෂණයක් තෝරන්න.',
    'doctor.result': 'නිර්දේශිත විශේෂඥයන්',
    'doctor.match': 'ගැළපීම',
    'doctor.urgent': 'මෙය හදිසි තත්ත්වයක් විය හැක. වහාම ළඟම ඇති රෝහලට යන්න හෝ හදිසි සහාය ලබාගන්න.',
    'doctor.disclaimer': 'මෙය වෛද්‍ය රෝග විනිශ්චයක් නොවේ. සෑම විටම සුදුසුකම් ලත් වෛද්‍යවරයකු හමුවන්න.',
    'doctor.reset': 'නැවත ආරම්භ කරන්න',

    'common.loading': 'පූරණය වෙමින්...',

    'err.MISSING_FIELDS': 'කරුණාකර සියලු ක්ෂේත්‍ර පුරවන්න (මුරපදය අකුරු 6ක් හෝ වැඩි විය යුතුය).',
    'err.EMAIL_EXISTS': 'මෙම ඊමේල් ලිපිනය දැනටමත් ලියාපදිංචි වී ඇත.',
    'err.INVALID_CREDENTIALS': 'ඊමේල් හෝ මුරපදය වැරදියි.',
    'err.AUTH_REQUIRED': 'කරුණාකර නැවත පිවිසෙන්න.',
    'err.INVALID_INPUT': 'ඇතැම් අගයන් වලංගු නොවේ. පරීක්ෂා කර නැවත උත්සාහ කරන්න.',
    'err.SERVER_ERROR': 'යම් දෙයක් වැරදී ඇත. නැවත උත්සාහ කරන්න.',

    'symptom.chestPain': 'ඔබට පපුවේ වේදනාවක් හෝ තද ගතියක් තිබේද?',
    'symptom.palpitations': 'ඔබේ හදවත වේගයෙන් ගැහෙනවාද?',
    'symptom.shortBreath': 'ඔබට හුස්ම ගැනීමට අපහසුද?',
    'symptom.cough': 'ඔබට දිගින් දිගටම කැස්සක් තිබේද?',
    'symptom.fever': 'ඔබට උණක් හෝ ශීතල ගතියක් තිබේද?',
    'symptom.headache': 'ඔබට නිතර හිසරදය තිබේද?',
    'symptom.dizziness': 'ඔබට කරකැවිල්ලක් හෝ සිහිසුන් වීමක් දැනේද?',
    'symptom.rash': 'ඔබේ සමේ ගෙඩි හෝ ලප තිබේද?',
    'symptom.itching': 'ඔබේ සම කසනවාද?',
    'symptom.jointPain': 'ඔබට සන්ධි හෝ මාංශ පේශි වේදනා තිබේද?',
    'symptom.backPain': 'ඔබට පිටේ හෝ බෙල්ලේ වේදනාවක් තිබේද?',
    'symptom.stomachPain': 'ඔබට බඩේ වේදනාවක් හෝ පපුවේ දැවිල්ලක් තිබේද?',
    'symptom.nausea': 'ඔබට ඔක්කාරය හෝ පාචනය තිබේද?',
    'symptom.thirst': 'ඔබට අසාමාන්‍ය ලෙස පිපාසය හෝ බඩගිනි දැනේද?',
    'symptom.urination': 'ඔබ සාමාන්‍යයට වඩා නිතර මුත්‍රා කරනවාද?',
    'symptom.anxiety': 'ඔබට කනස්සල්ලක් හෝ බියක් දැනේද?',
    'symptom.lowMood': 'ඔබට දුකක් හෝ බලාපොරොත්තු සුන්වීමක් දැනේද?',
    'symptom.sleep': 'ඔබට නිදා ගැනීමට අපහසුද?',
    'symptom.blurredVision': 'ඔබේ පෙනීම බොඳ වී තිබේද?',
    'symptom.earPain': 'ඔබට කන් වේදනාවක් හෝ ඇසීමේ ගැටලුවක් තිබේද?',
    'symptom.soreThroat': 'ඔබට උගුරේ අමාරුවක් හෝ නාස් අවහිරයක් තිබේද?',
    'symptom.toothache': 'ඔබට දත් කැක්කුමක් තිබේද?',

    'spec.cardiologist': 'හෘද රෝග විශේෂඥ',
    'spec.pulmonologist': 'පෙණහළු රෝග විශේෂඥ',
    'spec.generalPhysician': 'සාමාන්‍ය වෛද්‍යවරයා',
    'spec.neurologist': 'ස්නායු රෝග විශේෂඥ',
    'spec.dermatologist': 'චර්ම රෝග විශේෂඥ',
    'spec.orthopedic': 'අස්ථි රෝග විශේෂඥ',
    'spec.gastroenterologist': 'ආමාශ අන්ත්‍ර රෝග විශේෂඥ',
    'spec.endocrinologist': 'අන්තරාසර්ග රෝග විශේෂඥ',
    'spec.psychiatrist': 'මනෝ වෛද්‍යවරයා',
    'spec.ophthalmologist': 'ඇස් රෝග විශේෂඥ',
    'spec.ent': 'කන් නාසා ගෙල රෝග විශේෂඥ',
    'spec.dentist': 'දන්ත වෛද්‍යවරයා',
  },

  ta: {
    'app.name': 'HealthPulse AI',
    'app.tagline': 'உங்கள் பாக்கெட் சுகாதாரத் துணை',
    'nav.home': 'முகப்பு',
    'nav.doctors': 'மருத்துவர்கள்',
    'nav.profile': 'சுயவிவரம்',
    'nav.logout': 'வெளியேறு',

    'auth.login': 'உள்நுழை',
    'auth.register': 'பதிவு செய்',
    'auth.email': 'மின்னஞ்சல்',
    'auth.password': 'கடவுச்சொல்',
    'auth.name': 'முழு பெயர்',
    'auth.noAccount': 'கணக்கு இல்லையா?',
    'auth.haveAccount': 'ஏற்கனவே கணக்கு உள்ளதா?',
    'auth.welcomeBack': 'மீண்டும் வருக',
    'auth.createAccount': 'உங்கள் கணக்கை உருவாக்குங்கள்',
    'auth.wait': 'சற்று காத்திருக்கவும்...',

    'dashboard.greeting': 'வணக்கம்',
    'dashboard.yourBmi': 'உங்கள் BMI',
    'dashboard.trend': 'BMI போக்கு',
    'dashboard.noData': 'இன்னும் தரவு இல்லை. கீழே உங்கள் உயரம் மற்றும் எடையைச் சேர்க்கவும்.',
    'dashboard.addEntry': 'புதிய அளவீடு',
    'dashboard.weight': 'எடை (kg)',
    'dashboard.height': 'உயரம் (cm)',
    'dashboard.add': 'சேர்',
    'dashboard.history': 'சமீபத்திய பதிவுகள்',
    'dashboard.delete': 'நீக்கு',
    'dashboard.healthyRange': 'ஆரோக்கிய வரம்பு',
    'dashboard.bmi': 'BMI',

    'bmi.underweight': 'எடை குறைவு',
    'bmi.normal': 'சாதாரணம்',
    'bmi.overweight': 'அதிக எடை',
    'bmi.obese': 'உடல் பருமன்',

    'profile.title': 'என் சுயவிவரம்',
    'profile.age': 'வயது',
    'profile.height': 'உயரம் (cm)',
    'profile.weight': 'எடை (kg)',
    'profile.avatar': 'சுயவிவரப் படம் URL',
    'profile.save': 'மாற்றங்களைச் சேமி',
    'profile.saved': 'சுயவிவரம் புதுப்பிக்கப்பட்டது!',

    'doctor.title': 'மருத்துவரைக் கண்டறி',
    'doctor.intro': 'நீங்கள் உணரும் அனைத்து அறிகுறிகளையும் தேர்ந்தெடுக்கவும்.',
    'doctor.find': 'பரிந்துரையைப் பெறு',
    'doctor.selectOne': 'குறைந்தது ஒரு அறிகுறியைத் தேர்ந்தெடுக்கவும்.',
    'doctor.result': 'பரிந்துரைக்கப்பட்ட நிபுணர்கள்',
    'doctor.match': 'பொருத்தம்',
    'doctor.urgent': 'இது அவசர நிலையாக இருக்கலாம். உடனடியாக அருகிலுள்ள மருத்துவமனைக்குச் செல்லவும் அல்லது அவசர உதவியை நாடவும்.',
    'doctor.disclaimer': 'இது மருத்துவ நோயறிதல் அல்ல. எப்போதும் தகுதிவாய்ந்த மருத்துவரை அணுகவும்.',
    'doctor.reset': 'மீண்டும் தொடங்கு',

    'common.loading': 'ஏற்றுகிறது...',

    'err.MISSING_FIELDS': 'அனைத்து புலங்களையும் நிரப்பவும் (கடவுச்சொல் 6+ எழுத்துகள் தேவை).',
    'err.EMAIL_EXISTS': 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.',
    'err.INVALID_CREDENTIALS': 'மின்னஞ்சல் அல்லது கடவுச்சொல் தவறு.',
    'err.AUTH_REQUIRED': 'மீண்டும் உள்நுழையவும்.',
    'err.INVALID_INPUT': 'சில மதிப்புகள் செல்லாதவை. சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    'err.SERVER_ERROR': 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',

    'symptom.chestPain': 'உங்களுக்கு நெஞ்சு வலி அல்லது இறுக்கம் உள்ளதா?',
    'symptom.palpitations': 'உங்கள் இதயம் வேகமாகத் துடிக்கிறதா?',
    'symptom.shortBreath': 'உங்களுக்கு மூச்சுத் திணறல் உள்ளதா?',
    'symptom.cough': 'உங்களுக்கு தொடர்ச்சியான இருமல் உள்ளதா?',
    'symptom.fever': 'உங்களுக்கு காய்ச்சல் அல்லது குளிர் உள்ளதா?',
    'symptom.headache': 'உங்களுக்கு அடிக்கடி தலைவலி வருகிறதா?',
    'symptom.dizziness': 'உங்களுக்கு தலைச்சுற்றல் அல்லது மயக்கம் ஏற்படுகிறதா?',
    'symptom.rash': 'உங்கள் தோலில் தடிப்புகள் அல்லது புள்ளிகள் உள்ளதா?',
    'symptom.itching': 'உங்களுக்கு தோல் அரிப்பு உள்ளதா?',
    'symptom.jointPain': 'உங்களுக்கு மூட்டு அல்லது தசை வலி உள்ளதா?',
    'symptom.backPain': 'உங்களுக்கு முதுகு அல்லது கழுத்து வலி உள்ளதா?',
    'symptom.stomachPain': 'உங்களுக்கு வயிற்று வலி அல்லது நெஞ்செரிச்சல் உள்ளதா?',
    'symptom.nausea': 'உங்களுக்கு குமட்டல் அல்லது வயிற்றுப்போக்கு உள்ளதா?',
    'symptom.thirst': 'உங்களுக்கு வழக்கத்திற்கு மாறான தாகம் அல்லது பசி உள்ளதா?',
    'symptom.urination': 'நீங்கள் வழக்கத்தை விட அடிக்கடி சிறுநீர் கழிக்கிறீர்களா?',
    'symptom.anxiety': 'உங்களுக்கு பதற்றம் அல்லது பயம் ஏற்படுகிறதா?',
    'symptom.lowMood': 'உங்களுக்கு சோகம் அல்லது நம்பிக்கையின்மை உள்ளதா?',
    'symptom.sleep': 'உங்களுக்கு தூங்குவதில் சிரமம் உள்ளதா?',
    'symptom.blurredVision': 'உங்கள் பார்வை மங்கலாக உள்ளதா?',
    'symptom.earPain': 'உங்களுக்கு காது வலி அல்லது கேட்பதில் சிரமம் உள்ளதா?',
    'symptom.soreThroat': 'உங்களுக்கு தொண்டை வலி அல்லது மூக்கடைப்பு உள்ளதா?',
    'symptom.toothache': 'உங்களுக்கு பல் அல்லது ஈறு வலி உள்ளதா?',

    'spec.cardiologist': 'இதய நிபுணர்',
    'spec.pulmonologist': 'நுரையீரல் நிபுணர்',
    'spec.generalPhysician': 'பொது மருத்துவர்',
    'spec.neurologist': 'நரம்பியல் நிபுணர்',
    'spec.dermatologist': 'தோல் நிபுணர்',
    'spec.orthopedic': 'எலும்பு மூட்டு நிபுணர்',
    'spec.gastroenterologist': 'இரைப்பை குடல் நிபுணர்',
    'spec.endocrinologist': 'நாளமில்லா சுரப்பி நிபுணர்',
    'spec.psychiatrist': 'மனநல மருத்துவர்',
    'spec.ophthalmologist': 'கண் மருத்துவர்',
    'spec.ent': 'காது மூக்கு தொண்டை நிபுணர்',
    'spec.dentist': 'பல் மருத்துவர்',
  },
};

const LanguageContext = createContext(null);

/** Provides { lang, setLang, t } to the whole app and remembers the choice. */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('hp_lang');
    return translations[saved] ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('hp_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Falls back to English, then to the key itself, so a missing string never crashes the UI.
  const t = (key) => (translations[lang] && translations[lang][key]) || translations.en[key] || key;

  return createElement(LanguageContext.Provider, { value: { lang, setLang, t } }, children);
}

export const useI18n = () => useContext(LanguageContext);

// --- added by update_project.js: health tracker + photo upload strings ---
import { metricTranslations } from './i18nMetrics.js';
Object.keys(metricTranslations).forEach((lang) => Object.assign(translations[lang], metricTranslations[lang]));

// --- added by update_project.js: Find a doctor strings ---
import { doctorTranslations } from './i18nDoctors.js';
Object.keys(doctorTranslations).forEach((lang) => Object.assign(translations[lang], doctorTranslations[lang]));
