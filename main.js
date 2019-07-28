// Global Variables
var taskArray = [];

// Document Query Selector
var header = document.querySelector('#header')
var nav =  document.querySelector('.nav');
var container = document.querySelector('.card__holder');
var listContainer = document.querySelector('.list__container');

//Event Listeners
window.addEventListener('load', repopulate);
header.addEventListener('keyup', headerKeyupHandler);
nav.addEventListener('click', navClickHandler);
nav.addEventListener('keyup', navKeyupHandler);
container.addEventListener('click', containerClickHandler);

//Event Handler Functions
function headerKeyupHandler(e) {
  if (e.target.id === 'search-input'){
    searchArticles();
  };
};

function navClickHandler(e) {
  e.preventDefault();
  
  if (e.target.id === 'add-task-btn') {
    addTaskToNav();
    toggleMakeTaskBtn();
  };
  
  if (e.target.id === 'make-task-btn') {
    makeTaskList();
    removeNavLi();
    clearTaskItem();
    clearTaskTitle();
  };

  if (e.target.id === 'clear-btn'){
    clearNav();
  };
};

function navKeyupHandler(e) {
 if (e.target.id === 'task-title-input'  ||  e.target.id === 'task-item-input')
  toggleMakeTaskBtn();
};

function containerClickHandler(e) {
  e.preventDefault()

  if (e.target.classList.contains('article__li--checkbox')) {
    checkBox(e);
  };

  if (e.target.classList.contains('article__input--btn')){
    makeUrgent(e);
  };
};

// Other Functions
function repopulate() {
  initialTaskArray();
  persistOnLoad();
};



function persistOnLoad() {
  taskArray.forEach(function(taskList) {
   displayToDo(taskList);
  });
};

function makeUrgent(e) {
  var index = getToDoListId(e)
  console.log(index)
  console.log(document.querySelector(`#js-urg-${getToDoListId(e)}`))
  e.target.closest('article').classList.toggle('urgent');
  e.target.closest('footer').classList.toggle('ulUrgentBorder');
  e.target.parentNode.parentNode.parentNode.childNodes[1].classList.toggle('urgentHeader');
  e.target.parentNode.childNodes[3].classList.toggle('urgentTxt');

  if (e.target.closest('article').classList.contains('urgent')){
    document.querySelector(`#js-urg-${getToDoListId(e)}`).src = 'images/urgent-active.svg';
  } else {
    document.querySelector(`#js-urg-${getToDoListId(e)}`).src = 'images/urgent.svg';
  };
};


function checkBox(e) {
  if (e.target.src.includes('images/checkbox.svg')) {
    e.target.src = 'images/checkbox-active.svg';
    e.target.parentNode.childNodes[1].classList.add('checked');
    toggleObjCheck(e)
  } else {
    e.target.src = 'images/checkbox.svg';
    e.target.parentNode.childNodes[1].classList.remove('checked');
    toggleObjCheck(e)
  };
};


// REFACTOR THIS CRAP

function toggleObjCheck(e) {
  taskArray.forEach(function(toDoList){
    toDoList.tasksList.forEach(function(task){
      if (parseInt(task.taskId) === getTaskId(e)) {
        task.checked = !task.checked;
        taskArray[0].saveToStorage(taskArray);
      };
    });
  });
  toggleDelete(e)
};

// REALLY THAT UP THERE IS CRAP
// Pull the index of the toDoList
// only go through that toDoList
function toggleDelete(e) {
  var deletBtnDisable = false;
  var index = getToDoIndex(e);

  taskArray[index].tasksList.forEach(function(ToDo){
    if(!ToDo.checked){
      deletBtnDisable = true;
    };
  });

  document.querySelector(`#js-del-${getToDoListId(e)}`).disabled = deletBtnDisable;
  
};

function getToDoIndex(e) {
  return taskArray.findIndex(ToDo => ToDo.id === getToDoListId(e));
};

