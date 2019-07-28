// Global Variables 
var taskArray = [];

// Document Query Selector
var header = document.querySelector('#header')
var nav =  document.querySelector('.nav');
var container = document.querySelector('.article__holder');
var listContainer = document.querySelector('.list__container');

//Event Listeners
window.addEventListener('load', repopulate);
header.addEventListener('keyup', populateContainer);
nav.addEventListener('click', navClickHandler);
nav.addEventListener('keyup', navKeyupHandler);
container.addEventListener('click', containerClickHandler);

//Event Handler Functions
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
    toggleMakeTaskBtn()
  };

  if (e.target.id === 'clear-btn'){
    clearNav();
  };

  if (e.target.classList.contains('nav__li--delete' && e.key !== 'Enter')){
    removeLi(e);
  };
};

function navKeyupHandler(e) {
  if (e.target.id === 'task-title-input'  ||  e.target.id === 'task-item-input') {
    toggleMakeTaskBtn();
    toggleClearAllBtn()
  };

  if(e.key === 'Enter') {
    console.log('pressed');
    keepTyping(e);
  };
};

function containerClickHandler(e) {
  e.preventDefault()

  if (e.target.classList.contains('article__li--checkbox')) {
    checkBox(e);
  };

  if (e.target.classList.contains('article__input--btn')){
    makeUrgent(e);
  };

  if (e.target.classList.contains('article__delete')){
    removeArticle(e);
  };
};

// Other Functions
function repopulate() {
  initializeTaskArray();
  persistOnLoad();
  injectIntroMessage()
};

function injectIntroMessage() {
  if (container.innerHTML === ''){
    container.insertAdjacentHTML('afterbegin', `<h2 id="js-h2">Please CHECK YO' SELF</h2>`);
  } 
};

function removeIntro() {
  var element = document.getElementById('js-h2');

  if (element) {
    element.parentNode.removeChild(element);
  };

  injectIntroMessage()  
};

function keepTyping(e) {
  e.preventDefault();
  addTaskToNav();
};

function removeArticle(e){
  taskArray[getToDoIndex(e)].deleteFromStorage(taskArray, getToDoIndex(e));
  e.target.closest('article').remove();
  injectIntroMessage()
};

function removeLi(e) {
  e.target.closest('li').remove();
  toggleMakeTaskBtn()
};


function persistOnLoad() {
  taskArray.forEach(function(taskList) {
   displayToDo(taskList);
  });
};

function makeUrgent(e) {
  toggleUrgent(e);

  if (e.target.closest('article').classList.contains('urgent')){
    document.querySelector(`#js-urg-${getToDoListId(e)}`).src = 'images/urgent-active.svg';
    taskArray[getToDoIndex(e)].urgent = true;
  } else {
    document.querySelector(`#js-urg-${getToDoListId(e)}`).src = 'images/urgent.svg';
    taskArray[getToDoIndex(e)].urgent = false;
  };

  taskArray[0].saveToStorage(taskArray);
};

function toggleUrgent(e) {
  e.target.closest('article').classList.toggle('urgent');
  e.target.closest('footer').classList.toggle('ulUrgentBorder');
  document.querySelector(`#js-header-${getToDoListId(e)}`).classList.toggle('urgentHeader');
  document.querySelector(`#js-urg-txt-${getToDoListId(e)}`).classList.toggle('urgentTxt');
  document.querySelector(`#js-ul-${getToDoListId(e)}`).classList.toggle('ulUrgentBorder')
};

function checkBox(e) {
  if (e.target.src.includes('images/checkbox.svg')) {
    e.target.src = 'images/checkbox-active.svg';
    document.querySelector(`#js-p-${getTaskId(e)}`).classList.add('checked');
    toggleObjCheck(e)
  } else {
    e.target.src = 'images/checkbox.svg';
    document.querySelector(`#js-p-${getTaskId(e)}`).classList.remove('checked');
    toggleObjCheck(e)
  };
};

function toggleObjCheck(e) {
  taskArray[getToDoIndex(e)].tasksList.forEach(function(task){
    if (parseInt(task.taskId) === getTaskId(e)) {
      task.checked = !task.checked;
      taskArray[0].saveToStorage(taskArray);
    };
  });

  toggleDelete(e)
};

