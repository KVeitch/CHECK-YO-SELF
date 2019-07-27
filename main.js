var taskArray = JSON.parse(localStorage.getItem('tasks')) || [];


var header = document.querySelector('#header')
var nav =  document.querySelector('.nav');
var container = document.querySelector('.card__holder');

header.addEventListener('keyup', headerHandler);
nav.addEventListener('click', navClickHandler);
nav.addEventListener('keyup', navKeyupHandler);
container.addEventListener('click', containerClickHandler);


function headerHandler(e) {

};

function navClickHandler(e) {

};

function navKeyupHandler(e) {

}

function containerClickHandler(e) {

};