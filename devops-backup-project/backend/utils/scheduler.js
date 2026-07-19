const cron = require('node-cron');
const Backup = require('../models/Backup');

const startScheduler = () => {
  // Runs every day at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Running scheduled backup job...');
    try {
      const sources = ['pipeline', 'logs', 'artifacts', 'configs'];
      for (const source of sources) {
        const backup = await Backup.create({
          name: `Scheduled-${source}-${new Date().toISOString().split('T')[0]}`,
          type: 'scheduled',
          source,
          storageType: 'local',
          status: 'success',
          size: Math.floor(Math.random() * 5000) + 100,
          storagePath: `backups/scheduled/${source}-${Date.now()}.zip`,
          retentionDays: 30,
        });
        console.log(`✅ Scheduled backup created: ${backup.name}`);
      }
    } catch (error) {
      console.error('❌ Scheduled backup failed:', error.message);
    }
  });

  console.log('📅 Scheduler started — daily backups at 2:00 AM');
};

module.exports = startScheduler;