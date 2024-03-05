// workspace schema

const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  workspaceLogoIndex:{
    type: Number,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  type: {
    type: String,
    enum: ['private', 'shared'],
    default: 'private',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace;
