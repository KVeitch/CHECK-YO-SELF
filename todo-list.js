class ToDo {
  constructor(toDoObj){
    this.id = toDoObj.id || Date.now();
    this.title = toDoObj.title;
    this.urgent = toDoObj.urgent || false;
    this.tasksList = toDoObj.tasksList || [];
  }
  
  saveToStorage(tasksArray){
    localStorage.setItem('tasks', JSON.stringify(taskArray))
  };

  deleteFromStorage(tasksArray){

    this.saveToStorage(tasksArray)
  };
 
  updateToDo(tasksArray){

    this.saveToStorage(tasksArray)
  };

  updateTask(tasksArray){
    
    this.saveToStorage(tasksArray)
  };

}