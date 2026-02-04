import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

// Status values from Swagger: pending, in_progress, completed, cancelled
const statusOptions = [
    { value: 'pending', label: 'Oczekujące' },
    { value: 'in_progress', label: 'W trakcie' },
    { value: 'completed', label: 'Zakończone' },
    { value: 'cancelled', label: 'Anulowane' }
];

export default function TaskForm({ open, setOpen, task, onSave }) {
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (task) {
            const taskData = { ...task };
            // Format date for input field
            if (taskData.due_date) {
                taskData.due_date = new Date(taskData.due_date).toISOString().split('T')[0];
            }
            setFormData(taskData);
        } else {
            // Default values for new task (matching Swagger spec)
            setFormData({
                title: '',
                website_url: '',
                description: '',
                address: '',
                phone: '',
                email: '',
                due_date: '',
                delivery_address: ''
            });
        }
        setErrors({});
    }, [task, open]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when field is modified
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Required fields from Swagger
        if (!formData.title?.trim()) {
            newErrors.title = 'Tytuł jest wymagany';
        }
        if (!formData.website_url?.trim()) {
            newErrors.website_url = 'URL strony jest wymagany';
        }
        if (!formData.description?.trim()) {
            newErrors.description = 'Opis jest wymagany';
        }
        if (!formData.address?.trim()) {
            newErrors.address = 'Adres jest wymagany';
        }

        // URL validation
        if (formData.website_url && !formData.website_url.match(/^https?:\/\/.+/)) {
            newErrors.website_url = 'Podaj prawidłowy URL (zaczynający się od http:// lub https://)';
        }

        // Email validation (if provided)
        if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = 'Podaj prawidłowy adres email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            // Build payload with only non-empty optional fields
            const payload = {
                title: formData.title,
                website_url: formData.website_url,
                description: formData.description,
                address: formData.address
            };

            // Add optional fields if provided
            if (formData.phone?.trim()) payload.phone = formData.phone;
            if (formData.email?.trim()) payload.email = formData.email;
            if (formData.due_date) payload.due_date = formData.due_date;
            if (formData.delivery_address?.trim()) payload.delivery_address = formData.delivery_address;

            // Include id for updates
            if (formData.id) {
                payload.id = formData.id;
            }

            await onSave(payload);
            setOpen(false);
        } catch (error) {
            console.error("Error saving task:", error);
            const apiError = error.response?.data?.message || 'Wystąpił błąd podczas zapisywania zadania';
            setErrors({ submit: apiError });
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

                    {errors.submit && (
                        <div className="alert alert-danger">{errors.submit}</div>
                    )}
                    
                    {/* Title - Required */}
                    <Form.Group className="mb-3">
                        <Form.Label>Tytuł zadania <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="np. Naprawa błędu na stronie"
                            value={formData.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            isInvalid={!!errors.title}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Website URL - Required */}
                    <Form.Group className="mb-3">
                        <Form.Label>URL strony <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="https://example.com"
                            value={formData.website_url || ''}
                            onChange={(e) => handleChange('website_url', e.target.value)}
                            isInvalid={!!errors.website_url}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{errors.website_url}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Description - Required */}
                    <Form.Group className="mb-3">
                        <Form.Label>Opis <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Szczegółowy opis zadania..."
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            isInvalid={!!errors.description}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                    </Form.Group>

                    {/* Address - Required */}
                    <Form.Group className="mb-3">
                        <Form.Label>Adres <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="ul. Przykładowa 123, Warszawa"
                            value={formData.address || ''}
                            onChange={(e) => handleChange('address', e.target.value)}
                            isInvalid={!!errors.address}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                    </Form.Group>

                    <hr />
                    <p className="text-muted small mb-3">Pola opcjonalne</p>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Telefon</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="+48 123 456 789"
                                    value={formData.phone || ''}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="kontakt@example.com"
                                    value={formData.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Termin wykonania</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.due_date || ''}
                                    onChange={(e) => handleChange('due_date', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Adres dostawy</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="ul. Dostawy 456, Kraków"
                                    value={formData.delivery_address || ''}
                                    onChange={(e) => handleChange('delivery_address', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
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
