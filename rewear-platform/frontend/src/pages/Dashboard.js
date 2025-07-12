import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUser, FaTshirt, FaExchangeAlt, FaCoins, FaPlus, FaSearch, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import itemService from '../services/itemService';
import swapService from '../services/swapService';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemCard from '../components/ItemCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [pendingSwaps, setPendingSwaps] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [userStats, items, swaps] = await Promise.all([
        userService.getStats(),
        itemService.getMyItems(),
        swapService.getMySwaps()
      ]);

      setStats(userStats);
      
      // Handle different response formats for items
      const itemsArray = Array.isArray(items) ? items : (items.items || items.data || []);
      setRecentItems(itemsArray.slice(0, 3)); // Show only 3 most recent items
      
      // Handle different response formats for swaps
      const swapsArray = Array.isArray(swaps) ? swaps : (swaps.swaps || swaps.data || []);
      setPendingSwaps(swapsArray.filter(swap => swap.status === 'pending').slice(0, 3));
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  const getLevelInfo = (points) => {
    if (points < 100) return { level: 'Bronze', color: 'warning', nextLevel: 100 };
    if (points < 500) return { level: 'Silver', color: 'secondary', nextLevel: 500 };
    if (points < 1000) return { level: 'Gold', color: 'warning', nextLevel: 1000 };
    if (points < 2000) return { level: 'Platinum', color: 'info', nextLevel: 2000 };
    return { level: 'Diamond', color: 'primary', nextLevel: null };
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const levelInfo = getLevelInfo(stats?.totalPoints || 0);
  const progress = levelInfo.nextLevel 
    ? ((stats?.totalPoints || 0) / levelInfo.nextLevel) * 100 
    : 100;

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
            <FaUser className="me-3" />
            Welcome back, {user?.username}!
          </h1>
          <p className="text-muted">Here's what's happening with your sustainable fashion journey</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaCoins className="text-warning fs-1 mb-3" />
              <h3 className="fw-bold text-primary">{stats?.totalPoints || 0}</h3>
              <p className="text-muted mb-2">Total Points</p>
              <Badge bg={levelInfo.color} className="fs-6">{levelInfo.level}</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaTshirt className="text-success fs-1 mb-3" />
              <h3 className="fw-bold text-info">{stats?.itemsListed || 0}</h3>
              <p className="text-muted mb-0">Items Listed</p>
              <small className="text-muted">Available for swap</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaExchangeAlt className="text-primary fs-1 mb-3" />
              <h3 className="fw-bold text-success">{stats?.swapsCompleted || 0}</h3>
              <p className="text-muted mb-0">Swaps Completed</p>
              <small className="text-muted">Successful exchanges</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaClock className="text-warning fs-1 mb-3" />
              <h3 className="fw-bold text-warning">{pendingSwaps.length}</h3>
              <p className="text-muted mb-0">Pending Swaps</p>
              <small className="text-muted">Awaiting response</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Level Progress */}
      {levelInfo.nextLevel && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Level Progress</h6>
                  <small className="text-muted">
                    {stats?.totalPoints || 0} / {levelInfo.nextLevel} points
                  </small>
                </div>
                <ProgressBar 
                  now={progress} 
                  variant={levelInfo.color}
                  className="mb-2"
                />
                <small className="text-muted">
                  {levelInfo.nextLevel - (stats?.totalPoints || 0)} more points to reach {levelInfo.nextLevel} points
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Link to="/add-item" className="btn btn-primary w-100 mb-2">
                    <FaPlus className="me-2" />
                    Add New Item
                  </Link>
                </Col>
                <Col md={3}>
                  <Link to="/browse" className="btn btn-outline-primary w-100 mb-2">
                    <FaSearch className="me-2" />
                    Browse Items
                  </Link>
                </Col>
                <Col md={3}>
                  <Link to="/swaps" className="btn btn-outline-success w-100 mb-2">
                    <FaExchangeAlt className="me-2" />
                    View Swaps
                  </Link>
                </Col>
                <Col md={3}>
                  <Link to="/profile" className="btn btn-outline-secondary w-100 mb-2">
                    <FaUser className="me-2" />
                    My Profile
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User's Uploaded Items */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Uploaded Items</h5>
              <Link to="/add-item" className="btn btn-sm btn-outline-primary">Add New Item</Link>
            </Card.Header>
            <Card.Body>
              {recentItems.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">You haven't listed any items yet.</p>
                  <Link to="/add-item" className="btn btn-primary">
                    <FaPlus className="me-2" />
                    List Your First Item
                  </Link>
                </div>
              ) : (
                <Row>
                  {recentItems.map(item => (
                    <Col key={item._id} lg={4} md={6} className="mb-3">
                      <ItemCard item={item} showActions={true} />
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Items */}
      {recentItems.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Items</h5>
                <Link to="/browse" className="btn btn-sm btn-outline-primary">View All</Link>
              </Card.Header>
              <Card.Body>
                <Row>
                  {recentItems.map(item => (
                    <Col key={item._id} lg={4} md={6} className="mb-3">
                      <ItemCard item={item} showActions={true} />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Pending Swaps */}
      {pendingSwaps.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Pending Swap Requests</h5>
                <Link to="/swaps" className="btn btn-sm btn-outline-success">View All</Link>
              </Card.Header>
              <Card.Body>
                <div className="alert alert-warning">
                  <FaClock className="me-2" />
                  You have {pendingSwaps.length} pending swap request{pendingSwaps.length > 1 ? 's' : ''} that need your attention.
                  <Link to="/swaps" className="btn btn-sm btn-warning ms-3">Review Now</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Empty State */}
      {recentItems.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm text-center py-5">
              <Card.Body>
                <FaTshirt className="display-1 text-muted mb-3" />
                <h5>No items listed yet</h5>
                <p className="text-muted">Start your sustainable fashion journey by listing your first item!</p>
                <Link to="/add-item" className="btn btn-primary">
                  <FaPlus className="me-2" />
                  List Your First Item
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard; 