import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { 
  FaExchangeAlt, 
  FaLeaf, 
  FaUsers, 
  FaRecycle, 
  FaHeart, 
  FaArrowRight,
  FaTshirt,
  FaCoins,
  FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <FaExchangeAlt className="text-success fs-1" />,
      title: "Direct Swaps",
      description: "Exchange clothes directly with other users in your community"
    },
    {
      icon: <FaCoins className="text-warning fs-1" />,
      title: "Points System",
      description: "Earn and spend points to redeem items you love"
    },
    {
      icon: <FaLeaf className="text-success fs-1" />,
      title: "Sustainable",
      description: "Reduce textile waste and promote circular fashion"
    },
    {
      icon: <FaUsers className="text-primary fs-1" />,
      title: "Community",
      description: "Join a community of conscious fashion lovers"
    },
    {
      icon: <FaShieldAlt className="text-info fs-1" />,
      title: "Safe & Secure",
      description: "Verified users and secure exchange system"
    },
    {
      icon: <FaRecycle className="text-success fs-1" />,
      title: "Easy Process",
      description: "Simple upload, browse, and exchange process"
    }
  ];

  const stats = [
    { number: "1000+", label: "Items Exchanged" },
    { number: "500+", label: "Happy Users" },
    { number: "50+", label: "Cities Covered" },
    { number: "100%", label: "Sustainable" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-success text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">
                Sustainable Fashion Exchange Platform
              </h1>
              <p className="lead mb-4">
                Join ReWear and be part of the sustainable fashion revolution. 
                Exchange clothes, reduce waste, and build a community that cares about our planet.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button 
                  as={Link} 
                  to="/signup" 
                  size="lg" 
                  variant="light" 
                  className="fw-bold"
                >
                  Start Swapping
                  <FaArrowRight className="ms-2" />
                </Button>
                <Button 
                  as={Link} 
                  to="/login" 
                  size="lg" 
                  variant="outline-light" 
                  className="fw-bold"
                >
                  Browse Items
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="position-relative">
                <div className="bg-white bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '300px', height: '300px' }}>
                  <FaExchangeAlt className="text-white" style={{ fontSize: '8rem' }} />
                </div>
                <div className="position-absolute top-0 start-100 translate-middle">
                  <Badge bg="warning" text="dark" className="fs-6 p-2">
                    <FaLeaf className="me-1" />
                    Eco-Friendly
                  </Badge>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            {stats.map((stat, index) => (
              <Col md={3} key={index} className="mb-4">
                <div className="p-4">
                  <h2 className="text-success fw-bold mb-2">{stat.number}</h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Why Choose ReWear?</h2>
              <p className="lead text-muted">
                Discover the benefits of joining our sustainable fashion community
              </p>
            </Col>
          </Row>
          <Row>
            {features.map((feature, index) => (
              <Col lg={4} md={6} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow-sm text-center">
                  <Card.Body className="p-4">
                    <div className="mb-3">
                      {feature.icon}
                    </div>
                    <Card.Title className="fw-bold mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">How It Works</h2>
              <p className="lead text-muted">
                Get started in just three simple steps
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <span className="fs-3 fw-bold">1</span>
              </div>
              <h4 className="fw-bold mb-3">Upload Your Items</h4>
              <p className="text-muted">
                Take photos and describe your clothes. Set point values and wait for approval.
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <span className="fs-3 fw-bold">2</span>
              </div>
              <h4 className="fw-bold mb-3">Browse & Connect</h4>
              <p className="text-muted">
                Discover items from other users. Send swap requests or redeem with points.
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <span className="fs-3 fw-bold">3</span>
              </div>
              <h4 className="fw-bold mb-3">Exchange & Enjoy</h4>
              <p className="text-muted">
                Complete the exchange and enjoy your new sustainable fashion items.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-success text-white">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="display-5 fw-bold mb-4">
                Ready to Start Your Sustainable Fashion Journey?
              </h2>
              <p className="lead mb-4">
                Join thousands of users who are already making a difference
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button 
                  as={Link} 
                  to="/signup" 
                  size="lg" 
                  variant="light" 
                  className="fw-bold"
                >
                  <FaTshirt className="me-2" />
                  List Your First Item
                </Button>
                <Button 
                  as={Link} 
                  to="/login" 
                  size="lg" 
                  variant="outline-light" 
                  className="fw-bold"
                >
                  <FaHeart className="me-2" />
                  Explore Items
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage; 