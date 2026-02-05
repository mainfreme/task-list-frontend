import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Row, Col, Badge as BootstrapBadge } from 'react-bootstrap';
import { RefreshCw, Wifi, WifiOff, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApiTaskList from '../components/ApiTaskList';
import ApiTaskModal from '../components/ApiTaskModal';
import AddTaskApiTask from '../components/AddTaskApiTask';
import ApiService from '../services/ApiService';
import StatCard from '../components/common/StatCard';
import AlertMessage from '../components/common/AlertMessage';
import { useAuth } from '../contexts/AuthContext';

export default function ZadaniaApi() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isPolling, setIsPolling] = useState(true);
    const [lastCheck, setLastCheck] = useState(new Date());
    const [error, setError] = useState(null);
    const pollingIntervalRef = useRef(null);
    
    const { withAuthCheck, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const loadTasks = useCallback(async () => {
        const result = await withAuthCheck(async () => {
            const response = await ApiService.getTasks();
            return response?.data || response || [];
        });
        
        if (result.success) {
            setTasks(Array.isArray(result.data) ? result.data : []);
            setLastCheck(new Date());
            setError(null);
        } else {
            if (result.error?.includes('Session expired')) {
                stopPolling();
                navigate('/login');
                return;
            }
            setError('Nie udało się pobrać zadań z API.');
        }
    }, [withAuthCheck, navigate]);

    const startPolling = useCallback(() => {
        if (pollingIntervalRef.current) return;
        
        pollingIntervalRef.current = setInterval(() => {
            loadTasks();
        }, 30000); // 30 sekund
        
        setIsPolling(true);
    }, [loadTasks]);

    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        setIsPolling(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadTasks();
            startPolling();
        }
        return () => stopPolling();
    }, [isAuthenticated, loadTasks, startPolling]);

    const handleTaskSelect = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const result = await withAuthCheck(async () => {
            await ApiService.updateTaskStatus(taskId, newStatus);
            return true;
        });
        
        if (result.success) {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
            setModalOpen(false);
            setSelectedTask(null);
        } else {
            if (result.error?.includes('Session expired')) {
                stopPolling();
                navigate('/login');
                return;
            }
            setError('Błąd podczas aktualizacji statusu zadania.');
        }
    };

    const handleTaskAdded = (newTask) => {
        setTasks(prev => [newTask, ...prev]);
    };

    const togglePolling = () => {
        if (isPolling) {
            stopPolling();
        } else {
            startPolling();
        }
    };

    // Status names from Swagger: pending, in_progress, completed, cancelled
    const newTasksCount = tasks.filter(t => t.status === 'pending' || !t.status).length;
    const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;

    return (
        <div className="container-fluid py-4 max-w-6xl mx-auto">
            <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h1 className="h3 fw-bold text-dark mb-1">Zadania z API</h1>
                        <p className="text-muted small mb-0">
                            Ostatnie sprawdzenie: {lastCheck.toLocaleTimeString('pl-PL')}
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <AddTaskApiTask onTaskAdded={handleTaskAdded} />
                        <Button 
                            variant={isPolling ? "primary" : "outline-primary"}
                            onClick={togglePolling}
                            size="sm"
                            className="d-flex align-items-center gap-2"
                        >
                            {isPolling ? <Wifi size={14} /> : <WifiOff size={14} />}
                            {isPolling ? 'Polling ON' : 'Polling OFF'}
                        </Button>
                        <Button onClick={loadTasks} variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2">
                            <RefreshCw size={14} />
                            Odśwież
                        </Button>
                    </div>
                </div>

                <AlertMessage type="danger" message={error} onClose={() => setError(null)} />

                {/* Statystyki */}
                <Row className="g-3 mb-4">
                    <Col md={4}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="pt-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-muted small mb-1">Nowe</p>
                                        <h2 className="fw-bold text-danger mb-0">{newTasksCount}</h2>
                                    </div>
                                    <BootstrapBadge bg="danger" className="bg-opacity-10 text-danger border border-danger">
                                        Wymagają uwagi
                                    </BootstrapBadge>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="pt-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-muted small mb-1">Przeczytane</p>
                                        <h2 className="fw-bold text-warning mb-0">{inProgressCount}</h2>
                                    </div>
                                    <BootstrapBadge bg="warning" className="bg-opacity-10 text-warning border border-warning">
                                        W trakcie
                                    </BootstrapBadge>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="pt-4">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-muted small mb-1">Zakończone</p>
                                        <h2 className="fw-bold text-success mb-0">{completedCount}</h2>
                                    </div>
                                    <BootstrapBadge bg="success" className="bg-opacity-10 text-success border border-success">
                                        Gotowe
                                    </BootstrapBadge>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Lista zadań */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white py-3 border-bottom">
                    <Card.Title className="h5 mb-0 fw-bold d-flex align-items-center gap-2">
                        <Database size={20} className="text-primary" />
                        Wszystkie zadania ({tasks.length})
                    </Card.Title>
                </Card.Header>
                <Card.Body className="p-0">
                    <ApiTaskList tasks={tasks} onTaskSelect={handleTaskSelect} />
                </Card.Body>
            </Card>

            {/* Modal zadania */}
            <ApiTaskModal
                task={selectedTask}
                show={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedTask(null);
                }}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
}
