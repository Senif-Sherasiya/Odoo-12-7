import React from 'react';
import { Carousel, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart } from 'react-icons/fa';

const FeaturedCarousel = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Carousel 
      className="mb-4" 
      indicators={true}
      controls={true}
      interval={5000}
      pause="hover"
    >
      {items.map((item, index) => (
        <Carousel.Item key={item._id || index}>
          <div className="position-relative">
            <img
              className="d-block w-100"
              src={item.images?.[0] || 'https://via.placeholder.com/800x400?text=Featured+Item'}
              alt={item.title}
              style={{ 
                height: '400px', 
                objectFit: 'cover',
                backgroundColor: '#f8f9fa'
              }}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end">
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <Card className="border-0 shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg="success" className="mb-2">
                            {item.category}
                          </Badge>
                          <div className="d-flex align-items-center">
                            <FaStar className="text-warning me-1" />
                            <small className="text-muted">Featured</small>
                          </div>
                        </div>
                        <Card.Title className="h4 mb-2">{item.title}</Card.Title>
                        <Card.Text className="text-muted mb-3">
                          {item.description?.substring(0, 100)}...
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="h5 text-primary mb-0">{item.pointValue} points</span>
                            <small className="text-muted d-block">{item.condition}</small>
                          </div>
                          <Link 
                            to={`/item/${item._id}`} 
                            className="btn btn-primary"
                          >
                            View Details
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default FeaturedCarousel; 