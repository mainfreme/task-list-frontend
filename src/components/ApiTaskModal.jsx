import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { ExternalLink, CheckCircle, MapPin, Phone, Mail, Calendar, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import Badge from './common/Badge';

// Status config based on Swagger: pending, in_progress, completed, cancelled
const statusConfig = {
    pending: { color: 'warning', label: 'Oczekujące' },
    in_progress: { color: 'primary', label: 'W trakcie' },
    completed: { color: 'success', label: 'Zakończone' },
    cancelled: { color: 'secondary', label: 'Anulowane' }
};

export default function ApiTaskModal({ task, show, onClose, onStatusChange }) {
    if (!task) return null;

    const handleComplete = () => {
        onStatusChange(task.id, 'completed');
        onClose();
    };

    const handleMarkAsInProgress = () => {
        onStatusChange(task.id, 'in_progress');
    };

    const handleCancel = () => {
        onStatusChange(task.id, 'cancelled');
        onClose();
    };

    const currentStatus = statusConfig[task.status] || statusConfig.pending;

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton className="border-bottom pb-3">
                <Modal.Title className="w-100">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="h4 mb-0 fw-bold">{task.title}</span>
                        <Badge color={currentStatus.color} pill>
                            {currentStatus.label}
                        </Badge>
                    </div>
                    {task.website_url && (
                        <a 
                            href={task.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-decoration-none text-primary small d-flex align-items-center gap-1"
                            style={{ fontSize: '0.85rem' }}
                        >
                            <ExternalLink size={12} />
                            {task.website_url}
                        </a>
                    )}
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="py-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {/* Description */}
                {task.description && (
                    <div className="mb-4">
                        <h6 className="text-muted text-uppercase small fw-bold mb-2">Opis</h6>
                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{task.description}</p>
                    </div>
                )}

                {/* Task details */}
                <Row className="g-3">
                    {task.address && (
                        <Col md={6}>
                            <div className="d-flex align-items-start gap-2">
                                <MapPin size={16} className="text-muted mt-1" />
                                <div>
                                    <div className="text-muted text-uppercase small fw-bold">Adres</div>
                                    <div>{task.address}</div>
                                </div>
                            </div>
                        </Col>
                    )}

                    {task.delivery_address && (
                        <Col md={6}>
                            <div className="d-flex align-items-start gap-2">
                                <Truck size={16} className="text-muted mt-1" />
                                <div>
                                    <div className="text-muted text-uppercase small fw-bold">Adres dostawy</div>
                                    <div>{task.delivery_address}</div>
                                </div>
                            </div>
                        </Col>
                    )}

                    {task.phone && (
                        <Col md={6}>
                            <div className="d-flex align-items-start gap-2">
                                <Phone size={16} className="text-muted mt-1" />
                                <div>
                                    <div className="text-muted text-uppercase small fw-bold">Telefon</div>
                                    <a href={`tel:${task.phone}`} className="text-decoration-none">{task.phone}</a>
                                </div>
                            </div>
                        </Col>
                    )}

                    {task.email && (
                        <Col md={6}>
                            <div className="d-flex align-items-start gap-2">
                                <Mail size={16} className="text-muted mt-1" />
                                <div>
                                    <div className="text-muted text-uppercase small fw-bold">Email</div>
                                    <a href={`mailto:${task.email}`} className="text-decoration-none">{task.email}</a>
                                </div>
                            </div>
                        </Col>
                    )}

                    {task.due_date && (
                        <Col md={6}>
                            <div className="d-flex align-items-start gap-2">
                                <Calendar size={16} className="text-muted mt-1" />
                                <div>
                                    <div className="text-muted text-uppercase small fw-bold">Termin</div>
                                    <div>{format(new Date(task.due_date), 'd MMMM yyyy', { locale: pl })}</div>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>

                {/* Timestamps */}
                {(task.created_at || task.updated_at) && (
                    <div className="border-top mt-4 pt-3">
                        <Row className="g-2 text-muted small">
                            {task.created_at && (
                                <Col sm={6}>
                                    <span className="fw-bold">Utworzono:</span> {format(new Date(task.created_at), 'd MMM yyyy, HH:mm', { locale: pl })}
                                </Col>
                            )}
                            {task.updated_at && (
                                <Col sm={6}>
                                    <span className="fw-bold">Zaktualizowano:</span> {format(new Date(task.updated_at), 'd MMM yyyy, HH:mm', { locale: pl })}
                                </Col>
                            )}
                        </Row>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between border-top pt-3">
                <div>
                    <Button variant="outline-secondary" onClick={onClose}>
                        Zamknij
                    </Button>
                </div>
                <div className="d-flex gap-2">
                    {task.status === 'pending' && (
                        <Button variant="primary" onClick={handleMarkAsInProgress}>
                            Rozpocznij
                        </Button>
                    )}
                    {task.status !== 'completed' && task.status !== 'cancelled' && (
                        <>
                            <Button variant="outline-danger" onClick={handleCancel}>
                                Anuluj
                            </Button>
                            <Button variant="success" onClick={handleComplete} className="d-flex align-items-center">
                                <CheckCircle size={18} className="me-2" />
                                Zakończ
                            </Button>
                        </>
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    );
}
