const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['manual', 'scheduled'], default: 'manual' },
  source: { type: String, enum: ['pipeline', 'logs', 'artifacts', 'configs'], required: true },
  status: { type: String, enum: ['pending', 'running', 'success', 'failed'], default: 'pending' },
  size: { type: Number, default: 0 },
  storagePath: { type: String },
  storageType: { type: String, enum: ['local', 's3', 'gcs', 'azure'], default: 'local' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  errorMessage: { type: String },
  retentionDays: { type: Number, default: 30 },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Backup', backupSchema);