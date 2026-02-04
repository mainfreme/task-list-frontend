import React from 'react';
import { Card } from 'react-bootstrap';
import { ExternalLink, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from './common/Badge';

const statusConfig = {
    nowe: { color: 'danger', label: 'Nowe' },
    przeczytane: { color: 'warning', label: 'Przeczytane' },
    zakonczone: { color: 'success', label: 'Zakończone' }
};

export default function ApiTaskList({ tasks, onTaskSelect }) {
    return (
        <div className="api-task-list">
            <AnimatePresence>
                {tasks.map(task => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                        className="mb-3"
                    >
                        <Card 
                            className="border-0 shadow-sm border-start border-4 border-primary cursor-pointer hover-shadow"
                            onClick={() => onTaskSelect(task)}
                            style={{ cursor: 'pointer', transition: 'box-shadow 0.2s ease-in-out' }}
                        >
                            <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            {task.status === 'nowe' && (
                                                <Bell className="text-danger animate-pulse" size={16} />
                                            )}
                                            <h6 className="mb-0 fw-bold text-dark">{task.title}</h6>
                                        </div>
                                        
                                        <a 
                                            href={task.source_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-none text-primary small d-flex align-items-center gap-1 mb-2"
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ fontSize: '0.75rem' }}
                                        >
                                            <ExternalLink size={12} />
                                            {task.source_url}
                                        </a>
                                        
                                        <p className="text-muted mb-0 small" style={{ fontSize: '0.7rem' }}>
                                            {task.created_date ? format(new Date(task.created_date), 'd MMM yyyy, HH:mm', { locale: pl }) : 'Brak daty'}
                                        </p>
                                    </div>
                                    
                                    <Badge 
                                        color={statusConfig[task.status]?.color || 'secondary'} 
                                        pill
                                    >
                                        {statusConfig[task.status]?.label || task.status}
                                    </Badge>
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {tasks.length === 0 && (
                <div className="text-center py-5 text-muted">
                    <p className="mb-0">Brak zadań z API</p>
                </div>
            )}
        </div>
    );
}
