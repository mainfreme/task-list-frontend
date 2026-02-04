import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ExternalLink, CheckCircle } from 'lucide-react';
import Badge from './common/Badge';

export default function ApiTaskModal({ task, show, onClose, onStatusChange }) {
    const [formResponses, setFormResponses] = useState({});

    // Reset form responses when task changes
    useEffect(() => {
        setFormResponses({});
    }, [task?.id]);

    if (!task) return null;

    const handleInputChange = (field, value) => {
        setFormResponses(prev => ({ ...prev, [field]: value }));
    };

    const handleComplete = () => {
        onStatusChange(task.id, 'zakonczone', formResponses);
        onClose();
    };

    const handleMarkAsRead = () => {
        onStatusChange(task.id, 'przeczytane');
    };

    const renderFormData = () => {
        if (!task.form_data) return <p className="text-muted">Brak danych</p>;

        if (task.form_type === 'formularz') {
            // Renderowanie dynamicznego formularza
            return (
                <div className="space-y-4">
                    <p className="text-sm text-muted mb-3 small">Wypełnij poniższy formularz:</p>
                    {Object.entries(task.form_data).map(([key, config]) => (
                        <Form.Group key={key} className="mb-3">
                            <Form.Label className="small fw-bold">
                                {config.label || key}
                                {config.required && <span className="text-danger ms-1">*</span>}
                            </Form.Label>
                            {config.type === 'textarea' ? (
                                <Form.Control
                                    as="textarea"
                                    id={key}
                                    placeholder={config.placeholder || ''}
                                    value={formResponses[key] || ''}
                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                    rows={3}
                                />
                            ) : (
                                <Form.Control
                                    type={config.type || 'text'}
                                    id={key}
                                    placeholder={config.placeholder || ''}
                                    value={formResponses[key] || ''}
                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                />
                            )}
                            {config.description && (
                                <Form.Text className="text-muted extra-small d-block mt-1">
                                    {config.description}
                                </Form.Text>
                            )}
                        </Form.Group>
                    ))}
                </div>
            );
        } else {
            // Renderowanie danych kontaktowych
            return (
                <div className="contact-data-list">
                    <p className="small fw-bold text-muted mb-3 text-uppercase">Dane kontaktowe:</p>
                    {Object.entries(task.form_data).map(([key, value]) => (
                        <div key={key} className="d-flex align-items-center border-bottom border-light py-2">
                            <span className="text-muted small fw-medium" style={{ minWidth: '140px', textTransform: 'capitalize' }}>
                                {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-dark fw-medium ms-2">
                                {typeof value === 'object' ? JSON.stringify(value) : value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton className="border-bottom pb-3">
                <Modal.Title className="w-100">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="h4 mb-0 fw-bold">{task.title}</span>
                        <Badge color={task.status === 'nowe' ? 'danger' : task.status === 'zakonczone' ? 'success' : 'warning'} pill>
                            {task.status}
                        </Badge>
                    </div>
                    <a 
                        href={task.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none text-primary small d-flex align-items-center gap-1"
                        style={{ fontSize: '0.85rem' }}
                    >
                        <ExternalLink size={12} />
                        {task.source_url}
                    </a>
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="py-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {renderFormData()}
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between border-top pt-3">
                <Button variant="outline-secondary" onClick={onClose}>
                    Zamknij
                </Button>
                <div className="d-flex gap-2">
                    {task.status === 'nowe' && (
                        <Button variant="light" className="text-primary border" onClick={handleMarkAsRead}>
                            <CheckCircle size={18} className="me-2" />
                            Oznacz jako przeczytane
                        </Button>
                    )}
                    {task.status !== 'zakonczone' && (
                        <Button variant="success" onClick={handleComplete} className="d-flex align-items-center shadow-sm">
                            <CheckCircle size={18} className="me-2" />
                            Zakończ zadanie
                        </Button>
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    );
}
