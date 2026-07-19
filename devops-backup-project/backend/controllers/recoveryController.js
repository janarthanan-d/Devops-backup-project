const RecoveryLog = require('../models/RecoveryLog');
const Backup = require('../models/Backup');

// Initiate Recovery
const initiateRecovery = async (req, res) => {
  try {
    const { backupId, recoveryType, notes } = req.body;

    const backup = await Backup.findById(backupId);
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    if (backup.status !== 'success') {
      return res.status(400).json({ message: 'Can only recover from successful backups' });
    }

    const log = await RecoveryLog.create({
      backupId,
      initiatedBy: req.user._id,
      recoveryType: recoveryType || 'full',
      notes,
      status: 'success',
      completedAt: new Date(),
    });

    return res.status(201).json(log);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get All Recovery Logs
const getRecoveryLogs = async (req, res) => {
  try {
    const logs = await RecoveryLog.find()
      .populate('backupId', 'name source')
      .populate('initiatedBy', 'name email')
      .sort({ createdAt: -1 });
    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Single Recovery Log
const getRecoveryLogById = async (req, res) => {
  try {
    const log = await RecoveryLog.findById(req.params.id)
      .populate('backupId', 'name source')
      .populate('initiatedBy', 'name email');
    if (!log) {
      return res.status(404).json({ message: 'Recovery log not found' });
    }
    return res.json(log);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { initiateRecovery, getRecoveryLogs, getRecoveryLogById };