function getTaskId(e) {
  return parseInt(e.target.closest('li').id);
};

function getToDoListId(e) {
 return parseInt(e.target.closest('article').id);
}


function displayToDo(toDoList) {
  var urgent;
  var ugrentClass;
  container.insertAdjacentHTML(
    "afterbegin",
    `<article class="container__article" data-id="${toDoList.id}" id="${toDoList.id}">
      <header class="article__header--title">
        <h3 class="">${toDoList.title}</h3>
      </header>
      <!-- List inserts under here -->
      <ul class="article__ul" id="ul${toDoList.id}"> 
        <!-- insert li list -->
        ${liList(toDoList)}
      </ul>
      <footer class="article__footer bottom--crd--stn">
        <div class="article__div--urgent">
          <input type="image" src="images/urgent.svg" id="js-urg-${toDoList.id}" class="article__input--btn article__urgent">
          <p class="article__footer--text">URGENT</p>
        </div>
        <div class="article__div--delete">
          <input type="image" src="images/delete.svg" id="js-del-${toDoList.id}" class="article__input--btn article__delete" disabled>
          <p class="article__footer--text">DELETE</p>
        </div>
      </footer>
    </article>`
  );
};

function liList(taskList) {
  var checked;
  var fontStyle;
  var liForList = '';
  taskList.tasksList.forEach(function(li) {
    li.checked ? (checked = 'checkbox-active.svg', fontStyle = 'checked') : (checked = 'checkbox.svg', fontStyle = '');
    liForList = liForList + `<li id="${li.taskId}"><input type="image" class="article__li--checkbox" src="images/${checked}"><p class="${fontStyle}">${li.taskText}<p></li>`
  });
  return liForList;
};

function initialTaskArray() {
  if (JSON.parse(localStorage.getItem('tasks')) === null) {
    taskArray = [];
  } else {
    taskArray = JSON.parse(localStorage.getItem('tasks')).map(element => new ToDo(element));
  };
};



function makeTaskList() {
  var tasksList = getTasksFromNav();
  var todoList = new ToDo({id:Date.now(),
                           title: document.querySelector('#task-title-input').value,
                           tasksList: tasksList,
                           urgernt: false,
                          });
  taskArray.push(todoList);
  displayToDo(todoList);
  todoList.saveToStorage(taskArray);

};

function getTasksFromNav(){
  var taskList = [];
  var tasksOnNav = document.querySelectorAll('.nav__li');
  tasksOnNav.forEach(function(li){
    taskList.push({taskId: li.id,
                   taskText: li.innerText,
                   checked: false,
                  });
    });
  return taskList; 

};

function toggleMakeTaskBtn() {
  if (document.querySelector('#task-title-input').value !== '' && listContainer.innerHTML !== ''){
    document.querySelector('#make-task-btn').classList.remove('disabled');
    document.querySelector('#make-task-btn').disabled = false;
  } else {
    document.querySelector('#make-task-btn').classList.add('disabled');
    document.querySelector('#make-task-btn').disabled = true;
  }; 
};

function removeNavLi() {
  document.querySelector('.list__container').innerHTML = '';
};

function clearTaskTitle() {
  document.querySelector('#task-title-input').value = '';
};

function addTaskToNav() {
  if (document.querySelector('#task-item-input').value !== ''){
    var taskId = Date.now();
    makeNavTask(taskId);
    clearTaskItem();
  };  
};

function makeNavTask(taskId) {
  listContainer.insertAdjacentHTML('beforeend',
    `<li class="nav__li" data-id="${taskId}" id="${taskId}">
        <input type='image' src='images/delete.svg' class='nav__li--delete'>
        <p class='nav__li--text'>${document.querySelector('#task-item-input').value}</p>
      </li>`);
};

function clearTaskItem() {
  document.querySelector('#task-item-input').value = '';
};

function clearNav() {
  removeNavLi();
  clearTaskTitle();
  clearTaskItem();
  toggleMakeTaskBtn()
};
