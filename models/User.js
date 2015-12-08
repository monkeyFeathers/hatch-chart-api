var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  githubId: String,
  access_token: String
})

UserSchema.statics.findOrCreate = function(filters, cb) {
  User = this;
  this.find(filters, function(err, results) {
    if (results.length === 0 ) {
      var newUser = new User();
      newUser.githubId = filters.githubId;
      newUser.save(function(err, doc) { cb(err, doc) });
    } else { cb(err, results[0]); }
  });
}

module.exports = mongoose.model('User', UserSchema);
