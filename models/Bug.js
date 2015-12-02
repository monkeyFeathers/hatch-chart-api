var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stage = new Schema({
  name: String,
  patterns: [String],
  sizeColor: String,
})

var Bug = new Schema({
  scientificName: String,
  commonName: String,
  stages: [Stage]
});

module.exports = mongoose.model('Bug', Bug);
