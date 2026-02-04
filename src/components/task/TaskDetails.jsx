import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Dropdown, Row, Col } from 'react-bootstrap';
import { Calendar, Flag, User, Clock, X, GitMerge, UserPlus, ChevronDown, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import CommentSection from './CommentSection';
import ApiService from '../../services/ApiService';

const priorityColors = {
    niski: 'bg-info bg-opacity-10 text-info border-info',
    średni: 'bg-warning bg-opacity-10 text-warning border-warning',
    wysoki: 'bg-danger bg-opacity-10 text-danger border-danger',
};

const statusLabels = {
    do_zrobienia: 'Do zrobienia',
    w_trakcie: 'W trakcie',
    zrobione: 'Zrobione'
};

const formatTime = (seconds) => {
    if (!seconds) return "00:00:00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

export default function TaskDetails({ task, comments, onCommentAdded, onClose, onEdit, onUpdate }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const userList = await ApiService.getUsers();
                setUsers(userList || []);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        }
        fetchUsers();
    }, []);

    const handleStatusChange = (newStatus) => {
        onUpdate(task.id, { status: newStatus });
    };

    const handleAssignUser = (userEmail) => {
        onUpdate(task.id, { assigned_to: userEmail });
    };

    if (!task) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-light text-muted p-5 rounded border-2 border-dashed">
                <p>Wybierz zadanie z listy, aby zobaczyć szczegóły i komentarze.</p>
            </div>
        );
    }

    return (
        <Card className="h-100 border-0 shadow-sm animate-fade-in">
            <Card.Header className="bg-white border-bottom py-3 px-4">
                <div className="d-flex justify-content-between align-items-start">
                    <Card.Title className="h5 fw-bold mb-0 text-dark">{task.title}</Card.Title>
                    <div className="d-flex align-items-center gap-2">
                        <Dropdown>
                            <Dropdown.Toggle 
                                as={Badge} 
                                bg={task.status === 'zrobione' ? 'success' : 'secondary'}
                                className="cursor-pointer d-flex align-items-center gap-1 border-0"
                                style={{ cursor: 'pointer', padding: '0.5rem 0.8rem' }}
                            >
                                {statusLabels[task.status] || task.status}
                                <ChevronDown size={12} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                <Dropdown.Item onClick={() => handleStatusChange('do_zrobienia')}>Do zrobienia</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusChange('w_trakcie')}>W trakcie</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusChange('zrobione')}>Zrobione</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        
                        <Button variant="link" className="p-1 text-muted hover-text-dark" onClick={() => onEdit(task)}>
                            <Edit size={18} />
                        </Button>
                        <Button variant="link" className="p-1 text-muted hover-text-dark" onClick={onClose}>
                            <X size={20} />
                        </Button>
                    </div>
                </div>
            </Card.Header>
            <Card.Body className="p-4" style={{ overflowY: 'auto' }}>
                <div className="mb-4">
                    <h6 className="text-uppercase text-muted extra-small fw-bold mb-2">Opis</h6>
                    <p className="text-dark mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {task.description || 'Brak opisu.'}
                    </p>
                </div>

                <Row className="g-3 mb-4">
                    <Col sm={6}>
                        <div className="d-flex align-items-center gap-2">
                            <Calendar size={16} className="text-muted" />
                            <div>
                                <div className="extra-small text-muted text-uppercase fw-bold">Termin</div>
                                <div className="small">
                                    {task.due_date ? format(new Date(task.due_date), 'd MMM yyyy', { locale: pl }) : 'Brak'}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className="d-flex align-items-center gap-2">
                            <Flag size={16} className="text-muted" />
                            <div>
                                <div className="extra-small text-muted text-uppercase fw-bold">Priorytet</div>
                                <Badge className={`${priorityColors[task.priority || 'średni']} border-1`}>
                                    {task.priority || 'średni'}
                                </Badge>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className="d-flex align-items-center gap-2">
                            <User size={16} className="text-muted" />
                            <div className="flex-grow-1">
                                <div className="extra-small text-muted text-uppercase fw-bold">Przypisano</div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="small">{task.assigned_to || 'Nie przypisano'}</span>
                                    <Dropdown className="d-inline">
                                        <Dropdown.Toggle as="button" className="btn btn-link p-0 text-muted h-auto">
                                            <UserPlus size={14} />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleAssignUser('')}>Brak przypisania</Dropdown.Item>
                                            {users.map(user => (
                                                <Dropdown.Item key={user.id} onClick={() => handleAssignUser(user.email)}>
                                                    {user.full_name || user.email}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className="d-flex align-items-center gap-2">
                            <Clock size={16} className="text-muted" />
                            <div>
                                <div className="extra-small text-muted text-uppercase fw-bold">Czas pracy</div>
                                <div className="small fw-bold text-primary">{formatTime(task.time_tracked)}</div>
                            </div>
                        </div>
                    </Col>
                    {task.github_mr_url && (
                        <Col xs={12}>
                            <div className="d-flex align-items-start gap-2 pt-2 border-top border-light">
                                <GitMerge size={16} className="text-muted mt-1" />
                                <div className="text-break">
                                    <div className="extra-small text-muted text-uppercase fw-bold">Merge Request</div>
                                    <a href={task.github_mr_url} target="_blank" rel="noopener noreferrer" className="small text-primary text-decoration-none">
                                        {task.github_mr_url}
                                    </a>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>

                <CommentSection 
                    taskId={task.id} 
                    comments={comments} 
                    onCommentAdded={onCommentAdded} 
                />
            </Card.Body>
        </Card>
    );
}
