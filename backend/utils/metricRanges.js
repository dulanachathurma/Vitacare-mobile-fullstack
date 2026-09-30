/**
 * Reference ranges for the health tracker (general adult values, educational only).
 * evaluate() returns a status key: low | normal | elevated | high, plus an urgent flag.
 * To add a new metric, add one entry here and one set of translation keys on the frontend.
 */
const METRICS = {
  // Fasting blood sugar, mg/dL (diabetes)
  bloodSugar: {
    unit: 'mg/dL', min: 20, max: 700, specialty: 'endocrinologist',
    evaluate: (v) => {
      const urgent = v < 54 || v > 300;
      if (v < 70) return { status: 'low', urgent };
      if (v < 100) return { status: 'normal', urgent };
      if (v < 126) return { status: 'elevated', urgent };
      return { status: 'high', urgent };
    },
  },

  // Total cholesterol, mg/dL (heart disease risk)
  cholesterol: {
    unit: 'mg/dL', min: 50, max: 600, specialty: 'cardiologist',
    evaluate: (v) => {
      if (v < 200) return { status: 'normal', urgent: false };
      if (v < 240) return { status: 'elevated', urgent: false };
      return { status: 'high', urgent: false };
    },
  },

  // Blood pressure, mmHg: value = systolic (top), value2 = diastolic (bottom) (hypertension)
  bloodPressure: {
    unit: 'mmHg', min: 50, max: 300, dual: true, specialty: 'cardiologist',
    evaluate: (sys, dia) => {
      if (sys > 180 || dia > 120) return { status: 'high', urgent: true };
      if (sys < 90 || dia < 60) return { status: 'low', urgent: sys < 70 };
      if (sys >= 140 || dia >= 90) return { status: 'high', urgent: false };
      if (sys >= 120 || dia >= 80) return { status: 'elevated', urgent: false };
      return { status: 'normal', urgent: false };
    },
  },

  // Resting heart rate, bpm
  heartRate: {
    unit: 'bpm', min: 20, max: 250, specialty: 'cardiologist',
    evaluate: (v) => {
      if (v < 60) return { status: 'low', urgent: v < 40 };
      if (v <= 100) return { status: 'normal', urgent: false };
      return { status: 'high', urgent: v > 150 };
    },
  },

  // Oxygen saturation SpO2, % (asthma / lung health)
  oxygen: {
    unit: '%', min: 50, max: 100, specialty: 'pulmonologist',
    evaluate: (v) => {
      if (v < 90) return { status: 'low', urgent: true };
      if (v < 95) return { status: 'low', urgent: false };
      return { status: 'normal', urgent: false };
    },
  },

  // Body temperature, degrees Celsius (fever)
  temperature: {
    unit: 'C', min: 30, max: 45, specialty: 'generalPhysician',
    evaluate: (v) => {
      if (v < 35.5) return { status: 'low', urgent: v < 34 };
      if (v <= 37.5) return { status: 'normal', urgent: false };
      if (v < 39) return { status: 'elevated', urgent: false };
      return { status: 'high', urgent: v >= 40 };
    },
  },
};

const evaluateMetric = (type, value, value2) => METRICS[type].evaluate(value, value2);

module.exports = { METRICS, evaluateMetric };
