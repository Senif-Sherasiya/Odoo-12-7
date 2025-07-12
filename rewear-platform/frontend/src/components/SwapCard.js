import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SwapCard = ({ swap, onAccept, onReject, onCancel }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'secondary';
      default:
        return 'light';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <Badge bg={getStatusColor(swap.status)} className="me-2">
            {swap.status?.toUpperCase()}
          </Badge>
          <small className="text-muted">
            {formatDate(swap.createdAt)}
          </small>
        </div>
        <div>
          <small className="text-muted">Swap #{swap._id.slice(-6)}</small>
        </div>
      </Card.Header>
      
      <Card.Body>
        <Row>
          <Col md={6}>
            <h6 className="text-primary mb-2">Your Item</h6>
            <div className="d-flex align-items-center mb-3">
              <img
                src={swap.itemId?.images?.[0] || '/placeholder-item.jpg'}
                alt={swap.itemId?.title}
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                className="rounded me-3"
              />
              <div>
                <h6 className="mb-1">{swap.itemId?.title}</h6>
                <p className="text-muted small mb-1">
                  {swap.itemId?.category} • {swap.itemId?.condition}
                </p>
                <span className="fw-bold text-primary">
                  {swap.itemId?.pointValue} points
                </span>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <h6 className="text-success mb-2">Their Item</h6>
            <div className="d-flex align-items-center mb-3">
              <img
                src={swap.offeredItem?.images?.[0] || '/placeholder-item.jpg'}
                alt={swap.offeredItem?.title}
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                className="rounded me-3"
              />
              <div>
                <h6 className="mb-1">{swap.offeredItem?.title}</h6>
                <p className="text-muted small mb-1">
                  {swap.offeredItem?.category} • {swap.offeredItem?.condition}
                </p>
                <span className="fw-bold text-primary">
                  {swap.offeredItem?.pointValue} points
                </span>
              </div>
            </div>
          </Col>
        </Row>
        
        {swap.message && (
          <div className="mt-3 p-3 bg-light rounded">
            <h6 className="mb-2">Message:</h6>
            <p className="mb-0 text-muted">{swap.message}</p>
          </div>
        )}
        
        <div className="mt-3 d-flex gap-2">
          <Link 
            to={`/item/${swap.itemId?._id}`} 
            className="btn btn-outline-primary btn-sm"
          >
            View Your Item
          </Link>
          {swap.offeredItem && (
            <Link 
              to={`/item/${swap.offeredItem?._id}`} 
              className="btn btn-outline-success btn-sm"
            >
              View Their Item
            </Link>
          )}
        </div>
      </Card.Body>
      
      {swap.status === 'pending' && (
        <Card.Footer>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small className="text-muted">
                {swap.isInitiator ? 'You initiated this swap' : 'You received this swap request'}
              </small>
            </div>
            
            <div className="d-flex gap-2">
              {!swap.isInitiator && (
                <>
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => onAccept(swap._id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => onReject(swap._id)}
                  >
                    Reject
                  </Button>
                </>
              )}
              
              {swap.isInitiator && (
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => onCancel(swap._id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </Card.Footer>
      )}
      
      {swap.status === 'accepted' && (
        <Card.Footer className="bg-success bg-opacity-10">
          <div className="text-center">
            <h6 className="text-success mb-2">Swap Accepted!</h6>
            <p className="text-muted small mb-0">
              Contact each other to arrange the exchange. 
              Points will be transferred once both parties confirm the swap is complete.
            </p>
          </div>
        </Card.Footer>
      )}
      
      {swap.status === 'declined' && (
        <Card.Footer className="bg-danger bg-opacity-10">
          <div className="text-center">
            <h6 className="text-danger mb-2">Swap Rejected</h6>
            {swap.reason && (
              <p className="text-muted small mb-0">
                Reason: {swap.reason}
              </p>
            )}
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default SwapCard; 