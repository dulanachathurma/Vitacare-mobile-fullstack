const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMetrics, addMetric, deleteMetric } = require('../controllers/metricController');

const router = express.Router();

router.use(protect);
router.route('/').get(getMetrics).post(addMetric);
router.delete('/:id', deleteMetric);

module.exports = router;
