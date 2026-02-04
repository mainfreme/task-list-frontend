import React from 'react';
import TaskItem from './task/TaskItem';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask, selectedTaskId, onTaskSelect }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-muted">Nie znaleziono zadań</h4>
        <p className="text-muted">Dodaj swoje pierwsze zadanie za pomocą przycisku powyżej!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h4 className="mb-3 fw-bold">Twoje Zadania ({tasks.length})</h4>
      <div className="task-items-container">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={selectedTaskId === task.id}
            onSelect={onTaskSelect}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;