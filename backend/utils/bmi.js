/**
 * Calculates BMI (rounded to 1 decimal) and its WHO category key.
 * Category keys match the "bmi.*" translation keys on the frontend.
 */
const calculateBmi = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  let category = 'obese';
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 25) category = 'normal';
  else if (bmi < 30) category = 'overweight';

  return { bmi, category };
};

module.exports = { calculateBmi };
