module.exports = {
	url: 'http://quality-todo-api.herokuapp.com',
	elements: {
		newTask: {
			selector: 'p > input[type=text]'
		},
		add: {
			selector: 'p > button'
		},
		incomplete: {
			selector: '#incomplete-tasks'
		},
		incompleteEditButton: {
			selector: '#incomplete-tasks > li:last-child > button.edit'
		},
		incompleteDeleteButton: {
			selector: '#incomplete-tasks > li:last-child > button.delete'
		},
		incompleteEdit: {
			selector: '#incomplete-tasks > li.editMode'
		},
		incompleteEditTask: {
			selector: '#incomplete-tasks > li.editMode > input[type=text]'
		},
		incompleteEditTaskButton: {
			selector: '#incomplete-tasks > li.editMode > button.edit'	
		},
		incompleteCheckBox: {
			selector: '#incomplete-tasks > li:last-child > input[type=checkbox]'
		},
		complete: {
			selector: '#completed-tasks'
		},
		completeCheckBox: {
			selector: '#completed-tasks > li:last-child > input[type=checkbox]'
		}
	}

};