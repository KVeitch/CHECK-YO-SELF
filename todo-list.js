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
 
  updateTask(tasksArray, taskIndex){
    console.log('in upTask')
    this.tasksList[taskIndex].checked = !this.tasksList[taskIndex].checked;
    this.saveToStorage(tasksArray);
  };

  updateToDo(tasksArray){
    console.log('inToDo')
    this.urgent = !this.urgent
    this.saveToStorage(tasksArray)
  };

}