import React, { useState, useEffect, useCallback } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TaskItem from '../components/task/TaskItem';
import TaskDetails from '../components/task/TaskDetails';
import TaskForm from '../components/task/TaskForm';
import { AnimatePresence, motion } from 'framer-motion';
import ApiService from '../services/ApiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../contexts/AuthContext';

export default function ManagerZadan() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { withAuthCheck, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const loadData = useCallback(async () => {
        setIsLoading(true);
        const result = await withAuthCheck(async () => {
            const response = await ApiService.getTasks();
            return response?.data || response || [];
        });
        
        if (result.success) {
            setTasks(Array.isArray(result.data) ? result.data : []);
            setError(null);
        } else {
            if (result.error?.includes('Session expired')) {
                navigate('/login');
                return;
            }
            setError('Błąd podczas pobierania zadań.');
        }
        setIsLoading(false);
    }, [withAuthCheck, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated, loadData]);

    const handleSelectTask = (task) => {
        setSelectedTask(task);
    };

    const handleUpdateTask = async (taskId, updates) => {
        const result = await withAuthCheck(async () => {
            return await ApiService.updateTask(taskId, updates);
        });
        
        if (result.success) {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...result.data } : t));
            if (selectedTask && selectedTask.id === taskId) {
                setSelectedTask(prev => ({ ...prev, ...result.data }));
            }
        } else {
            if (result.error?.includes('Session expired')) {
                navigate('/login');
                return;
            }
            setError('Błąd podczas aktualizacji zadania.');
        }
    };
    
    const handleDeleteTask = async (taskId) => {
        const result = await withAuthCheck(async () => {
            await ApiService.deleteTask(taskId);
            return true;
        });
        
        if (result.success) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
            if (selectedTask && selectedTask.id === taskId) {
                setSelectedTask(null);
            }
        } else {
            if (result.error?.includes('Session expired')) {
                navigate('/login');
                return;
            }
            setError('Błąd podczas usuwania zadania.');
        }
    };

    const handleSaveTask = async (formData) => {
        const result = await withAuthCheck(async () => {
            if (formData.id) {
                const { id, ...dataToUpdate } = formData;
                return await ApiService.updateTask(id, dataToUpdate);
            } else {
                return await ApiService.createTask(formData);
            }
        });
        
        if (result.success) {
            if (formData.id) {
                setTasks(prev => prev.map(t => t.id === formData.id ? { ...t, ...result.data } : t));
                if (selectedTask && selectedTask.id === formData.id) {
                    setSelectedTask(prev => ({ ...prev, ...result.data }));
                }
            } else {
                setTasks(prev => [result.data, ...prev]);
            }
            setShowForm(false);
            setEditingTask(null);
        } else {
            if (result.error?.includes('Session expired')) {
                navigate('/login');
                return;
            }
            setError('Błąd podczas zapisywania zadania.');
        }
    };

    const openEditForm = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    // Status names from Swagger: pending, in_progress, completed, cancelled
    const tasksToDo = tasks.filter(t => t.status === 'pending' || !t.status);
    const tasksInProgress = tasks.filter(t => t.status === 'in_progress');
    const tasksDone = tasks.filter(t => t.status === 'completed');
    const tasksCancelled = tasks.filter(t => t.status === 'cancelled');

    if (isLoading) {
        return <LoadingSpinner message="Ładowanie zadań..." />;
    }

    return (
        <div className="manager-zadan-container" style={{ height: 'calc(100vh - 80px)' }}>
            <AlertMessage type="danger" message={error} onClose={() => setError(null)} />
            
            <Row className="h-100 g-0 border rounded shadow-sm bg-white overflow-hidden">
                {/* Left Column: Task List */}
                <Col md={5} lg={4} className="border-end h-100 d-flex flex-column bg-light">
                    <div className="p-3 border-bottom bg-white sticky-top z-index-10">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">Zadania</h5>
                            <Button size="sm" onClick={() => { setEditingTask(null); setShowForm(true); }}>
                                <Plus size={16} className="me-1" />
                                Dodaj
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex-grow-1 overflow-y-auto p-3">
                        {/* Sekcja Do Zrobienia */}
                        <div className="mb-4">
                            <h6 className="text-muted text-uppercase extra-small fw-bold mb-3 d-flex justify-content-between">
                                Do zrobienia <span>{tasksToDo.length}</span>
                            </h6>
                            <div className="space-y-2">
                                <AnimatePresence mode="popLayout">
                                    {tasksToDo.map(task => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="mb-2"
                                        >
                                            <TaskItem 
                                                task={task} 
                                                isSelected={selectedTask?.id === task.id}
                                                onSelect={handleSelectTask}
                                                onUpdate={handleUpdateTask}
                                                onDelete={handleDeleteTask}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                        
                        {/* Sekcja W Trakcie */}
                        <div className="mb-4">
                            <h6 className="text-muted text-uppercase extra-small fw-bold mb-3 d-flex justify-content-between">
                                W trakcie <span>{tasksInProgress.length}</span>
                            </h6>
                            <div className="space-y-2">
                                <AnimatePresence mode="popLayout">
                                    {tasksInProgress.map(task => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="mb-2"
                                        >
                                            <TaskItem 
                                                task={task} 
                                                isSelected={selectedTask?.id === task.id}
                                                onSelect={handleSelectTask}
                                                onUpdate={handleUpdateTask}
                                                onDelete={handleDeleteTask}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Sekcja Zrobione */}
                        <div>
                            <h6 className="text-muted text-uppercase extra-small fw-bold mb-3 d-flex justify-content-between">
                                Zrobione <span>{tasksDone.length}</span>
                            </h6>
                            <div className="space-y-2">
                                <AnimatePresence mode="popLayout">
                                    {tasksDone.map(task => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="mb-2"
                                        >
                                            <TaskItem 
                                                task={task} 
                                                isSelected={selectedTask?.id === task.id}
                                                onSelect={handleSelectTask}
                                                onUpdate={handleUpdateTask}
                                                onDelete={handleDeleteTask}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Right Column: Task Details */}
                <Col md={7} lg={8} className="h-100 bg-white">
                    <AnimatePresence mode="wait">
                        {selectedTask ? (
                            <motion.div 
                                key={selectedTask.id}
                                className="h-100"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            >
                                <TaskDetails 
                                    task={selectedTask} 
                                    onClose={() => setSelectedTask(null)}
                                    onEdit={openEditForm}
                                    onUpdate={handleUpdateTask}
                                />
                            </motion.div>
                        ) : (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted p-5 text-center">
                                <div className="bg-light rounded-circle p-4 mb-3">
                                    <Plus size={48} className="opacity-25" />
                                </div>
                                <h5>Nie wybrano zadania</h5>
                                <p className="small">Wybierz zadanie z listy po lewej stronie, aby zobaczyć szczegóły, historię zmian i komentarze.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </Col>
            </Row>

            <TaskForm 
                open={showForm} 
                setOpen={setShowForm} 
                task={editingTask} 
                onSave={handleSaveTask}
            />
        </div>
    );
}
