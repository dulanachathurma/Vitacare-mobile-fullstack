const HealthMetric = require('../models/HealthMetric');
const { METRICS, evaluateMetric } = require('../utils/metricRanges');

// GET /api/metrics?type=bloodSugar   (type is optional)
const getMetrics = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.type && METRICS[req.query.type]) filter.type = req.query.type;
    const metrics = await HealthMetric.find(filter).sort({ measuredAt: 1 }).limit(500);
    res.json({ metrics });
  } catch (err) {
    next(err);
  }
};

// POST /api/metrics   body: { type, value, value2?, note? }
const addMetric = async (req, res, next) => {
  try {
    const { type, note } = req.body;
    const config = METRICS[type];
    const value = Number(req.body.value);
    const value2 = config && config.dual ? Number(req.body.value2) : undefined;

    const invalid =
      !config ||
      !value ||
      value < config.min ||
      value > config.max ||
      (config.dual && (!value2 || value2 < 30 || value2 > 200 || value2 >= value));

    if (invalid) {
      return res.status(400).json({ code: 'INVALID_INPUT', message: 'Invalid reading' });
    }

    const { status, urgent } = evaluateMetric(type, value, value2);
    const metric = await HealthMetric.create({
      user: req.user._id,
      type,
      value,
      value2,
      status,
      urgent,
      note: note ? String(note).slice(0, 200) : '',
    });

    // Suggest a specialist when the reading is outside the normal range.
    const specialty = status === 'normal' ? null : config.specialty;
    res.status(201).json({ metric, specialty });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/metrics/:id
const deleteMetric = async (req, res, next) => {
  try {
    await HealthMetric.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMetrics, addMetric, deleteMetric };
