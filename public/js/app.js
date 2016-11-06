//Problem: User interaction doesn't provide desired results.
//Solution: Add interactivty so the user can manage daily tasks.

var taskInput = document.getElementById("new-task"); //new-task
var addButton = document.getElementsByTagName("button")[0]; //first button
var incompleteTasksHolder = document.getElementById("incomplete-tasks"); //incomplete-tasks
var completedTasksHolder= document.getElementById("completed-tasks"); //completed-tasks

//New Task List Item
var createNewTaskElement = function(taskString, taskId) {
  //Create List Item
  var listItem = document.createElement("li");

  //id label
  var id = document.createElement("label");
  //input (checkbox)
  var checkBox = document.createElement("input"); // checkbox
  //label
  var label = document.createElement("label");
  //input (text)
  var editInput = document.createElement("input"); // text
  //button.edit
  var editButton = document.createElement("button");
  //button.delete
  var deleteButton = document.createElement("button");
  
  //Each element needs modifying
  
  checkBox.type = "checkbox";
  editInput.type = "text";
  
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  
  label.innerText = taskString;
  id.innerText = taskId;
  
  //Each element needs appending
  listItem.appendChild(id);
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}

//Add a new task
var addTask = function() {
  console.log("Add task...");

  var todo = JSON.stringify({
    description: taskInput.value
  });


  $.ajax({
    url: "/todos",
    type: "POST",
    contentType: "application/json",
    processData: false,
    data: todo,

    success: function (response){
       //Create a new list item with the text from #new-task:
       console.log(response);
      var listItem = createNewTaskElement(response.description, response.id);
      //Append listItem to incompleteTasksHolder
      incompleteTasksHolder.appendChild(listItem);
      bindTaskEvents(listItem, taskCompleted); 
    }

  });

  taskInput.value = "";
}

//Edit an existing task
var editTask = function() {
  console.log("Edit task...");

  var listItem = this.parentNode;

  var editInput = listItem.querySelector("input[type=text");
  var id = listItem.getElementsByTagName("label")[0].innerText;
  var label = listItem.getElementsByTagName("label")[1];
  var checkbox = listItem.querySelector("input[type=checkbox]");
  console.log(checkbox);
  
  var containsClass = listItem.classList.contains("editMode");
  
  //if the class of the parent is .editMode
  if(containsClass) {
    $.ajax({
      url: "/todos/" + id,
      type: "PUT",
      contentType: "application/json",
      processData: false,
      data: JSON.stringify({
        description: editInput.value,
        completed: checkbox.checked
      }),

      success: function (response){
        console.log(response);

        //Switch from .editMode
        //label text become the input's value
        label.innerText = response.description;
      }

    });
  
  } else {
    //Switch to .editMode
    //input value becomes the label's text
    editInput.value = label.innerText;
  }
  
  //Toggle .editMode on the list item
  listItem.classList.toggle("editMode");
  
}

//Delete an existing task
var deleteTask = function() {
  console.log("Delete task...");
  var listItem = this.parentNode;
  var id = listItem.getElementsByTagName("label")[0].innerText;
  var ul = listItem.parentNode;

  $.ajax({
    url: "/todos/" + id,
    type: "DELETE",

    success: function (response){
       console.log(response);
     }

  });

  //Remove the parent list item from the ul
  ul.removeChild(listItem);
}

//Mark a task as complete
var taskCompleted = function(listItem) {
  console.log("Task complete...");
    //Append the task list item to the #completed-tasks
    var listItem = this.parentNode;
    var id = listItem.getElementsByTagName("label")[0].innerText;

    $.ajax({
      url: "/todos/" + id,
      type: "PUT",
      contentType: "application/json",
      processData: false,
      data: JSON.stringify({
        completed: true
      }),

      success: function (response){
        console.log(response);
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete);
      }

    });

    
}


//Mark a task as incomplete
var taskIncomplete = function() {
  console.log("Task incomplete...");
  //Append the task list item to the #incomplete-tasks
  var listItem = this.parentNode;

     var id = listItem.getElementsByTagName("label")[0].innerText;

    $.ajax({
      url: "/todos/" + id,
      type: "PUT",
      contentType: "application/json",
      processData: false,
      data: JSON.stringify({
        completed: false
      }),

      success: function (response){
        console.log(response);
        incompleteTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);
      }

    });
}

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
  console.log("Bind list item events");
  //select taskListItem's children
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");
  
  //bind editTask to edit button
  editButton.onclick = editTask;
  
  //bind deleteTask to delete button
  deleteButton.onclick = deleteTask;
  
  //bind checkBoxEventHandler to checkbox
  checkBox.onchange = checkBoxEventHandler;
}

// Get all todos
$.get('/todos', function(data){
    data.forEach(function(todo) {
      var listItem = createNewTaskElement(todo.description, todo.id);

      // check if task is completed
      if(todo.completed === false){
        incompleteTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);  
      } else {
        if (listItem){
          //Append the task list item to the #completed-tasks
          completedTasksHolder.appendChild(listItem);
          bindTaskEvents(listItem, taskIncomplete);
        } else {
          //Append the task list item to the #completed-tasks
          var listItem = this.parentNode;
          completedTasksHolder.appendChild(listItem);
          bindTaskEvents(listItem, taskIncomplete);
        }
      }

    });
});


//Set the click handler to the addTask function
addButton.onclick =  addTask;
// addButton.addEventListener("click", ajaxRequest);

//cycle over incompleteTasksHolder ul list items
for(var i = 0; i < incompleteTasksHolder.children.length; i++) {
  //bind events to list item's children (taskCompleted)
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

//cycle over completedTasksHolder ul list items
for(var i = 0; i < completedTasksHolder.children.length; i++) {
  //bind events to list item's children (taskIncomplete)
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}

































