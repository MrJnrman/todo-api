var express = require('express');
var parser = require('body-parser');
var _ = require('underscore'); // used to refactor code
var db = require('./db.js')

var app = express();
var PORT = process.env.PORT || 8000;
var todos = [];
var todoNextId = 1;

// express middleware that parses body of request
app.use(parser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	var query = req.query;
	var where = {};
	// var filteredTodos = todos;

	// // if has property && completed === 'true'
	// if( queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
	// 	filteredTodos = _.where(filteredTodos, {completed: true})
	// } else if( queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
	// 	filteredTodos = _.where(filteredTodos, {completed: false})
	// }

	// if ( queryParams.hasOwnProperty('description') && queryParams.description.length > 0){
	// 	filteredTodos = _.filter(filteredTodos, function (todo) {
	// 		return todo.description.toLowerCase().indexOf(queryParams.description.toLowerCase()) > -1;
	// 	});
	// } else if(queryParams.hasOwnProperty('description')){
	// 	res.status(400).send();
	// }

	// return res.json(filteredTodos);

	if (query.hasOwnProperty('completed') && query.completed === 'true'){
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false'){
		where.completed = false;
	}

	if (query.hasOwnProperty('description') && query.description.length > 0){
		where.description = {
			$like: '%' + query.description + '%'
		};
	}

	db.Todo.findAll({
		where: where
	}).then(function (todos) {
		if (todos) {
			res.json(todos);
		} else {
			res.status(404).send();
		}
	}).catch(function (e) {
		res.status(500).send();
	});

});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	/*var matched = _.findWhere(todos, {id: todoId});

	if(matched){
		res.json(matched);
	} else {
		res.status(404).send();
	}*/

	db.Todo.findById(todoId).then(function (todo) {
		if(!!todo){ // '!!' converts an object into a boolean value (true)
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}).catch(function (e) {
		res.status(500).send();
	});
});

// POST /todos
app.post('/todos', function (req, res) {

	// use pick to take specific values
	body = _.pick(req.body, 'description', 'completed');

	// if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// body.description = body.description.trim();
	// body.id = todoNextId;
	// todoNextId ++;

	// todos.push(body);

	// res.json(body);

	console.log(body);

	db.Todo.create(body).then(function (todo){
		res.json(todo.toJSON());
	}).catch(function (e) {
		res.status(400).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	/*var matched = _.findWhere(todos, {id: todoId});

	if(matched){
		todos = _.without(todos, matched);
		res.json(matched);
	} else {
		res.status(404).send();
	}*/
	db.Todo.destroy({
		where: {
			id: todoId
		}
	}).then(function (affectedRows) {
		if(affectedRows === 0){
			res.status(404).json({
				error: 'No todo with id'
			});
		} else {
			res.status(204).send()
		}
	}, function () {
		res.status(500).send()
	}).catch(function (e) {
		res.status(500).send();
	});
});

// UPDATE /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')){
		attributes.description = body.description;
	}

	db.Todo.findById(todoId).then(function (todo){
		if(todo) {
			return todo.update(attributes).then(function (todo) {
				res.json(todo.toJSON());
			}, function (e) {
				res.status(400).json(e);
			})
		} else {
			res.status(404).send();
		}
	}, function () {
		res.status(500).send();
	});
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('Express listening on ' + PORT + '!');
	});
});