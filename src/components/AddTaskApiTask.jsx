import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import ApiService from '../services/ApiService';

export default function AddTaskApiTask({ onTaskAdded }) {
    const [show, setShow] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        website_url: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        due_date: '',
        delivery_address: ''
    });

    const handleClose = () => {
        setShow(false);
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
    };
    
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTask = async () => {
        // Validate required fields
        if (!formData.title || !formData.website_url || !formData.description || !formData.address) {
            alert('Wypełnij wszystkie wymagane pola: Tytuł, URL strony, Opis, Adres');
            return;
        }

        setIsSubmitting(true);
        try {
            // Build payload with only non-empty fields
            const taskPayload = {
                title: formData.title,
                website_url: formData.website_url,
                description: formData.description,
                address: formData.address
            };

            // Add optional fields if provided
            if (formData.phone) taskPayload.phone = formData.phone;
            if (formData.email) taskPayload.email = formData.email;
            if (formData.due_date) taskPayload.due_date = formData.due_date;
            if (formData.delivery_address) taskPayload.delivery_address = formData.delivery_address;

            const newTask = await ApiService.createTask(taskPayload);

            if (onTaskAdded) {
                onTaskAdded(newTask);
            }
            
            handleClose();
        } catch (error) {
            console.error('Error adding task:', error);
            const errorMsg = error.response?.data?.message || 'Wystąpił błąd podczas dodawania zadania.';
            alert(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button variant="outline-primary" size="sm" onClick={handleShow} className="d-flex align-items-center gap-2">
                <Plus size={16} />
                Dodaj nowe zadanie
            </Button>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Dodaj nowe zadanie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tytuł zadania <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                type="text"
                                name="title"
                                placeholder="np. Naprawa błędu na stronie" 
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>URL strony <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                type="url"
                                name="website_url"
                                placeholder="https://example.com" 
                                value={formData.website_url}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Opis <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={3}
                                name="description"
                                placeholder="Szczegółowy opis zadania..." 
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Adres <span className="text-danger">*</span></Form.Label>
                            <Form.Control 
                                type="text"
                                name="address"
                                placeholder="ul. Przykładowa 123, Warszawa" 
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <hr />
                        <p className="text-muted small">Pola opcjonalne</p>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Telefon</Form.Label>
                                    <Form.Control 
                                        type="tel"
                                        name="phone"
                                        placeholder="+48 123 456 789" 
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email"
                                        name="email"
                                        placeholder="kontakt@example.com" 
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Termin wykonania</Form.Label>
                                    <Form.Control 
                                        type="date"
                                        name="due_date"
                                        value={formData.due_date}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Adres dostawy</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        name="delivery_address"
                                        placeholder="ul. Dostawy 456, Kraków" 
                                        value={formData.delivery_address}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Anuluj
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleAddTask}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Dodawanie...' : 'Dodaj zadanie'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
