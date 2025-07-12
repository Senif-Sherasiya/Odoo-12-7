import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ItemCard = ({ item, showActions = false, onSwap, onEdit, onDelete }) => {
  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'clothing': 'primary',
      'shoes': 'secondary',
      'accessories': 'info',
      'jewelry': 'warning',
      'bags': 'dark',
      'other': 'light'
    };
    return colors[category?.toLowerCase()] || 'light';
  };

  return (
    <Card className="h-100 shadow-sm hover-shadow">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={item.images?.[0] || '/placeholder-item.jpg'}
          alt={item.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <Badge bg={getConditionColor(item.condition)}>
            {item.condition}
          </Badge>
        </div>
        {item.isNew && (
          <div className="position-absolute top-0 start-0 m-2">
            <Badge bg="danger">NEW</Badge>
          </div>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg={getCategoryColor(item.category)} className="me-1">
            {item.category}
          </Badge>
          {item.brand && (
            <Badge bg="outline-secondary" text="secondary">
              {item.brand}
            </Badge>
          )}
        </div>
        
        <Card.Title className="h6 mb-2">{item.title}</Card.Title>
        <Card.Text className="text-muted small mb-2">
          {item.description?.length > 100 
            ? `${item.description.substring(0, 100)}...` 
            : item.description}
        </Card.Text>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold text-primary">
              {item.pointValue} points
            </span>
            <small className="text-muted">
              Size: {item.size}
            </small>
          </div>
          
          <div className="d-flex gap-2">
            <Link to={`/item/${item._id}`} className="btn btn-outline-primary btn-sm flex-fill">
              View Details
            </Link>
            
            {showActions && (
              <>
                {onSwap && (
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => onSwap(item)}
                  >
                    Swap
                  </Button>
                )}
                {onEdit && (
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => onDelete(item._id)}
                  >
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Card.Body>
      
      <Card.Footer className="bg-transparent">
        <small className="text-muted">
          Posted by {item.uploader?.name || 'Unknown'} • {new Date(item.createdAt).toLocaleDateString()}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default ItemCard; 