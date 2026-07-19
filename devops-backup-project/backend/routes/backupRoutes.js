const express = require('express');
const router = express.Router();
const {
  createBackup,
  getBackups,
  getBackupById,
  deleteBackup,
  getBackupStats,
} = require('../controllers/backupController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, getBackupStats);
router.get('/', protect, getBackups);
router.get('/:id', protect, getBackupById);
router.post('/', protect, adminOnly, createBackup);
router.delete('/:id', protect, adminOnly, deleteBackup);

module.exports = router;