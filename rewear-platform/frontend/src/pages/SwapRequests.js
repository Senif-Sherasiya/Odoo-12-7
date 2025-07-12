import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Tab, Nav } from 'react-bootstrap';
import { FaExchangeAlt, FaClock, FaCheck, FaTimes, FaHistory } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import swapService from '../services/swapService';
import LoadingSpinner from '../components/LoadingSpinner';
import SwapCard from '../components/SwapCard';

const SwapRequests = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sent');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Swap data
  const [sentSwaps, setSentSwaps] = useState([]);
  const [receivedSwaps, setReceivedSwaps] = useState([]);
  const [swapHistory, setSwapHistory] = useState([]);

  useEffect(() => {
    loadSwapData();
  }, []);

  const loadSwapData = async () => {
    try {
      setLoading(true);
      const [mySwaps, received, history] = await Promise.all([
        swapService.getMySwaps(),
        swapService.getReceivedSwaps(),
        swapService.getSwapHistory()
      ]);

      setSentSwaps(mySwaps.filter(swap => swap.status === 'pending'));
      setReceivedSwaps(received.filter(swap => swap.status === 'pending'));
      setSwapHistory(history);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to load swap data' });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSwap = async (swapId) => {
    try {
      await swapService.acceptSwap(swapId);
      setMessage({ type: 'success', text: 'Swap accepted successfully!' });
      loadSwapData(); // Reload data
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to accept swap' });
    }
  };

  const handleRejectSwap = async (swapId) => {
    const reason = window.prompt('Please provide a reason for rejection (optional):');
    try {
      await swapService.rejectSwap(swapId);
      setMessage({ type: 'success', text: 'Swap rejected successfully!' });
      loadSwapData(); // Reload data
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to reject swap' });
    }
  };

  const handleCancelSwap = async (swapId) => {
    if (window.confirm('Are you sure you want to cancel this swap request?')) {
      try {
        await swapService.cancelSwap(swapId);
        setMessage({ type: 'success', text: 'Swap cancelled successfully!' });
        loadSwapData(); // Reload data
      } catch (error) {
        setMessage({ type: 'danger', text: 'Failed to cancel swap' });
      }
    }
  };

  const getStatusCounts = () => {
    const sentPending = sentSwaps.length;
    const receivedPending = receivedSwaps.length;
    const completed = swapHistory.filter(swap => swap.status === 'completed').length;
    const total = sentPending + receivedPending + completed;
    
    return { sentPending, receivedPending, completed, total };
  };

  if (loading) {
    return <LoadingSpinner text="Loading swap requests..." />;
  }

  const statusCounts = getStatusCounts();

  return (
    <Container className="py-4">
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-success mb-2">
            <FaExchangeAlt className="me-3" />
            Swap Requests
          </h1>
          <p className="text-muted">
            Manage your swap requests and track your exchange history
          </p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaClock className="text-warning fs-1 mb-3" />
              <h3 className="fw-bold text-warning">{statusCounts.sentPending}</h3>
              <p className="text-muted mb-0">Sent Requests</p>
              <small className="text-muted">Awaiting response</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaExchangeAlt className="text-primary fs-1 mb-3" />
              <h3 className="fw-bold text-primary">{statusCounts.receivedPending}</h3>
              <p className="text-muted mb-0">Received Requests</p>
              <small className="text-muted">Need your attention</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaCheck className="text-success fs-1 mb-3" />
              <h3 className="fw-bold text-success">{statusCounts.completed}</h3>
              <p className="text-muted mb-0">Completed Swaps</p>
              <small className="text-muted">Successful exchanges</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaHistory className="text-info fs-1 mb-3" />
              <h3 className="fw-bold text-info">{statusCounts.total}</h3>
              <p className="text-muted mb-0">Total Swaps</p>
              <small className="text-muted">All time</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent">
              <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="sent">
                    <FaClock className="me-2" />
                    Sent Requests
                    {statusCounts.sentPending > 0 && (
                      <Badge bg="warning" className="ms-2">{statusCounts.sentPending}</Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="received">
                    <FaExchangeAlt className="me-2" />
                    Received Requests
                    {statusCounts.receivedPending > 0 && (
                      <Badge bg="primary" className="ms-2">{statusCounts.receivedPending}</Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="history">
                    <FaHistory className="me-2" />
                    Swap History
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane active={activeTab === 'sent'}>
                  {sentSwaps.length > 0 ? (
                    <div>
                      <h6 className="mb-3">Your Sent Swap Requests</h6>
                      {sentSwaps.map(swap => (
                        <SwapCard
                          key={swap._id}
                          swap={swap}
                          onCancel={handleCancelSwap}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <FaClock className="display-1 text-muted mb-3" />
                      <h5>No sent requests</h5>
                      <p className="text-muted">
                        You haven't sent any swap requests yet.
                      </p>
                      <Button variant="primary" href="/browse">
                        Browse Items to Swap
                      </Button>
                    </div>
                  )}
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'received'}>
                  {receivedSwaps.length > 0 ? (
                    <div>
                      <h6 className="mb-3">Swap Requests You've Received</h6>
                      {receivedSwaps.map(swap => (
                        <SwapCard
                          key={swap._id}
                          swap={swap}
                          onAccept={handleAcceptSwap}
                          onReject={handleRejectSwap}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <FaExchangeAlt className="display-1 text-muted mb-3" />
                      <h5>No received requests</h5>
                      <p className="text-muted">
                        You haven't received any swap requests yet.
                      </p>
                      <Button variant="primary" href="/add-item">
                        List More Items
                      </Button>
                    </div>
                  )}
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'history'}>
                  {swapHistory.length > 0 ? (
                    <div>
                      <h6 className="mb-3">Your Swap History</h6>
                      {swapHistory.map(swap => (
                        <SwapCard
                          key={swap._id}
                          swap={swap}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <FaHistory className="display-1 text-muted mb-3" />
                      <h5>No swap history</h5>
                      <p className="text-muted">
                        Complete your first swap to see your history here.
                      </p>
                      <Button variant="primary" href="/browse">
                        Start Swapping
                      </Button>
                    </div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Button variant="outline-primary" href="/browse" className="w-100 mb-2">
                    <FaExchangeAlt className="me-2" />
                    Browse Items
                  </Button>
                </Col>
                <Col md={4}>
                  <Button variant="outline-success" href="/add-item" className="w-100 mb-2">
                    <FaExchangeAlt className="me-2" />
                    Add New Item
                  </Button>
                </Col>
                <Col md={4}>
                  <Button variant="outline-info" href="/dashboard" className="w-100 mb-2">
                    <FaHistory className="me-2" />
                    View Dashboard
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SwapRequests; 