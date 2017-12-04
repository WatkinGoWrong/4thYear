const annoRoutes = require('./main');
module.exports = function(app, db) {
  annoRoutes(app, db);
  // Other route groups could go here, in the future
};
