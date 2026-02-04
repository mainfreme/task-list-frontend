import React from 'react';
import { Card, Button, Badge, Dropdown, Row, Col } from 'react-bootstrap';
import { Calendar, MapPin, Phone, Mail, Globe, Truck, X, ChevronDown, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import ApiService from '../../services/ApiService';

// Status names from Swagger: pending, in_progress, completed, cancelled
const statusLabels = {
    pending: 'Oczekujące',
    in_progress: 'W trakcie',
    completed: 'Zakończone',
    cancelled: 'Anulowane'
};

const statusColors = {
    pending: 'warning',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'secondary'
};

export default function TaskDetails({ task, onClose, onEdit, onUpdate }) {
    const handleStatusChange = async (newStatus) => {
        try {
            // Use the dedicated PATCH endpoint for status updates
            await ApiService.updateTaskStatus(task.id, newStatus);
            onUpdate(task.id, { status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (!task) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-light text-muted p-5 rounded border-2 border-dashed">
                <p>Wybierz zadanie z listy, aby zobaczyć szczegóły.</p>
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
                                bg={statusColors[task.status] || 'secondary'}
                                className="cursor-pointer d-flex align-items-center gap-1 border-0"
                                style={{ cursor: 'pointer', padding: '0.5rem 0.8rem' }}
                            >
                                {statusLabels[task.status] || task.status || 'Oczekujące'}
                                <ChevronDown size={12} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                <Dropdown.Item onClick={() => handleStatusChange('pending')}>Oczekujące</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusChange('in_progress')}>W trakcie</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusChange('completed')}>Zakończone</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusChange('cancelled')}>Anulowane</Dropdown.Item>
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
                {/* Description */}
                <div className="mb-4">
                    <h6 className="text-uppercase text-muted extra-small fw-bold mb-2">Opis</h6>
                    <p className="text-dark mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {task.description || 'Brak opisu.'}
                    </p>
                </div>

                {/* Task details grid */}
                <Row className="g-3 mb-4">
                    {/* Website URL */}
                    {task.website_url && (
                        <Col sm={6}>
                            <div className="d-flex align-items-center gap-2">
                                <Globe size={16} className="text-muted" />
                                <div className="text-break">
                                    <div className="extra-small text-muted text-uppercase fw-bold">Strona</div>
                                    <a href={task.website_url} target="_blank" rel="noopener noreferrer" className="small text-primary text-decoration-none">
                                        {task.website_url}
                                    </a>
                                </div>
                            </div>
                        </Col>
                    )}

                    {/* Due Date */}
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

                    {/* Address */}
                    {task.address && (
                        <Col sm={6}>
                            <div className="d-flex align-items-center gap-2">
                                <MapPin size={16} className="text-muted" />
                                <div>
                                    <div className="extra-small text-muted text-uppercase fw-bold">Adres</div>
                                    <div className="small">{task.address}</div>
                                </div>
                            </div>
                        </Col>
                    )}

                    {/* Delivery Address */}
                    {task.delivery_address && (
                        <Col sm={6}>
                            <div className="d-flex align-items-center gap-2">
                                <Truck size={16} className="text-muted" />
                                <div>
                                    <div className="extra-small text-muted text-uppercase fw-bold">Adres dostawy</div>
                                    <div className="small">{task.delivery_address}</div>
                                </div>
                            </div>
                        </Col>
                    )}

                    {/* Phone */}
                    {task.phone && (
                        <Col sm={6}>
                            <div className="d-flex align-items-center gap-2">
                                <Phone size={16} className="text-muted" />
                                <div>
                                    <div className="extra-small text-muted text-uppercase fw-bold">Telefon</div>
                                    <a href={`tel:${task.phone}`} className="small text-decoration-none">{task.phone}</a>
                                </div>
                            </div>
                        </Col>
                    )}

                    {/* Email */}
                    {task.email && (
                        <Col sm={6}>
                            <div className="d-flex align-items-center gap-2">
                                <Mail size={16} className="text-muted" />
                                <div>
                                    <div className="extra-small text-muted text-uppercase fw-bold">Email</div>
                                    <a href={`mailto:${task.email}`} className="small text-decoration-none">{task.email}</a>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>

                {/* Timestamps */}
                {(task.created_at || task.updated_at) && (
                    <div className="border-top pt-3 mt-3">
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
            </Card.Body>
        </Card>
    );
}
