var express = require('express');
var app = express();
var PORT = process.env.PORT || 8000;

var todos = [{
	id: 1,
	description: 'Do howework',
	completed: false,
}, {
	id: 2,
	description: 'Pick up groceries',
	completed: false,
},{
	id: 3,
	description: 'Call mom',
	completed: true,
}];

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


app.listen(PORT, function () {
	console.log('Express listening on ' + PORT + '!');
});