const Backup = require('../models/Backup');
const RecoveryLog = require('../models/RecoveryLog');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const totalBackups = await Backup.countDocuments();
    const successBackups = await Backup.countDocuments({ status: 'success' });
    const failedBackups = await Backup.countDocuments({ status: 'failed' });
    const totalRecoveries = await RecoveryLog.countDocuments();
    const successRecoveries = await RecoveryLog.countDocuments({ status: 'success' });
    const totalUsers = await User.countDocuments();

    const recentBackups = await Backup.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');

    const recentRecoveries = await RecoveryLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('backupId', 'name');

    const storageData = await Backup.aggregate([
      { $group: { _id: '$storageType', total: { $sum: '$size' } } }
    ]);

    return res.json({
      stats: {
        totalBackups,
        successBackups,
        failedBackups,
        totalRecoveries,
        successRecoveries,
        totalUsers,
      },
      recentBackups,
      recentRecoveries,
      storageData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };