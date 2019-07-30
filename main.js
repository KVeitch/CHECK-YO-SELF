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
  }
  
  if (e.target.id === 'make-task-btn') {
    makeTaskList();
    removeNavLi();
    clearTaskItem();
    clearTaskTitle();
    toggleMakeTaskBtn();
    toggleClearAllBtn();
  }

  if (e.target.id === 'clear-btn'){
    clearNav();
  }

  if (e.target.classList.contains('nav__li--delete')){
    removeLi(e);
  }

  if (e.target.id === 'urgent-btn'){
    toggleUrgentBtn();
  }
}

function navKeyupHandler(e) {
  e.preventDefault()

  if (e.target.id === 'task-title-input'  ||  e.target.id === 'task-item-input') {
    toggleMakeTaskBtn();
    toggleClearAllBtn();
  }

  // if(e.key === 'Enter') {
  //   keepTyping(e);
  // }
}

function containerClickHandler(e) {
  e.preventDefault();

  if (e.target.classList.contains('article__li--checkbox')) {
    checkBox(e);
  }

  if (e.target.classList.contains('article__input--btn')){
    makeUrgent(e);
  }

  if (e.target.classList.contains('article__delete')){
    removeArticle(e);
  }
}

// Other Functions
function repopulate() {
  initializeTaskArray();
  persistOnLoad();
  injectIntroMessage();
}

function initializeTaskArray() {
  if (JSON.parse(localStorage.getItem('tasks')) === null) {
    taskArray = [];
  } else {
    taskArray = JSON.parse(localStorage.getItem('tasks')).map(element => new ToDo(element));
  };
};

function persistOnLoad() {
  taskArray.forEach(function(taskList) {
   displayToDo(taskList);
  });
}

function injectIntroMessage() {
  if (container.innerHTML === ''){
    container.insertAdjacentHTML('afterbegin', `<h2 id="js-h2">Please CHECK YO' SELF</h2>`);
  }
}

function addTaskToNav() {
  if (document.querySelector('#task-item-input').value !== ''){
    var taskId = Date.now();
    makeNavTask(taskId);
    clearTaskItem();
    document.querySelector('#task-item-input').focus();
  } 
}

function toggleMakeTaskBtn() {
  if (document.querySelector('#task-title-input').value !== '' && listContainer.innerHTML !== ''){
    document.querySelector('#make-task-btn').classList.remove('disabled');
    document.querySelector('#make-task-btn').disabled = false;
  } else {
    document.querySelector('#make-task-btn').classList.add('disabled');
    document.querySelector('#make-task-btn').disabled = true;
  }
}

function toggleUrgentBtn() {
  if (document.querySelector('#urgent-btn').classList.includes('urgentBtnActive')){
    document.querySelector('#urgent-btn').classList.remove('urgentBtnActive');
    clearContainer();
    persistOnLoad();
    injectIntroMessage();
  } else {
    document.querySelector('#urgent-btn').classList.add('urgentBtnActive');
    filterByUrgent();
  }
}

function filterByUrgent() {
  urgentArray = [];
  urgentArray = taskArray.filter(function(toDoObj) {
    return toDoObj.urgent === true;
  });

  clearContainer();

  urgentArray.forEach(toDoObj => displayToDo(toDoObj));
  displayUrgentMsg(urgentArray);
}

function displayUrgentMsg(urgentArray){
  if (urgentArray.length === 0){
    container.insertAdjacentHTML('afterbegin', `<h2 id="js-h2">Please mark a list as URGENT</h2>`);
  }
}

function removeIntro() {
  var element = document.getElementById('js-h2');

  if (element) {
    element.parentNode.removeChild(element);
  }

  injectIntroMessage();  
}

// function keepTyping(e) {
//   e.preventDefault();
//   addTaskToNav();
//   focus(e.target);
// }

function removeArticle(e){
  taskArray[getToDoIndex(e)].deleteFromStorage(taskArray, getToDoIndex(e));
  e.target.closest('article').remove();
  injectIntroMessage();
}

function removeLi(e) {
  e.target.closest('li').remove();
  toggleMakeTaskBtn();
}


function makeUrgent(e) {
  toggleUrgentStyle(e);

  if (e.target.closest('article').classList.contains('urgent')){
    document.querySelector(`#js-urg-${getToDoListId(e)}`).src = 'images/urgent-active.svg';
  } else {
    document.querySelector(`#js-urg-${getToDoListId(e)}`).src = 'images/urgent.svg';
  }

  taskArray[getToDoIndex(e)].updateToDo(taskArray);
}

function toggleUrgentStyle(e) {
  e.target.closest('article').classList.toggle('urgent');
  e.target.closest('footer').classList.toggle('ulurgentBorder');
  document.querySelector(`#js-header-${getToDoListId(e)}`).classList.toggle('urgentHeader');
  document.querySelector(`#js-urg-txt-${getToDoListId(e)}`).classList.toggle('urgentTxt');
  document.querySelector(`#js-ul-${getToDoListId(e)}`).classList.toggle('ulurgentBorder');
}

function checkBox(e) {
  if (e.target.src.includes('images/checkbox.svg')) {
    e.target.src = 'images/checkbox-active.svg';
    document.querySelector(`#js-p-${getTaskId(e)}`).classList.add('checked');
  } else {
    e.target.src = 'images/checkbox.svg';
    document.querySelector(`#js-p-${getTaskId(e)}`).classList.remove('checked');
  }

  toggleObjCheck(e);
}

function getTaskListIndex(e){
  var taskIndex = taskArray[getToDoIndex(e)].tasksList.findIndex(task => {
    return parseInt(task.taskId) === getTaskId(e)
  });

  return taskIndex;
}

