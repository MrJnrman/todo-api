var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production'){
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else if (env === 'development') {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/dev-todo-api.sqlite'
	});	
} else if(env === 'test') {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/test/test.sqlite'
	});	
}


var db = {};

db.Todo = sequelize.import(__dirname + '/models/todo.js'); // todo model
db.sequelize = sequelize; // sequelize instance
db.Sequelize = Sequelize; // sequelize library

module.exports = db;