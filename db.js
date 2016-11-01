var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'
});

var db = {};

db.Todo = sequelize.import(__dirname + '/models/todo.js'); // todo model
db.sequelize = sequelize; // sequelize instance
db.Sequelize = Sequelize; // sequelize library

module.exports = db;