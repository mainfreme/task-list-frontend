import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import ApiService from '../services/ApiService';

export default function AddTaskApiTask({ onTaskAdded }) {
    const [show, setShow] = useState(false);
    const [formType, setFormType] = useState('dane_kontaktowe');
    const [title, setTitle] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setShow(false);
        setTitle('');
        setSourceUrl('');
        setFormType('dane_kontaktowe');
    };
    
    const handleShow = () => setShow(true);

    const handleAddTask = async () => {
        setIsSubmitting(true);
        try {
            let formData = {};
            
            if (formType === 'formularz') {
                formData = {
                    imie: { label: 'Imię', type: 'text', required: true, placeholder: 'Wpisz imię' },
                    email: { label: 'Email', type: 'email', required: true, placeholder: 'email@example.com' },
                    wiadomosc: { label: 'Wiadomość', type: 'textarea', required: true, placeholder: 'Twoja wiadomość...' },
                    telefon: { label: 'Telefon', type: 'tel', required: false, placeholder: '+48 123 456 789' }
                };
            } else {
                formData = {
                    imie_nazwisko: 'Jan Kowalski',
                    email: 'jan.kowalski@example.com',
                    telefon: '+48 123 456 789',
                    firma: 'Example Corp',
                    wiadomosc: 'Proszę o kontakt w sprawie współpracy'
                };
            }

            const taskPayload = {
                title: title || `Nowe zapytanie ${formType === 'formularz' ? '(formularz)' : '(kontakt)'}`,
                source_url: sourceUrl || 'https://example.com/kontakt',
                status: 'nowe',
                form_type: formType,
                form_data: formData
            };

            // Using our ApiService instead of base44Client
            const newTask = await ApiService.createApiTask(taskPayload);

            if (onTaskAdded) {
                onTaskAdded(newTask);
            }
            
            handleClose();
        } catch (error) {
            console.error('Error adding API task:', error);
            alert('Wystąpił błąd podczas dodawania zadania API.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button variant="outline-primary" size="sm" onClick={handleShow} className="d-flex align-items-center gap-2">
                <Plus size={16} />
                Dodaj testowe zadanie API
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Symuluj nowe zadanie z API</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tytuł zadania</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="np. Zapytanie ofertowe" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Adres źródłowy</Form.Label>
                            <Form.Control 
                                type="url"
                                placeholder="https://example.com/kontakt" 
                                value={sourceUrl}
                                onChange={(e) => setSourceUrl(e.target.value)}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Typ danych</Form.Label>
                            <Form.Select 
                                value={formType} 
                                onChange={(e) => setFormType(e.target.value)}
                            >
                                <option value="dane_kontaktowe">Dane kontaktowe (tylko odczyt)</option>
                                <option value="formularz">Formularz do wypełnienia</option>
                            </Form.Select>
                        </Form.Group>
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
