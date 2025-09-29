import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast, ToastContainer, Button, Form, Card, Row, Col, Container } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

export default function CreateAppointment() {
  const { authUser, createAppointment, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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
      alert(t('createAppointment.errors.notSelected')); // simpler than toast for now
      navigate("/hospitals");
    }
  }, [hospitalId, doctorId, navigate]);

  const validateForm = () => {
    const { hospitalId, patientId, doctorId, appointmentTime, description } = formData;
    if (!hospitalId || !patientId || !doctorId || !appointmentTime || !description) {
      setError(t('createAppointment.errors.required'));
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
      setError(t('createAppointment.errors.failed'));
    }
  } catch (err) {
    console.error("Appointment creation error:", err);
    setError(t('createAppointment.errors.unexpected'));
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
        {t('createAppointment.back')}
      </Button>

      <Card className="shadow-sm p-4">
        <Card.Title className="text-center mb-4">{t('createAppointment.title')}</Card.Title>
        <Card.Text className="text-center mb-4 text-muted">
          {t('createAppointment.subtitle')}
        </Card.Text>

        {/* Selected Hospital & Doctor Info */}
        <Row className="mb-4">
          <Col md={6}>
            <Card bg="info" text="white" className="p-3 mb-2">
              <Card.Title>{t('createAppointment.selectedHospital')}</Card.Title>
              <Card.Text>{hospitalName}</Card.Text>
              <Card.Text className="small">{hospitalAddress}</Card.Text>
            </Card>
          </Col>
          <Col md={6}>
            <Card bg="success" text="white" className="p-3 mb-2">
              <Card.Title>{t('createAppointment.selectedDoctor')}</Card.Title>
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
            <Form.Label>{t('createAppointment.form.appointmentDateTime')}</Form.Label>
            <Form.Control
              type="datetime-local"
              value={formData.appointmentTime}
              onChange={handleInputChange("appointmentTime")}
              min={today}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('createAppointment.form.descriptionLabel')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.description}
              onChange={handleInputChange("description")}
              placeholder={t('createAppointment.form.descriptionPlaceholder')}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label={t('createAppointment.form.emergencyLabel')}
              checked={formData.isEmergency}
              onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="secondary" className="flex-grow-1" onClick={handleBackToDoctors}>
              {t('createAppointment.buttons.cancel')}
            </Button>
            <Button variant="primary" type="submit" className="flex-grow-1" disabled={isLoading}>
              {isLoading ? t('createAppointment.buttons.booking') : t('createAppointment.buttons.bookAppointment')}
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
      <strong className="me-auto">{t('createAppointment.toast.title')}</strong>
      <small>{t('createAppointment.toast.justNow')}</small>
    </Toast.Header>
    <Toast.Body>
      {t('createAppointment.toast.body', { doctor: doctorName, dateTime: new Date(formData.appointmentTime).toLocaleString() })}
    </Toast.Body>
  </Toast>
</ToastContainer>

    </Container>
  );
}
