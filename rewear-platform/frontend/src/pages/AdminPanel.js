import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaCog, FaUsers, FaTshirt, FaCheck, FaTimes } from 'react-icons/fa';

const AdminPanel = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <h1 className="fw-bold text-success mb-4">
            <FaCog className="me-3" />
            Admin Panel
          </h1>
        </Col>
      </Row>

      {/* Coming Soon Message */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <h2 className="text-success mb-3">Admin Panel Coming Soon!</h2>
              <p className="text-muted mb-4">
                This page will provide admin tools for managing users, approving items, 
                viewing platform statistics, and moderating content.
              </p>
              <div className="d-flex justify-content-center gap-3 mb-4">
                <Button variant="success" size="lg">
                  <FaCheck className="me-2" />
                  Approve Items
                </Button>
                <Button variant="danger" size="lg">
                  <FaTimes className="me-2" />
                  Reject Items
                </Button>
                <Button variant="primary" size="lg">
                  <FaUsers className="me-2" />
                  Manage Users
                </Button>
                <Button variant="info" size="lg">
                  <FaTshirt className="me-2" />
                  View Statistics
                </Button>
              </div>
              <Badge bg="success" className="fs-6 p-2">
                🚧 Under Development
              </Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel; 