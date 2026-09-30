# HealthPulse AI / VitaCare Mobile

Full-stack health companion app: React (Vite) + Node.js/Express + MongoDB (Mongoose) + JWT auth,
Chart.js BMI trends, a symptom-based doctor recommendation engine and a dynamic
English / Sinhala / Tamil language switcher, all wrapped in a smartphone frame mockup.

## Quick start

Open two terminals.

Backend (http://localhost:5000):

    cd backend
    npm install
    cp .env.example .env
    npm run dev

Frontend (http://localhost:5173):

    cd frontend
    npm install
    cp .env.example .env
    npm run dev

If MONGO_URI is empty in backend/.env, the API starts an in-memory MongoDB
(mongodb-memory-server) so you can test instantly. Data resets on restart.
Set MONGO_URI to a local MongoDB or Atlas URL for persistent data.

## API overview

| Method | Endpoint                | Description                         |
|--------|-------------------------|-------------------------------------|
| POST   | /api/auth/register      | Create account, returns JWT         |
| POST   | /api/auth/login         | Login, returns JWT                  |
| GET    | /api/users/profile      | Get current profile                 |
| PUT    | /api/users/profile      | Update name, age, height, weight, avatar |
| GET    | /api/health/logs        | BMI history (oldest first)          |
| POST   | /api/health/logs        | Add a weight/height entry (BMI auto-calculated) |
| DELETE | /api/health/logs/:id    | Remove an entry                     |
| POST   | /api/health/recommend   | Symptoms in, specialist suggestions out |

## Architecture notes

- Backend follows routes -> controllers -> models, with JWT middleware in middleware/.
- API errors return a machine-readable code; the frontend translates it into EN/SI/TA.
- All UI strings and questionnaire text live in frontend/src/utils/i18nTranslations.js.
- The doctor engine is a weighted symptom -> specialty map in healthController.js.

Disclaimer: the recommendation engine is an educational demo, not medical advice.
