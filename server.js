var express = require('express');
var parser = require('body-parser');
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
	return res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matched;

	for(i = 0; i < todos.length; i++){
		if (todoId === todos[i].id){
			matched = todos[i];
		}
	}

	if(matched){
		res.json(matched);
	} else {
		res.status(404).send();
	}
});

// POST /todos
app.post('/todos', function (req, res) {
	body = req.body;

	body.id = todoNextId;
	todoNextId ++;

	todos.push(body);

	res.json(body);
});

app.listen(PORT, function () {
	console.log('Express listening on ' + PORT + '!');
});