function toggleObjCheck(e) {
  var taskIndex = getTaskListIndex(e);

  taskArray[getToDoIndex(e)].updateTask(taskArray, taskIndex);
  toggleDelete(e);
}

function toggleDelete(e) {
  var deleteBtnDisable = false;
  var index = getToDoIndex(e);
  var delImg;
  taskArray[index].tasksList.forEach(function(ToDo){
    if(!ToDo.checked){
      deleteBtnDisable = true;
    };
  });

  deleteBtnDisable ? delImg = 'images/delete.svg' : delImg = 'images/delete-active.svg';
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
  var active;
  var disabledTgl;
  var delTxt;
  toDoList.urgent ? (active = '-active',urgent = 'urgent' ): (active = '', urgent = '')

  toDoList.tasksList.forEach(function(ToDo){
    if(!ToDo.checked){
      disabledTgl = 'disabled';
    };
  });
   
  disabledTgl === 'disabled' ? delImg = 'images/delete.svg' : (delTxt = 'urgentTxt', delImg = 'images/delete-active.svg');
  
  container.insertAdjacentHTML(
    "afterbegin",
    `<article class="container__article ${urgent}" data-id="${toDoList.id}" id="${toDoList.id}">
      <header class="article__header--title ${urgent}Header" id="js-header-${toDoList.id}">
        <h3 class="" id="js-h3-${toDoList.id}">${toDoList.title}</h3>
      </header>
      <!-- List inserts under here -->
      <ul class="article__ul ul${urgent}Border" id="js-ul-${toDoList.id}"> 
        <!-- insert li list -->
        ${liList(toDoList)}
      </ul>
      <footer class="article__footer ul${urgent}Border bottom--crd--stn">
        <div class="article__div--urgent">
          <input type="image" src="images/urgent${active}.svg" id="js-urg-${toDoList.id}" class="article__input--btn article__urgent">
          <p class="article__footer--text ${urgent}Txt" id="js-urg-txt-${toDoList.id}">URGENT</p>
        </div>
        <div class="article__div--delete">
          <input type="image" src="${delImg}" id="js-del-${toDoList.id}" class="article__input--btn article__delete" ${disabledTgl}>
          <p class="article__footer--text ${delTxt}" id="js-del-txt-${toDoList.id}">DELETE</p>
        </div>
      </footer>
    </article>`
  );
};

function liList(listObj) {
  var checked;
  var fontStyle;
  var liForList = '';

  listObj.tasksList.forEach(function(li) {
    li.checked ? (checked = 'checkbox-active.svg', fontStyle = 'checked') : (checked = 'checkbox.svg', fontStyle = '');
    liForList = liForList + `<li id="${li.taskId}"><input type="image" class="article__li--checkbox" src="images/${checked}"><p class="${fontStyle}" id=js-p-${li.taskId}>${li.taskText}<p></li>`
  });

  return liForList;
};

function makeTaskList() {
  var tasksList = getTasksFromNav();
  var todoList = new ToDo({id:Date.now(),
                           title: document.querySelector('#task-title-input').value,
                           tasksList: tasksList,
                           urgent: false,
                          });

  taskArray.push(todoList);
  todoList.saveToStorage(taskArray);
  displayToDo(todoList);
  removeIntro();
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
}

function removeNavLi() {
  document.querySelector('.list__container').innerHTML = '';
}

function clearTaskTitle() {
  document.querySelector('#task-title-input').value = '';
}

function clearTaskItem() {
  document.querySelector('#task-item-input').value = '';
}

function clearContainer() {
  document.querySelector('container').innerHTML = '';
}

function populateContainer(){
  clearContainer();
  searchArticles().forEach(element => displayToDo(element));
}

function searchArticles() {
  var searchedArray = [];
  if (!document.querySelector('#urgent-btn').classList.includes('urgentBtnActive')){
    searchedArray = taskArray.filter(function(ToDoObj) {
      return ToDoObj.title.toLowerCase().includes(document.querySelector('#search-input').value.toLowerCase()) 
       || ToDoObj.title.toLowerCase().includes(document.querySelector('#search-input').value.toLowerCase());
    });

    return searchedArray;

  } else {
        searchedArray = taskArray.filter(function(ToDoObj) {
      return (ToDoObj.title.toLowerCase().includes(document.querySelector('#search-input').value.toLowerCase()) 
       || ToDoObj.title.toLowerCase().includes(document.querySelector('#search-input').value.toLowerCase())) && ToDoObj.urgent;
    });

    return searchedArray;
  }
}

function makeNavTask(taskId) {
  listContainer.insertAdjacentHTML('beforeend',
    `<li class="nav__li" data-id="${taskId}" id="${taskId}">
        <input type='image' src='images/delete.svg' class='nav__li--delete'>
        <p class='nav__li--text'>${document.querySelector('#task-item-input').value}</p>
      </li>`);
}

function clearNav() {
  removeNavLi();
  clearTaskTitle();
  clearTaskItem();
  toggleMakeTaskBtn();
  toggleClearAllBtn();
}

function toggleClearAllBtn() {
  if (document.querySelector('#task-item-input').value !== ''
       || document.querySelector('#task-title-input').value !== '' 
       || listContainer.innerHTML !== '') {
    document.querySelector('#clear-btn').disabled = false;
    document.querySelector('#clear-btn').classList.remove('disabled');
  } else {
    document.querySelector('#clear-btn').disabled = true;
    document.querySelector('#clear-btn').classList.add('disabled');
  }
}



