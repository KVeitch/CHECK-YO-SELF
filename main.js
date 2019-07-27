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

function containerClickHandler(e) {
  e.preventDefault()
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

function displayToDo(taskList) {
  var urgent;
  var ugrentClass;
  container.insertAdjacentHTML(
    "afterbegin",
    `<article class="container__article" data-id="${taskList.id}" id="${taskList.id}">
      <header class="article__header--title">
        <h3 class="">${taskList.title}</h3>
      </header>
      <!-- List inserts under here -->
      <ul class="crd--ul" id="" data-id=""> 
        <li>Card pop</li>                        
      </ul>
      <footer class="article__footer bottom--crd--stn">
        <div class="article__div--urgent">
          <input type="image" src="images/urgent.svg" id="btn--urgent" class="article__input--btn article__urgent">
          <p class="article__footer--text">URGENT</p>
        </div>
        <div class="article__div--delete">
          <input type="image" src="images/delete.svg" id="btn--delete" class="article__input--btn article__delete" disabled="">
          <p class="article__footer--text">DELETE</p>
        </div>
      </footer>
    </article>`
  );
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
  taskArray.push(todoList)
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
