const HealthLog = require('../models/HealthLog');
const { calculateBmi } = require('../utils/bmi');

// Converts empty input to undefined so optional fields can be skipped.
const toNumber = (value) =>
  value === '' || value === null || value === undefined ? undefined : Number(value);

const isInvalid = (value, min, max) =>
  value !== undefined && (Number.isNaN(value) || value < min || value > max);

// GET /api/users/profile
const getProfile = (req, res) => {
  res.json({ user: req.user.toPublic() });
};

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, avatarUrl } = req.body;
    const age = toNumber(req.body.age);
    const heightCm = toNumber(req.body.heightCm);
    const weightKg = toNumber(req.body.weightKg);

    // Accept either a normal image link or an uploaded photo sent as a base64 data URL.
    const AVATAR_PATTERN = /^(https?:\/\/|data:image\/(png|jpeg|webp);base64,)/i;
    const badName = name !== undefined && !String(name).trim();
    const badAvatar =
      avatarUrl && (!AVATAR_PATTERN.test(String(avatarUrl).trim()) || String(avatarUrl).length > 500000);

    if (badName || badAvatar || isInvalid(age, 1, 120) || isInvalid(heightCm, 50, 250) || isInvalid(weightKg, 10, 400)) {
      return res.status(400).json({ code: 'INVALID_INPUT', message: 'One or more values are invalid' });
    }

    const bodyChanged =
      (heightCm !== undefined && heightCm !== user.heightCm) ||
      (weightKg !== undefined && weightKg !== user.weightKg);

    if (name !== undefined) user.name = String(name).trim();
    if (avatarUrl !== undefined) user.avatarUrl = String(avatarUrl).trim();
    if (age !== undefined) user.age = age;
    if (heightCm !== undefined) user.heightCm = heightCm;
    if (weightKg !== undefined) user.weightKg = weightKg;
    await user.save();

    // Every change to height/weight becomes a new point on the BMI trend chart.
    if (bodyChanged && user.heightCm && user.weightKg) {
      const { bmi, category } = calculateBmi(user.weightKg, user.heightCm);
      await HealthLog.create({
        user: user._id,
        weightKg: user.weightKg,
        heightCm: user.heightCm,
        bmi,
        category,
      });
    }

    res.json({ user: user.toPublic() });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile };
