$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshTasks();
  startClickHandlers();
});

function startClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#sort').on('click', sort);
  $('#buttonsDiv').on('click', '#editBtn', editTaskSubmit);
  $('#buttonsDiv').on('click', '#undoBtn', undoBtn);
  $('#toDoList').on('click', '.doTask', doTask);
  $('#toDoList').on('click', '.editTask', editTask);
  $('#toDoList').on('click', '.deleteTask', deleteTask);
}

let taskToEdit = {};
let editState = 'N';
let sortStyle = 'ASC';

function sort(){
  if (sortStyle === 'ASC') {
    sortStyle= 'DESC';
    refreshTasks();
  }
  else{
    sortStyle= 'ASC';
    refreshTasks();
  };
}


function handleSubmit() {
  console.log('Submit button clicked.');
  let task = {
    task: $('#task').val(),
    };
  addTask(task);
}

// adds a task to the database
function addTask(tasktoAdd) {
  let newTask = {
    task: $('#task').val(),
  };

  $.ajax({
  type: 'POST',
  url: '/tasks',
  data: newTask
  }).then(function(response) {
    console.log('Response from server.', response);
    refreshTasks();
    $('#task').val('');
  }).catch(function(error) {
    console.log('Error in POST', error)
    alert('Unable to add task at this time. Please try again later.');
  });
};

// refreshTasks will get all tasks from the server and render to page
function refreshTasks() {

  $.ajax({
    type: 'GET',
    url: `/tasks/${sortStyle}`,
  }).then(function(response) {
    console.log(response);
    renderTasks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  })
}


// Displays an array of tasks to the DOM
function renderTasks(tasks) {
  $('#toDoList').empty();

  for(let i = 0; i < tasks.length; i += 1) {
    let task = tasks[i];
    // For each task, append a new row to our table
    let $tr = $('<tr></tr>');
    $tr.append(`<td colspan="2" class="align-middle">${task.task}</td>`);
    if(task.completed=== 'N'){
      $tr.append(`<td><button class="editTask btn btn-outline-warning btn-block" data-id="${task.id}">Edit</button></td>`);
      $tr.append(`<td><button class="doTask btn btn-outline-success btn-block" data-id="${task.id}">Complete</button></td>`);
    }
    else{
      $tr.addClass('table-success');
      $tr.append(`<td><button class="editTask btn btn-outline-warning btn-block" data-id="${task.id}">Edit & Reset</button></td>`);
      $tr.append(`<td><button class="doTask btn btn-outline-success btn-block" data-id="${task.id}" disabled>Complete</button></td>`);
    }
    $tr.append(`<td><button class="deleteTask btn btn-outline-danger btn-block" data-id="${task.id}" >Delete</button></td>`);
    $('#toDoList').append($tr);
  }
}

function doTask(){
  let taskId = $(this).data("id");

  $.ajax({
      type: 'PUT',
      url: `/tasks/${taskId}`
    })
    .then((response) => {
      console.log("complete success");
      refreshTasks();
    })
    .catch((err) => {
      console.log("complete failed", err);
    })
}


function deleteTask(){
  let taskId = $(this).data("id");
  if (confirm('Are you sure you want to delete this?')){
    $.ajax({
        type: 'DELETE',
        url: `/tasks/${taskId}`
      })
      .then((response) => {
        console.log("delete success");
        refreshTasks();
      })
      .catch((err) => {
        console.log("delete failed", err);
      })
  }else{

  }
}

function editTask() {
  let taskId = $(this).data("id");
  
  $.ajax({
      type: 'GET',
      url: `/tasks/${taskId}`
    })
    .then((response) => {
      taskToEdit = response;
      console.log("editStart success", taskToEdit);
      $('#task').val(`${taskToEdit[0].task}`);
      $('#buttonsDiv').empty();
      $('#buttonsDiv').append(`
      <button type="button" id="editBtn" class="btn btn-outline-success mt-n1">Edit</button>
      <button type="button" id="undoBtn" class="btn btn-outline-danger mt-n1">Cancel</button>
      `);
      $('#taskAddHeading').empty();
      $('#taskAddHeading').append(`<h3>Edit Task: ${taskToEdit[0].task} </h3>`);
    })
    .catch((err) => {
      console.log("editStart failed", err);
    });

}

function editTaskSubmit(){
  let taskId = taskToEdit[0].id;
  let task = {};
  task.task = $('#task').val();
  
  console.log(task);
  console.log(taskId);
  
  $.ajax({
      type: 'PUT',
      url: `/tasks/edit/${taskId}`,
      data: task
    })
    .then((response) => {
      console.log("edit end success");
      resetInput();
      refreshTasks();
    })
    .catch((err) => {
      console.log("edit end failed", err);
    })
}

function undoBtn() {
  console.log('undoBtn');
  resetInput();
}

function resetInput(){
  $('#buttonsDiv').empty();
  $('#task').val(``);
  $('#taskAddHeading').empty();
  $('#taskAddHeading').append(`<h3>Add New Task</h3>`);
  $('#buttonsDiv').append(`
  <button type="button" id="submitBtn" class="btn btn-outline-primary mt-n1">Submit</button>`);
}