function toggleDelete(e) {
  var deleteBtnDisable = false;
  var index = getToDoIndex(e);
  var delImg;
  taskArray[index].tasksList.forEach(function(ToDo){
    if(!ToDo.checked){
      deleteBtnDisable = true;
    };
  });

  deleteBtnDisable ? delImg = 'images/delete.svg' : delImg = 'images/delete-active.svg'
  document.querySelector(`#js-del-${getToDoListId(e)}`).src = delImg;
  document.querySelector(`#js-del-${getToDoListId(e)}`).disabled = deleteBtnDisable; 
  deleteBtnDisable ? document.querySelector(`#js-del-txt-${getToDoListId(e)}`).classList.remove('urgentTxt')
  : document.querySelector(`#js-del-txt-${getToDoListId(e)}`).classList.add('urgentTxt'); 
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
      <header class="article__header--title" id="js-header-${toDoList.id}">
        <h3 class="" id="js-h3-${toDoList.id}">${toDoList.title}</h3>
      </header>
      <!-- List inserts under here -->
      <ul class="article__ul" id="js-ul-${toDoList.id}"> 
        <!-- insert li list -->
        ${liList(toDoList)}
      </ul>
      <footer class="article__footer bottom--crd--stn">
        <div class="article__div--urgent">
          <input type="image" src="images/urgent.svg" id="js-urg-${toDoList.id}" class="article__input--btn article__urgent">
          <p class="article__footer--text" id="js-urg-txt-${toDoList.id}">URGENT</p>
        </div>
        <div class="article__div--delete">
          <input type="image" src="images/delete.svg" id="js-del-${toDoList.id}" class="article__input--btn article__delete" disabled>
          <p class="article__footer--text" id="js-del-txt-${toDoList.id}">DELETE</p>
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
    liForList = liForList + `<li id="${li.taskId}"><input type="image" class="article__li--checkbox" src="images/${checked}"><p class="${fontStyle}" id=js-p-${li.taskId}>${li.taskText}<p></li>`
  });
  return liForList;
};

function initializeTaskArray() {
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
  todoList.saveToStorage(taskArray);
  displayToDo(todoList);
  removeIntro()
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

function clearTaskItem() {
  document.querySelector('#task-item-input').value = '';
};

function addTaskToNav() {
  if (document.querySelector('#task-item-input').value !== ''){
    var taskId = Date.now();
    makeNavTask(taskId);
    clearTaskItem();
  };  
};

function clearContainer() {
  document.querySelector('container').innerHTML = '';
};

function populateContainer(){
  clearContainer();
  searchArticles().forEach(element => displayToDo(element));

  // if (document.querySelector('#search-input').value === '') {
  //   clearContainer();
  //   var totalArray = qualitiesArray.concat([ideasArray]); 
  //   totalArray[getActiveFilter()].forEach(function(idea) {
  //    displayIdea(idea)
  //  });
  // };

}

function searchArticles() {
  searchedArray = taskArray.filter(function(ToDoObj) {
    return ToDoObj.title.toLowerCase().includes(document.querySelector('#search-input').value.toLowerCase()) 
     || ToDoObj.title.toLowerCase().includes(document.querySelector('#search-input').value.toLowerCase());
  });
  return searchedArray;
};

function makeNavTask(taskId) {
  listContainer.insertAdjacentHTML('beforeend',
    `<li class="nav__li" data-id="${taskId}" id="${taskId}">
        <input type='image' src='images/delete.svg' class='nav__li--delete'>
        <p class='nav__li--text'>${document.querySelector('#task-item-input').value}</p>
      </li>`);
};

function clearNav() {
  removeNavLi();
  clearTaskTitle();
  clearTaskItem();
  toggleMakeTaskBtn()
  toggleClearAllBtn()
};

function toggleClearAllBtn() {
  if (document.querySelector('#task-item-input').value !== ''
       || document.querySelector('#task-title-input').value !== '' 
       || listContainer.innerHTML !== '') {
    document.querySelector('#clear-btn').disabled = false;
    document.querySelector('#clear-btn').classList.remove('disabled')
  } else {
    document.querySelector('#clear-btn').disabled = true;
    document.querySelector('#clear-btn').classList.add('disabled')
  };
};



