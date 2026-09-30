const HealthLog = require('../models/HealthLog');
const { calculateBmi } = require('../utils/bmi');

/**
 * Symptom -> specialist scoring table.
 * Higher points mean the symptom points more strongly to that specialty.
 * Symptom ids must match the ones in frontend/src/utils/i18nTranslations.js.
 */
const SYMPTOM_MAP = {
  chestPain: { cardiologist: 3, generalPhysician: 1 },
  palpitations: { cardiologist: 3 },
  shortBreath: { pulmonologist: 3, cardiologist: 2 },
  cough: { pulmonologist: 2, generalPhysician: 1, ent: 1 },
  fever: { generalPhysician: 3 },
  headache: { neurologist: 2, generalPhysician: 1 },
  dizziness: { neurologist: 2, cardiologist: 1, ent: 1 },
  rash: { dermatologist: 3 },
  itching: { dermatologist: 2 },
  jointPain: { orthopedic: 3 },
  backPain: { orthopedic: 3 },
  stomachPain: { gastroenterologist: 3 },
  nausea: { gastroenterologist: 2, generalPhysician: 1 },
  thirst: { endocrinologist: 3 },
  urination: { endocrinologist: 2, generalPhysician: 1 },
  anxiety: { psychiatrist: 3 },
  lowMood: { psychiatrist: 3 },
  sleep: { psychiatrist: 2, neurologist: 1 },
  blurredVision: { ophthalmologist: 3, neurologist: 1 },
  earPain: { ent: 3 },
  soreThroat: { ent: 3, generalPhysician: 1 },
  toothache: { dentist: 3 },
};

// Symptom combinations that should trigger an "urgent care" warning.
const RED_FLAGS = [
  ['chestPain', 'shortBreath'],
  ['chestPain', 'palpitations'],
];

// GET /api/health/logs
const getLogs = async (req, res, next) => {
  try {
    const logs = await HealthLog.find({ user: req.user._id }).sort({ createdAt: 1 }).limit(200);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
};

// POST /api/health/logs
const addLog = async (req, res, next) => {
  try {
    const weightKg = Number(req.body.weightKg);
    const heightCm = Number(req.body.heightCm || req.user.heightCm);

    if (!weightKg || !heightCm || weightKg < 10 || weightKg > 400 || heightCm < 50 || heightCm > 250) {
      return res.status(400).json({ code: 'INVALID_INPUT', message: 'Valid weight and height are required' });
    }

    const { bmi, category } = calculateBmi(weightKg, heightCm);
    const log = await HealthLog.create({ user: req.user._id, weightKg, heightCm, bmi, category });

    // Keep the profile in sync with the latest measurement.
    req.user.weightKg = weightKg;
    req.user.heightCm = heightCm;
    await req.user.save();

    res.status(201).json({ log, user: req.user.toPublic() });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/health/logs/:id
const deleteLog = async (req, res, next) => {
  try {
    await HealthLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// POST /api/health/recommend   body: { symptoms: ['chestPain', 'cough'] }
const recommend = (req, res) => {
  const selected = Array.isArray(req.body.symptoms) ? req.body.symptoms : [];
  const valid = selected.filter((id) => SYMPTOM_MAP[id]);

  if (valid.length === 0) {
    return res.status(400).json({ code: 'INVALID_INPUT', message: 'Select at least one valid symptom' });
  }

  const scores = {};
  let totalPoints = 0;
  valid.forEach((id) => {
    Object.entries(SYMPTOM_MAP[id]).forEach(([specialty, points]) => {
      scores[specialty] = (scores[specialty] || 0) + points;
      totalPoints += points;
    });
  });

  const recommendations = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([specialty, score]) => ({
      specialty,
      score,
      percent: Math.round((score / totalPoints) * 100),
    }));

  const urgent = RED_FLAGS.some((flag) => flag.every((id) => valid.includes(id)));

  res.json({ recommendations, urgent });
};

module.exports = { getLogs, addLog, deleteLog, recommend };
