import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast, ToastContainer, Button, Form, Card, Row, Col, Container } from "react-bootstrap";

export default function CreateAppointment() {
  const { authUser, createAppointment, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    hospitalId,
    hospitalName,
    hospitalAddress,
    doctorId,
    doctorName,
    doctorSpecialisation,
    doctorEmail,
  } = location.state || {};

  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    hospitalId: "",
    patientId: authUser?._id || "",
    doctorId: "",
    appointmentTime: "",
    isEmergency: false,
    description: "",
  });
  const [error, setError] = useState("");

  // Set form data on mount
  useEffect(() => {
    if (hospitalId && doctorId && authUser) {
      setFormData((prev) => ({
        ...prev,
        hospitalId,
        doctorId,
        patientId: authUser._id,
      }));
    }
  }, [hospitalId, doctorId, authUser]);

  // Redirect if doctor/hospital not selected
  useEffect(() => {
    if (!hospitalId || !doctorId) {
      alert("Please select a doctor first"); // simpler than toast for now
      navigate("/hospitals");
    }
  }, [hospitalId, doctorId, navigate]);

  const validateForm = () => {
    const { hospitalId, patientId, doctorId, appointmentTime, description } = formData;
    if (!hospitalId || !patientId || !doctorId || !appointmentTime || !description) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!validateForm()) return;

  try {
    const result = await createAppointment(formData);

    if (result?.success) {
      setShowToast(true); // show toast
      // Remove the navigation here so toast stays visible
      // navigate("/"); // do NOT navigate immediately
    } else {
      setError("Appointment booking failed. Please try again.");
    }
  } catch (err) {
    console.error("Appointment creation error:", err);
    setError("An unexpected error occurred");
  }
};


  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  const handleBackToDoctors = () => {
    navigate("/doctors", { state: { hospitalId, hospitalName, hospitalAddress } });
  };

  const today = new Date().toISOString().split("T")[0]; // min date

  return (
    <Container className="my-4">
      <Button variant="link" className="mb-3" onClick={handleBackToDoctors}>
        ← Back to Doctors
      </Button>

      <Card className="shadow-sm p-4">
        <Card.Title className="text-center mb-4">Book Appointment</Card.Title>
        <Card.Text className="text-center mb-4 text-muted">
          Fill in the details to book your appointment
        </Card.Text>

        {/* Selected Hospital & Doctor Info */}
        <Row className="mb-4">
          <Col md={6}>
            <Card bg="info" text="white" className="p-3 mb-2">
              <Card.Title>Selected Hospital</Card.Title>
              <Card.Text>{hospitalName}</Card.Text>
              <Card.Text className="small">{hospitalAddress}</Card.Text>
            </Card>
          </Col>
          <Col md={6}>
            <Card bg="success" text="white" className="p-3 mb-2">
              <Card.Title>Selected Doctor</Card.Title>
              <Card.Text>{doctorName}</Card.Text>
              <Card.Text className="small">{doctorSpecialisation}</Card.Text>
              <Card.Text className="small">{doctorEmail}</Card.Text>
            </Card>
          </Col>
        </Row>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Appointment Form */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Appointment Date & Time *</Form.Label>
            <Form.Control
              type="datetime-local"
              value={formData.appointmentTime}
              onChange={handleInputChange("appointmentTime")}
              min={today}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description / Symptoms *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.description}
              onChange={handleInputChange("description")}
              placeholder="Describe your symptoms or reason for appointment..."
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="This is an emergency appointment"
              checked={formData.isEmergency}
              onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="secondary" className="flex-grow-1" onClick={handleBackToDoctors}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-grow-1" disabled={isLoading}>
              {isLoading ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </Form>
      </Card>

      {/* Success Toast */}
     <ToastContainer position="top-end" className="p-3">
  <Toast show={showToast} onClose={() => {setShowToast(false) 
navigate("/");
  }} bg="success">
    <Toast.Header closeButton={true}>
      <strong className="me-auto">Appointment Confirmed ✅</strong>
      <small>Just now</small>
    </Toast.Header>
    <Toast.Body>
      Your appointment with Dr. {doctorName} on {new Date(formData.appointmentTime).toLocaleString()} has been booked successfully!
    </Toast.Body>
  </Toast>
</ToastContainer>

    </Container>
  );
}
