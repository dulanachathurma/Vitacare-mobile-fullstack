const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

const router = express.Router();

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

module.exports = router;
