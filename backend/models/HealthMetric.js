const mongoose = require('mongoose');
const { METRICS } = require('../utils/metricRanges');

const healthMetricSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.keys(METRICS), required: true },
    value: { type: Number, required: true },
    value2: { type: Number }, // diastolic pressure (only for bloodPressure)
    status: { type: String, enum: ['low', 'normal', 'elevated', 'high'], required: true },
    urgent: { type: Boolean, default: false },
    note: { type: String, default: '', maxlength: 200 },
    measuredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthMetric', healthMetricSchema);
