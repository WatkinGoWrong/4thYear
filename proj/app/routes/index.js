// routes/index.js
const SFLRoutes = require('./SFL_routes');
const dbRoutes = require('./db_routes');

module.exports = function(app, db) {
  dbRoutes(app, db);
  SFLRoutes(app, db);
  // Other route groups could go here, in the future
};