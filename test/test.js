process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./../server.js');
var db = require('./../db.js');
var should = chai.should();

chai.use(chaiHttp);

// grouping and defining individual test cases
describe('Todo', function () {

	// reinitiate the database before each test case
	// beforeEach(function(done) {
	// 	server.db.sequelize.sync({force: true}).then(function () {
	// 		db.Todo.create({
	// 	 		description: 'Take out trash',
	// 		});
	// 	});
	// });

	it('Should list all todos on /todos GET');
	it('Should list all todos that match query string /todos GET');
	it('Should list a SINGLE todo on /todos/:id GET');
	it('Should add a SINGLE todo on /todos POST');
	it('Should update a SINGLE todo on /todos/:id PUT');
	it('Should delete a SINGLE todo on /todos/:id DELETE');
});


it('Should add a SINGLE todo on /todos POST', function (done) {
	chai.request(server)
		.post('/todos')
		.send({'description': 'Unit Testing', 'completed': true})
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.have.property('description');
			res.body.should.have.property('completed');
			res.body.should.have.property('id');
			res.body.should.have.property('createdAt');
			res.body.should.have.property('updatedAt');
			res.body.description.should.equal('Unit Testing');
			res.body.completed.should.equal(true);
			done();
		});

});


it('Should list all todos on /todos GET', function (done) {
	chai.request(server)
		.get('/todos')
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body[0].should.have.property('description');
			res.body[0].should.have.property('completed');
			res.body[0].should.have.property('id');
			res.body[0].should.have.property('createdAt');
			res.body[0].should.have.property('updatedAt');
			res.body[0].description.should.equal('Unit Testing');
			res.body[0].completed.should.equal(true);
			done();
		});
});

it('Should list all todos that match query string /todos GET', function (done) {
	chai.request(server)
		.get('/todos?completed=false')
		.query({'description': 'Testing', 'completed': false})
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body[0].should.have.property('description');
			res.body[0].should.have.property('completed');
			res.body[0].should.have.property('id');
			res.body[0].should.have.property('createdAt');
			res.body[0].should.have.property('updatedAt');
			res.body[0].description.should.equal('Unit Testing');
			res.body[0].completed.should.not.equal(false);
			done();
		});
});


it('Should list a SINGLE todo on /todos/:id GET', function (done) {
	chai.request(server)
		.post('/todos')
		.send({'description': 'Test Retrieve', 'completed': true})
		.end(function(err, res){
			chai.request(server)
				.get('/todos/' + res.body.id)
				.end(function(err, res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.have.property('description');
					res.body.should.have.property('completed');
					res.body.should.have.property('id');
					res.body.should.have.property('createdAt');
					res.body.should.have.property('updatedAt');
					res.body.description.should.equal('Test Retrieve');
					res.body.completed.should.equal(true);
					done();
				});		
		});
		
});


it('Should update a SINGLE todo on /todos/:id PUT', function (done) {
	chai.request(server)
		.get('/todos')
		.end(function (err, res){
			chai.request(server)
				.put('/todos/' + res.body[1].id)
				.send({'description': 'Update record'})
				.end(function (err, res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.have.property('description');
					res.body.should.have.property('completed');
					res.body.should.have.property('id');
					res.body.description.should.have.equal('Update record');
					done();
				});
		});
});


it('Should delete a SINGLE todo on /todos/:id DELETE', function (done) {
	chai.request(server)
	.get('/todos')
	.end(function (err, res) {
		chai.request(server)
		.delete('/todos/' + res.body[1].id)
		.end(function (err, res ) {
			res.should.have.status(204);
			done();
		});
	});
});