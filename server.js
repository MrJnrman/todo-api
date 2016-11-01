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
var queryParams = req.query;
	var filteredTodos = todos;

	// if has property && completed === 'true'
	if( queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed: true})
	} else if( queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(filteredTodos, {completed: false})
	}

	if ( queryParams.hasOwnProperty('description') && queryParams.description.length > 0){
		filteredTodos = _.filter(filteredTodos, function (todo) {
			return todo.description.toLowerCase().indexOf(queryParams.description.toLowerCase()) > -1;
		});
	} else if(queryParams.hasOwnProperty('description')){
		res.status(400).send();
	}

	return res.json(filteredTodos);
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
	var matched = _.findWhere(todos, {id: todoId});

	if(matched){
		todos = _.without(todos, matched);
		res.json(matched);
	} else {
		res.status(404).send();
	}
});

// UPDATE /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matched = _.findWhere(todos, {id: todoId})
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if(!matched){
		res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')){
		res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.descriprion) && body.descriprion.trim() > 0){
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		res.status(400).send();
	}

	// updates todo by reference
	_.extend(matched, validAttributes);
	res.json(matched);
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('Express listening on ' + PORT + '!');
	});
});