const config = require('../config');

var records = [
    { id: 1, username: `${config.passport.username}`, password: `${config.passport.password}`}
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    // var idx = id - 1;
    if (records[0]) {
      cb(null, records[0]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
