var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Hatch = new Schema({
  paterns: [type: String]
  
});

module.exports = mongoose.model('Hatch', hatch);
