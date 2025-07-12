import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaPlus, FaExchangeAlt, FaCog, FaHome } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const NavigationBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to={isAuthenticated ? "/home" : "/"} className="fw-bold fs-4">
          <FaExchangeAlt className="me-2" />
          ReWear
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/home" className="fw-semibold">
                  <FaHome className="me-1" />
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/browse" className="fw-semibold">
                  Browse Items
                </Nav.Link>
                <Nav.Link as={Link} to="/add-item" className="fw-semibold">
                  <FaPlus className="me-1" />
                  List Item
                </Nav.Link>
                <Nav.Link as={Link} to="/swaps" className="fw-semibold">
                  <FaExchangeAlt className="me-1" />
                  Swaps
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className="fw-semibold">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="fw-semibold">
                  Browse Items
                </Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Item className="d-flex align-items-center me-3">
                  <span className="text-light fw-semibold">
                    <FaUser className="me-1" />
                    {user?.username || user?.name}
                  </span>
                  <span className="badge bg-warning text-dark ms-2">
                    {user?.points} pts
                  </span>
                </Nav.Item>
                
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                    <FaCog />
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/dashboard">
                      <FaUser className="me-2" />
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile">
                      <FaUser className="me-2" />
                      Profile
                    </Dropdown.Item>
                    {user?.role === 'admin' && (
                      <Dropdown.Item as={Link} to="/admin">
                        <FaCog className="me-2" />
                        Admin Panel
                      </Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="fw-semibold">
                  Login
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/signup" 
                  variant="outline-light" 
                  className="fw-semibold"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 