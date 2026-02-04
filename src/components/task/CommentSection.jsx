import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function CommentSection({ taskId, comments = [], onCommentAdded }) {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            // We pass the data to the parent component's handler which uses ApiService
            await onCommentAdded(taskId, {
                content: newComment,
                created_date: new Date().toISOString(),
                // In a real app, the backend would set created_by/user_name from the session
                created_by: 'Ty@system.com' 
            });
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <div className="mt-4">
            <h6 className="fw-bold text-muted text-uppercase small mb-3">Komentarze ({comments.length})</h6>
            
            <div className="comment-list mb-4">
                {comments.map((comment, index) => {
                    const createdBy = comment.created_by || comment.user_name || 'Użytkownik@system.com';
                    const avatarLetter = createdBy.charAt(0).toUpperCase();
                    const displayName = createdBy.split('@')[0];
                    const date = comment.created_date || comment.created_at;

                    return (
                        <div key={comment.id || index} className="d-flex align-items-start gap-2 mb-3">
                            <div 
                                className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold', color: '#666' }}
                            >
                                {avatarLetter}
                            </div>
                            <div className="flex-grow-1 bg-light rounded-3 p-2 px-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="fw-bold small text-dark">{displayName}</span>
                                    <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                                        {date ? format(new Date(date), 'd MMM yyyy, HH:mm', { locale: pl }) : ''}
                                    </span>
                                </div>
                                <p className="mb-0 small text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    );
                })}
                {comments.length === 0 && (
                    <div className="text-center py-3 text-muted small">
                        Brak komentarzy. Bądź pierwszy!
                    </div>
                )}
            </div>

            <InputGroup className="shadow-sm">
                <Form.Control
                    placeholder="Dodaj komentarz..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSubmitting}
                />
                <Button 
                    variant="primary" 
                    onClick={handleAddComment}
                    disabled={isSubmitting || !newComment.trim()}
                >
                    <Send size={16} />
                </Button>
            </InputGroup>
        </div>
    );
}
