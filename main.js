// Global Variables
var taskArray = JSON.parse(localStorage.getItem('tasks')) || [];

// Document Query Selector
var header = document.querySelector('#header')
var nav =  document.querySelector('.nav');
var container = document.querySelector('.card__holder');
var listContainer = document.querySelector('.list__container');

//Event Listeners
header.addEventListener('keyup', headerKeyupHandler);
header.addEventListener('click', headerClickHandler);
nav.addEventListener('click', navClickHandler);
nav.addEventListener('keyup', navKeyupHandler);
container.addEventListener('click', containerClickHandler);

//Functions
function headerKeyupHandler(e) {

};

function headerClickHandler(e) {
  e.preventDefault()
};

function navClickHandler(e) {
  e.preventDefault()
  if (e.target.id === 'add-task-btn'){
    addTaskToNav()
    clearTaskItem()
  }
};

function navKeyupHandler(e) {

};

function containerClickHandler(e) {
  e.preventDefault()
};

function addTaskToNav(){
  // e.preventDefault()
  var taskId = Date.now();
  makeTask(taskId);
};

function makeTask(taskId) {
  listContainer.insertAdjacentHTML('beforeend',
    `<li class="nav__li" data-id="${taskId}" id="${taskId}">
        <input type='image' src='images/delete.svg' class='nav__li--delete'>
        <p class='nav__li--text'>${document.querySelector('#task-item-input').value}</p>
      </li>`);
};

function clearTaskItem() {
  document.querySelector('#task-item-input').value = '';
};


function makeTaskList(){

};

