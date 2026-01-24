import React, { useState } from 'react';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleToggleComplete = async () => {
    await onUpdate(task.id, {
      ...task,
      completed: !task.completed
    });
  };

  const handleEdit = async () => {
    if (isEditing) {
      await onUpdate(task.id, {
        ...task,
        title: editTitle,
        description: editDescription
      });
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDelete(task.id);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  return (
    <div className={`list-group-item task-item ${task.completed ? 'task-completed' : ''}`}>
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          {isEditing ? (
            <div className="mb-2">
              <input
                type="text"
                className="form-control mb-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
              />
              <textarea
                className="form-control"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Task description (optional)"
                rows="2"
              />
            </div>
          ) : (
            <div>
              <h5 className={`task-title mb-1 ${task.completed ? 'text-decoration-line-through' : ''}`}>
                {task.title}
              </h5>
              {task.description && (
                <p className="text-muted mb-1">{task.description}</p>
              )}
              <small className="text-muted">
                Created: {new Date(task.created_at || Date.now()).toLocaleDateString()}
              </small>
            </div>
          )}
        </div>

        <div className="ms-3">
          {isEditing ? (
            <div className="btn-group">
              <button
                className="btn btn-sm btn-success"
                onClick={handleEdit}
                disabled={!editTitle.trim()}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={handleToggleComplete}
              >
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;