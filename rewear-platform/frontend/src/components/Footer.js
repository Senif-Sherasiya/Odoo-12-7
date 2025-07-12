import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaLeaf, FaRecycle, FaHeart, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5 className="text-success mb-3">
              <FaLeaf className="me-2" />
              ReWear
            </h5>
            <p className="text-muted">
              Join the sustainable fashion revolution. Exchange clothes, reduce waste, 
              and build a community that cares about our planet.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted fs-5">
                <FaGithub />
              </a>
              <a href="#" className="text-muted fs-5">
                <FaTwitter />
              </a>
              <a href="#" className="text-muted fs-5">
                <FaInstagram />
              </a>
            </div>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="text-success mb-3">Platform</h6>
            <ul className="list-unstyled">
              <li><a href="/browse" className="text-muted text-decoration-none">Browse Items</a></li>
              <li><a href="/add-item" className="text-muted text-decoration-none">List Item</a></li>
                              <li><a href="/swaps" className="text-muted text-decoration-none">My Swaps</a></li>
              <li><a href="/dashboard" className="text-muted text-decoration-none">Dashboard</a></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="text-success mb-3">Support</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">Help Center</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Contact Us</a></li>
              <li><a href="#" className="text-muted text-decoration-none">FAQ</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Safety Tips</a></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="text-success mb-3">About</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">Our Mission</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Sustainability</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Team</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Careers</a></li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="text-success mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Terms of Service</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Cookie Policy</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Community Guidelines</a></li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted mb-0">
              © 2024 ReWear. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted mb-0">
              <FaRecycle className="me-2 text-success" />
              Built with <FaHeart className="text-danger" /> for a sustainable future
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 