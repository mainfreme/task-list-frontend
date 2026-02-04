import React, { useState, useEffect, useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Play, Pause, Calendar, Trash2, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

const priorityColors = {
    niski: 'border-primary',
    średni: 'border-warning',
    wysoki: 'border-danger',
};

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

export default function TaskItem({ task, isSelected, onSelect, onUpdate, onDelete }) {
    const [isTiming, setIsTiming] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleToggleTimer = (e) => {
        e.stopPropagation();
        if (isTiming) { // Pauzowanie
            clearInterval(intervalRef.current);
            const newTotalTime = (task.time_tracked || 0) + elapsedTime;
            onUpdate(task.id, { time_tracked: newTotalTime });
            setElapsedTime(0);
            setIsTiming(false);
        } else { // Startowanie
            if (task.status === 'do_zrobienia') {
                onUpdate(task.id, { status: 'w_trakcie' });
            }
            setIsTiming(true);
            intervalRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
    };

    const handleMarkAsDone = (e) => {
        e.stopPropagation();
        if(isTiming) {
            clearInterval(intervalRef.current);
            const newTotalTime = (task.time_tracked || 0) + elapsedTime;
            onUpdate(task.id, { status: 'zrobione', time_tracked: newTotalTime });
            setElapsedTime(0);
            setIsTiming(false);
        } else {
            onUpdate(task.id, { status: 'zrobione' });
        }
    };

    const isDone = task.status === 'zrobione';
    const totalTrackedTime = (task.time_tracked || 0) + elapsedTime;

    return (
        <Card
            onClick={() => onSelect && onSelect(task)}
            className={`mb-2 border-0 border-start border-4 shadow-sm task-item-card ${priorityColors[task.priority || 'średni']} ${isSelected ? 'bg-primary bg-opacity-10' : 'bg-white'}`}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
        >
            <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                    <div className="flex-grow-1 min-w-0">
                        <p className={`mb-0 fw-bold text-truncate ${isDone ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                            {task.title}
                        </p>
                        <div className="d-flex align-items-center gap-3 mt-1 text-muted small" style={{ fontSize: '0.75rem' }}>
                            {task.due_date && (
                                <div className="d-flex align-items-center gap-1">
                                    <Calendar size={12} />
                                    <span>{format(new Date(task.due_date), 'd MMM', { locale: pl })}</span>
                                </div>
                            )}
                            <div className="d-flex align-items-center gap-1">
                                <Clock size={12} />
                                <span className={isTiming ? 'text-primary fw-bold' : ''}>
                                    {formatTime(totalTrackedTime)}
                                </span>
                            </div>
                            {task.assigned_to && (
                                <div className="d-flex align-items-center gap-1">
                                    <div className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: '16px', height: '16px', fontSize: '10px' }}>
                                        {task.assigned_to[0].toUpperCase()}
                                    </div>
                                    <span>{task.assigned_to}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-1 ms-2">
                        {!isDone && (
                            <>
                                <Button 
                                    variant="link" 
                                    className="p-1 text-decoration-none" 
                                    onClick={handleToggleTimer}
                                    title={isTiming ? "Pauza" : "Start"}
                                >
                                    {isTiming ? <Pause size={18} className="text-warning" /> : <Play size={18} className="text-success" />}
                                </Button>
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
