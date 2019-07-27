// Global Variables
var taskArray = JSON.parse(localStorage.getItem('tasks')) || [];

// Document Query Selector
var header = document.querySelector('#header')
var nav =  document.querySelector('.nav');
var container = document.querySelector('.card__holder');
var listContainer = document.querySelector('.list__container');

//Event Listeners
header.addEventListener('keyup', headerKeyupHandler);
nav.addEventListener('click', navClickHandler);
nav.addEventListener('keyup', navKeyupHandler);
container.addEventListener('click', containerClickHandler);

//Functions
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


function makeTaskList() {

};

function navKeyupHandler(e) {
 if (e.target.id === 'task-title-input'  ||  e.target.id === 'task-item-input')
  toggleMakeTaskBtn()
};

function containerClickHandler(e) {
  e.preventDefault()
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
}

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
