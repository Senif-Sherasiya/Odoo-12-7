import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaExchangeAlt, FaCoins, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import swapService from '../services/swapService';
import itemService from '../services/itemService';

const SwapModal = ({ show, onHide, item, onSuccess }) => {
  const { user } = useAuth();
  const [swapType, setSwapType] = useState('swap'); // 'swap' or 'redeem'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form states
  const [selectedItem, setSelectedItem] = useState('');
  const [pointsOffered, setPointsOffered] = useState('');
  const [messageText, setMessageText] = useState('');
  
  // User's items for swap
  const [userItems, setUserItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (show && swapType === 'swap') {
      loadUserItems();
    }
  }, [show, swapType]);

  const loadUserItems = async () => {
    try {
      setLoadingItems(true);
      const items = await itemService.getMyItems();
      const availableItems = Array.isArray(items) ? items : (items.items || items.data || []);
      setUserItems(availableItems.filter(item => item.status === 'available'));
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to load your items' });
    } finally {
      setLoadingItems(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: 'danger', text: 'Please log in to make a swap request' });
      return;
    }

    if (item.uploader?._id === user._id) {
      setMessage({ type: 'danger', text: 'You cannot swap with your own item' });
      return;
    }

    // Validate form
    if (swapType === 'swap' && !selectedItem) {
      setMessage({ type: 'danger', text: 'Please select an item to offer' });
      return;
    }

    if (swapType === 'redeem' && (!pointsOffered || pointsOffered <= 0)) {
      setMessage({ type: 'danger', text: 'Please enter a valid number of points' });
      return;
    }

    if (swapType === 'redeem' && pointsOffered > user.points) {
      setMessage({ type: 'danger', text: 'You don\'t have enough points' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const swapData = {
        itemId: item._id,
        type: swapType,
        message: messageText
      };

      if (swapType === 'swap') {
        swapData.offeredItem = selectedItem;
      } else {
        swapData.pointsOffered = parseInt(pointsOffered);
      }

      await swapService.createSwap(swapData);
      
      setMessage({ type: 'success', text: 'Swap request sent successfully!' });
      
      // Reset form
      setSelectedItem('');
      setPointsOffered('');
      setMessageText('');
      
      // Close modal after a short delay
      setTimeout(() => {
        onHide();
        if (onSuccess) onSuccess();
      }, 1500);
      
    } catch (error) {
      console.error('Swap error:', error);
      setMessage({ 
        type: 'danger', 
        text: error.message || 'Failed to create swap request' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage({ type: '', text: '' });
    setSelectedItem('');
    setPointsOffered('');
    setMessageText('');
    setSwapType('swap');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaExchangeAlt className="me-2" />
          Request Swap
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        {/* Item being requested */}
        <Card className="mb-4">
          <Card.Body>
            <h6 className="text-primary mb-3">Item You Want</h6>
            <Row>
              <Col md={3}>
                <img 
                  src={item?.images?.[0] || '/placeholder-item.jpg'} 
                  alt={item?.title}
                  className="img-fluid rounded"
                  style={{ maxHeight: '100px', objectFit: 'cover' }}
                />
              </Col>
              <Col md={9}>
                <h6 className="mb-1">{item?.title}</h6>
                <p className="text-muted small mb-1">
                  {item?.category} • {item?.condition} • {item?.size}
                </p>
                <Badge bg="primary" className="me-2">{item?.pointValue} points</Badge>
                <Badge bg="secondary">{item?.status}</Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Swap type selection */}
        <div className="mb-4">
          <h6 className="mb-3">Choose Swap Type</h6>
          <Row>
            <Col md={6}>
              <Card 
                className={`mb-3 cursor-pointer ${swapType === 'swap' ? 'border-primary' : ''}`}
                onClick={() => setSwapType('swap')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center">
                  <FaExchangeAlt className="fs-1 text-primary mb-2" />
                  <h6>Item Swap</h6>
                  <small className="text-muted">Exchange with one of your items</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card 
                className={`mb-3 cursor-pointer ${swapType === 'redeem' ? 'border-success' : ''}`}
                onClick={() => setSwapType('redeem')}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center">
                  <FaCoins className="fs-1 text-success mb-2" />
                  <h6>Redeem with Points</h6>
                  <small className="text-muted">Use your points to get this item</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        <Form onSubmit={handleSubmit}>
          {swapType === 'swap' && (
            <Form.Group className="mb-3">
              <Form.Label>Select Item to Offer</Form.Label>
              {loadingItems ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm me-2" />
                  Loading your items...
                </div>
              ) : userItems.length > 0 ? (
                <Form.Select 
                  value={selectedItem} 
                  onChange={(e) => setSelectedItem(e.target.value)}
                  required
                >
                  <option value="">Choose an item to offer...</option>
                  {userItems.map(userItem => (
                    <option key={userItem._id} value={userItem._id}>
                      {userItem.title} ({userItem.pointValue} points)
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Alert variant="warning">
                  You don't have any available items to swap. 
                  <br />
                  <Button variant="outline-primary" size="sm" href="/add-item" className="mt-2">
                    Add New Item
                  </Button>
                </Alert>
              )}
            </Form.Group>
          )}

          {swapType === 'redeem' && (
            <Form.Group className="mb-3">
              <Form.Label>Points to Offer</Form.Label>
              <Form.Control
                type="number"
                value={pointsOffered}
                onChange={(e) => setPointsOffered(e.target.value)}
                placeholder="Enter points amount"
                min="1"
                max={user?.points || 0}
                required
              />
              <Form.Text className="text-muted">
                Your available points: {user?.points || 0}
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Message (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Add a message to the item owner..."
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {messageText.length}/500 characters
            </Form.Text>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading || (swapType === 'swap' && userItems.length === 0)}
              className="flex-fill"
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" />
                  Sending Request...
                </>
              ) : (
                <>
                  <FaExchangeAlt className="me-2" />
                  Send Swap Request
                </>
              )}
            </Button>
            <Button variant="outline-secondary" onClick={handleClose}>
              <FaTimes className="me-2" />
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SwapModal; 