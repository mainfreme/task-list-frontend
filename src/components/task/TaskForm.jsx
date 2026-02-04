import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ApiService from '../../services/ApiService';

export default function TaskForm({ open, setOpen, task, onSave }) {
    const [formData, setFormData] = useState({});
    const [users, setUsers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (task) {
            const taskData = { ...task };
            if (taskData.due_date) {
                taskData.due_date = new Date(taskData.due_date).toISOString().split('T')[0];
            }
            setFormData(taskData);
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'średni',
                status: 'do_zrobienia',
                due_date: '',
                assigned_to: '',
                time_tracked: 0,
                github_mr_url: '',
            });
        }
    }, [task, open]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const userList = await ApiService.getUsers();
                setUsers(userList || []);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        }
        if (open) {
            fetchUsers();
        }
    }, [open]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
            setOpen(false);
        } catch (error) {
            console.error("Error saving task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={open} onHide={() => setOpen(false)} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{task ? 'Edytuj zadanie' : 'Nowe zadanie'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSave}>
                <Modal.Body>
                    <p className="text-muted small mb-4">
                        {task ? 'Zmień szczegóły zadania.' : 'Wypełnij poniższe pola, aby utworzyć nowe zadanie.'}
                    </p>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Tytuł zadania</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Tytuł zadania"
                            value={formData.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Opis</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Opis zadania..."
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Priorytet</Form.Label>
                                <Form.Select 
                                    value={formData.priority} 
                                    onChange={(e) => handleChange('priority', e.target.value)}
                                >
                                    <option value="niski">Niski</option>
                                    <option value="średni">Średni</option>
                                    <option value="wysoki">Wysoki</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select 
                                    value={formData.status} 
                                    onChange={(e) => handleChange('status', e.target.value)}
                                >
                                    <option value="do_zrobienia">Do zrobienia</option>
                                    <option value="w_trakcie">W trakcie</option>
                                    <option value="zrobione">Zrobione</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Termin (Due Date)</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.due_date || ''}
                                    onChange={(e) => handleChange('due_date', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Przypisz do</Form.Label>
                                <Form.Select 
                                    value={formData.assigned_to} 
                                    onChange={(e) => handleChange('assigned_to', e.target.value)}
                                >
                                    <option value="">Wybierz użytkownika...</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.email}>
                                            {user.full_name || user.email}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Link do Merge Request (GitHub)</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="https://github.com/..."
                            value={formData.github_mr_url || ''}
                            onChange={(e) => handleChange('github_mr_url', e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setOpen(false)}>
                        Anuluj
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Zapisywanie...' : 'Zapisz'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
