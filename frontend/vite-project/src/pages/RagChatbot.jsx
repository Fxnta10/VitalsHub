import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Spinner } from 'react-bootstrap'

export default function RagChatbot() {
    const [text, setText] = useState("")
    const [messages, setMessages] = useState([
        { type: 'bot', content: 'Hello! I\'m your RAG chatbot. Ask me anything!' }
    ])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Example: Chat with RAG
        async function askChatbot(message) {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            const data = await res.json();
            console.log("Chatbot says:", data.answer);
        }

        // Example: Book appointment
        async function bookAppointment() {
            const res = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorId: "650f4c9c2a4f9e1234567890",
                    patient: { name: "Alice", phone: "9876543210", email: "alice@example.com" },
                    date: "2025-09-20",
                    time: "10:00",
                    reason: "Checkup",
                }),
            });
            const data = await res.json();
            console.log(data);
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const userMessage = text;
        setText('');
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:5002/api/chatbot/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userMessage }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: data.response || 'I could not process that request.'
            }]);
        } catch (error) {
            console.error('Chatbot Error:', error);
            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: 'Sorry, I encountered an error. Please try again later.'
            }]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container fluid className="h-100 d-flex flex-column bg-light">
            {/* Header */}
            <Row className="bg-primary text-white py-3 mb-0">
                <Col>
                    <div className="d-flex align-items-center">
                        <div className="me-3">
                            <Badge bg="light" text="primary" className="p-2">
                                🤖
                            </Badge>
                        </div>
                        <div>
                            <h3 className="mb-0">RAG Chatbot</h3>
                            <small className="text-light">Ask me anything!</small>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Messages */}
            <Row className="flex-grow-1 overflow-hidden">
                <Col>
                    <div 
                        className="h-100 overflow-auto p-3" 
                        style={{ maxHeight: 'calc(100vh - 200px)' }}
                    >
                        <ListGroup variant="flush">
                            {messages.map((message, index) => (
                                <ListGroup.Item 
                                    key={index} 
                                    className={`border-0 bg-transparent mb-3 ${
                                        message.type === 'user' ? 'text-end' : 'text-start'
                                    }`}
                                >
                                    <div className={`d-inline-flex align-items-start ${
                                        message.type === 'user' ? 'flex-row-reverse' : ''
                                    } gap-2`}>
                                        <Badge 
                                            bg={message.type === 'user' ? 'primary' : 'secondary'} 
                                            className="p-2"
                                        >
                                            {message.type === 'user' ? '👤' : '🤖'}
                                        </Badge>
                                        <Card 
                                            className={`shadow-sm ${
                                                message.type === 'user' ? 'bg-primary text-white' : ''
                                            }`}
                                            style={{ maxWidth: '70%' }}
                                        >
                                            <Card.Body className="py-2 px-3">
                                                <Card.Text className="mb-0 small">
                                                    {message.content}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </ListGroup.Item>
                            ))}

                            {isLoading && (
                                <ListGroup.Item className="border-0 bg-transparent mb-3 text-start">
                                    <div className="d-inline-flex align-items-start gap-2">
                                        <Badge bg="secondary" className="p-2">
                                            🤖
                                        </Badge>
                                        <Card className="shadow-sm" style={{ maxWidth: '70%' }}>
                                            <Card.Body className="py-2 px-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Spinner animation="grow" size="sm" variant="primary" />
                                                    <small className="text-muted">Thinking...</small>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </div>
                </Col>
            </Row>

            {/* Input Form */}
            <Row className="bg-white border-top py-3">
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-2">
                            <Col>
                                <Form.Control
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button 
                                    type="submit" 
                                    variant="primary"
                                    disabled={isLoading || !text.trim()}
                                    className="d-flex align-items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner animation="border" size="sm" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            📤 Send
                                        </>
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}