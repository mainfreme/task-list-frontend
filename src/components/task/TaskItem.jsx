import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Calendar, Trash2, Check, MapPin, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import ApiService from '../../services/ApiService';

// Status colors based on Swagger status values
const statusColors = {
    pending: 'border-warning',
    in_progress: 'border-primary',
    completed: 'border-success',
    cancelled: 'border-secondary',
};

export default function TaskItem({ task, isSelected, onSelect, onUpdate, onDelete }) {
    const handleMarkAsDone = async (e) => {
        e.stopPropagation();
        try {
            await ApiService.updateTaskStatus(task.id, 'completed');
            onUpdate(task.id, { status: 'completed' });
        } catch (error) {
            console.error('Error marking task as done:', error);
        }
    };

    const handleStartProgress = async (e) => {
        e.stopPropagation();
        if (task.status === 'pending') {
            try {
                await ApiService.updateTaskStatus(task.id, 'in_progress');
                onUpdate(task.id, { status: 'in_progress' });
            } catch (error) {
                console.error('Error starting task:', error);
            }
        }
    };

    const isDone = task.status === 'completed';
    const isCancelled = task.status === 'cancelled';

    return (
        <Card
            onClick={() => onSelect && onSelect(task)}
            className={`mb-2 border-0 border-start border-4 shadow-sm task-item-card ${statusColors[task.status] || 'border-warning'} ${isSelected ? 'bg-primary bg-opacity-10' : 'bg-white'}`}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
        >
            <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                    <div className="flex-grow-1 min-w-0">
                        <p className={`mb-0 fw-bold text-truncate ${isDone || isCancelled ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                            {task.title}
                        </p>
                        <div className="d-flex align-items-center gap-3 mt-1 text-muted small" style={{ fontSize: '0.75rem' }}>
                            {task.due_date && (
                                <div className="d-flex align-items-center gap-1">
                                    <Calendar size={12} />
                                    <span>{format(new Date(task.due_date), 'd MMM', { locale: pl })}</span>
                                </div>
                            )}
                            {task.website_url && (
                                <div className="d-flex align-items-center gap-1">
                                    <Globe size={12} />
                                    <span className="text-truncate" style={{ maxWidth: '100px' }}>
                                        {new URL(task.website_url).hostname}
                                    </span>
                                </div>
                            )}
                            {task.address && (
                                <div className="d-flex align-items-center gap-1">
                                    <MapPin size={12} />
                                    <span className="text-truncate" style={{ maxWidth: '100px' }}>{task.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-1 ms-2">
                        {!isDone && !isCancelled && (
                            <>
                                {task.status === 'pending' && (
                                    <Button 
                                        variant="link" 
                                        className="p-1 text-decoration-none" 
                                        onClick={handleStartProgress}
                                        title="Rozpocznij"
                                    >
                                        <span className="badge bg-primary">Start</span>
                                    </Button>
                                )}
                                <Button 
                                    variant="link" 
                                    className="p-1 text-decoration-none" 
                                    onClick={handleMarkAsDone}
                                    title="Zakończ"
                                >
                                    <Check size={18} className="text-success" />
                                </Button>
                            </>
                        )}
                        <Button 
                            variant="link" 
                            className="p-1 text-decoration-none" 
                            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                            title="Usuń"
                        >
                            <Trash2 size={18} className="text-danger" />
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
