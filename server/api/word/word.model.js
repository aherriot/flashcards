'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WordSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  english: {type: String, required: true},
  persian: {type: String, required: true},
  phonetic: {type: String, required: true},
  e_to_p:  {type: Number, default: 1},
  p_to_e:  {type: Number, default: 1},
  e_to_ph: {type: Number, default: 1},
  ph_to_e: {type: Number, default: 1},
  p_to_ph: {type: Number, default: 1},
  ph_to_p: {type: Number, default: 1},
  tags: [String]
});

module.exports = mongoose.model('Word', WordSchema);
