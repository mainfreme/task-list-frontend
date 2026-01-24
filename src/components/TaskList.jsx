import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-muted">No tasks found</h4>
        <p className="text-muted">Add your first task using the form above!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h3 className="mb-3">Your Tasks ({tasks.length})</h3>
      <div className="list-group">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;