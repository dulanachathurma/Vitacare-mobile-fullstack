const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getLogs, addLog, deleteLog, recommend } = require('../controllers/healthController');

const router = express.Router();

router.use(protect);
router.route('/logs').get(getLogs).post(addLog);
router.delete('/logs/:id', deleteLog);
router.post('/recommend', recommend);

module.exports = router;
