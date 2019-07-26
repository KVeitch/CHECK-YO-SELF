class ToDo {
  constructor(toDoObj){
    this.id = toDoObj.id || Date.now();
    this.title = toDoObj.title;
    this.urgent = toDoObj.urgent || false;
    this.tasks = toDoObj.tasks || [];
  }
  
  saveToStorage(){};

  deleteFromStorage(){};

  updateToDo(){};

  updateTask(){};

}