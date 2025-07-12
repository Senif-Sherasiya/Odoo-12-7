import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import itemService from '../services/itemService';
import LoadingSpinner from '../components/LoadingSpinner';
import SwapModal from '../components/SwapModal';
import { FaArrowLeft, FaUser, FaCoins, FaExchangeAlt } from 'react-icons/fa';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapType, setSwapType] = useState('swap');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await itemService.getItem(id);
        setItem(data);
      } catch (err) {
        setError('Item not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSwapClick = (type) => {
    if (!user) {
      alert('Please log in to make a swap request');
      return;
    }
    
    if (item.uploader?._id === user._id) {
      alert('You cannot swap with your own item');
      return;
    }
    
    setSwapType(type);
    setShowSwapModal(true);
  };

  const handleSwapSuccess = () => {
    // Optionally refresh the item data or show success message
    console.log('Swap request sent successfully');
  };

  if (loading) return <LoadingSpinner text="Loading item..." />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!item) return null;

  const isOwnItem = user && item.uploader?._id === user._id;

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <Button as={Link} to="/browse" variant="outline-secondary" className="mb-3">
            <FaArrowLeft className="me-2" /> Back to Browse
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            {item.images && item.images.length > 0 && (
              <Card.Img variant="top" src={item.images[0]} style={{ objectFit: 'cover', height: 350 }} />
            )}
            <Card.Body>
              <Card.Title className="h3 mb-2">{item.title}</Card.Title>
              <Badge bg="info" className="me-2">{item.category}</Badge>
              <Badge bg="secondary" className="me-2">{item.type}</Badge>
              <Badge bg="light" text="dark">{item.size}</Badge>
              <div className="mt-3">
                <span className="fw-bold">Condition:</span> {item.condition}
              </div>
              <div className="mt-2">
                <span className="fw-bold">Brand:</span> {item.brand || 'N/A'}
              </div>
              <div className="mt-2">
                <span className="fw-bold">Color:</span> {item.color || 'N/A'}
              </div>
              <div className="mt-2">
                <span className="fw-bold">Points:</span> <FaCoins className="text-warning" /> {item.pointValue}
              </div>
              <div className="mt-2">
                <span className="fw-bold">Status:</span> {item.status}
              </div>
              <div className="mt-2">
                <span className="fw-bold">Uploaded:</span> {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">Description</h5>
              <Card.Text>{item.description}</Card.Text>
              <hr />
              <div className="mb-3">
                <FaUser className="me-2" />
                <span className="fw-semibold">Owner:</span> {item.uploader?.name || 'N/A'}
              </div>
              <div className="mb-3">
                <span className="fw-semibold">Views:</span> {item.views || 0}
              </div>
              <div className="mb-3">
                <span className="fw-semibold">Likes:</span> {item.likeCount || 0}
              </div>
              
              {!isOwnItem && item.status === 'available' && (
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    onClick={() => handleSwapClick('swap')}
                    disabled={!user}
                  >
                    <FaExchangeAlt className="me-2" />
                    Request Swap
                  </Button>
                  <Button 
                    variant="outline-success"
                    onClick={() => handleSwapClick('redeem')}
                    disabled={!user}
                  >
                    <FaCoins className="me-2" />
                    Redeem with Points
                  </Button>
                </div>
              )}
              
              {isOwnItem && (
                <Alert variant="info">
                  <strong>This is your item.</strong> You cannot swap with your own items.
                </Alert>
              )}
              
              {item.status !== 'available' && (
                <Alert variant="warning">
                  <strong>Item not available.</strong> This item is currently {item.status}.
                </Alert>
              )}
            </Card.Body>
          </Card>
          {item.images && item.images.length > 1 && (
            <Card className="mb-4">
              <Card.Body>
                <h6 className="fw-bold mb-2">More Images</h6>
                <Row>
                  {item.images.slice(1).map((img, idx) => (
                    <Col key={idx} xs={6} className="mb-2">
                      <img src={img} alt={`Item ${idx + 2}`} className="img-fluid rounded" style={{ maxHeight: 120, objectFit: 'cover' }} />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Swap Modal */}
      <SwapModal
        show={showSwapModal}
        onHide={() => setShowSwapModal(false)}
        item={item}
        onSuccess={handleSwapSuccess}
      />
    </Container>
  );
};

export default ItemDetail; 