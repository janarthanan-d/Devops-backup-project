const Backup = require('../models/Backup');
const { sendBackupAlert } = require('../utils/mailer');

// Create Manual Backup
const createBackup = async (req, res) => {
  try {
    const { name, source, storageType, retentionDays, tags } = req.body;

    if (!name || !source) {
      return res.status(400).json({ message: 'Name and source are required' });
    }

    const backup = await Backup.create({
      name,
      source,
      storageType: storageType || 'local',
      retentionDays: retentionDays || 30,
      tags: tags || [],
      type: 'manual',
      status: 'pending',
      createdBy: req.user._id,
    });

    backup.status = 'success';
    backup.size = Math.floor(Math.random() * 5000) + 100;
    backup.storagePath = `backups/${backup._id}/${name.replace(/\s+/g, '_')}.zip`;
    await backup.save();

    // Send email alert
    if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
      await sendBackupAlert({
        to: req.user.email,
        backupName: backup.name,
        status: backup.status,
        source: backup.source,
      });
    }

    return res.status(201).json(backup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBackups = async (req, res) => {
  try {
    const backups = await Backup.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    return res.json(backups);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBackupById = async (req, res) => {
  try {
    const backup = await Backup.findById(req.params.id)
      .populate('createdBy', 'name email');
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }
    return res.json(backup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteBackup = async (req, res) => {
  try {
    const backup = await Backup.findById(req.params.id);
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }
    await backup.deleteOne();
    return res.json({ message: 'Backup deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBackupStats = async (req, res) => {
  try {
    const total = await Backup.countDocuments();
    const success = await Backup.countDocuments({ status: 'success' });
    const failed = await Backup.countDocuments({ status: 'failed' });
    const pending = await Backup.countDocuments({ status: 'pending' });
    const totalSize = await Backup.aggregate([
      { $group: { _id: null, total: { $sum: '$size' } } }
    ]);

    return res.json({
      total, success, failed, pending,
      totalSize: totalSize[0]?.total || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createBackup, getBackups, getBackupById, deleteBackup, getBackupStats };