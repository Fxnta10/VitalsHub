import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const { authUser } = useAuthStore();

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await axios.get(
          `http://localhost:5002/api/appointments/patient/${authUser._id}`
        );
        setAppointments(res.data.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchAppointments();
  }, [authUser]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">My Appointments</h2>
      <Row>
        {appointments.map((appointment) => (
          <Col md={6} lg={4} key={appointment._id} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="text-primary">
                  {appointment.doctorId.name}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {appointment.doctorId.specialisation}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Time:</strong>{" "}
                  {new Date(appointment.appointmentTime).toLocaleString()}
                </Card.Text>
                <Card.Text>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      appointment.status === "Confirmed"
                        ? "text-success"
                        : appointment.status === "Pending"
                        ? "text-warning"
                        : "text-danger"
                    }
                  >
                    {appointment.status}
                  </span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
