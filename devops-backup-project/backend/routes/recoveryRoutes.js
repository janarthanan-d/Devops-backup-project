const express = require('express');
const router = express.Router();
const {
  initiateRecovery,
  getRecoveryLogs,
  getRecoveryLogById,
} = require('../controllers/recoveryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getRecoveryLogs);
router.get('/:id', protect, getRecoveryLogById);
router.post('/', protect, adminOnly, initiateRecovery);

module.exports = router;