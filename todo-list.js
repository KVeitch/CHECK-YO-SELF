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

  deleteFromStorage(tasksArray, index){
    tasksArray.splice(index,1);
    this.saveToStorage(tasksArray)
  };
 
  updateTask(storageArray){
    this.saveToStorage(storageArray)
  };

  updateTask(tasksArray){
    this.saveToStorage(tasksArray)
  };

}