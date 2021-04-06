const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
  id:          {type: String, required: true},
  name:        {type: String, required: true},
  description: {type: String, required: false},
  url:         {type: String, required: false},
  children:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

module.exports = mongoose.model('Document', documentSchema);
// we use the export because we want to use the model outside of this file
