const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    weightKg: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    bmi: { type: Number, required: true },
    category: {
      type: String,
      enum: ['underweight', 'normal', 'overweight', 'obese'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthLog', healthLogSchema);
