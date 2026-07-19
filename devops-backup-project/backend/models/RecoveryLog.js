const mongoose = require('mongoose');

const recoveryLogSchema = new mongoose.Schema({
  backupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Backup', required: true },
  initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['initiated', 'running', 'success', 'failed'], default: 'initiated' },
  recoveryType: { type: String, enum: ['full', 'partial', 'dry-run'], default: 'full' },
  notes: { type: String },
  completedAt: { type: Date },
  errorMessage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('RecoveryLog', recoveryLogSchema);