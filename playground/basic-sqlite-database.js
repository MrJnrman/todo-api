var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

// check sequelize docs for more info
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1,250] //between 1 and 250
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({
	//force: true // wipes database
}).then(function (){
	console.log('Everything is synced');

	Todo.findById(1).then(function (todo) {
		if (todo){
			console.log(todo.toJSON());
		} else {
			console.log('No record found!');
		}
	}).catch( function (e) {
		console.log(e);
	});

	// Todo.create({
	// 	description: 'Take out trash',
	// }).then(function (todo) {
	// 	return Todo.create({
	// 		description: 'Clean office'
	// 	});
	// }).then(function () {
	// 	//return Todo.findById(1);
	// 	return Todo.findAll({
	// 		where: {
	// 			description: {
	// 				$like: '%Office%' // all records that have trash occuring in description
	// 			}
	// 		}
	// 	});
	// }).then(function (todos) {
	// 	if(todos){
	// 		todos.forEach(function (todo) {
	// 			console.log(todo.toJSON());
	// 		});
	// 	} else {
	// 		console.log('No todo Valid');
	// 	}
	// }).catch(function (e){
	// 	console.log(e);
	// });
});