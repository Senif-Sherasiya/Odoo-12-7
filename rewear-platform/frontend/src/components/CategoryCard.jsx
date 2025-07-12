import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaTshirt, 
  FaShoePrints, 
  FaGem, 
  FaUserTie,
  FaUser,
  FaChild
} from 'react-icons/fa';

const CategoryCard = ({ category }) => {
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    switch (name) {
      case 'tops':
        return <FaTshirt className="fs-1" />;
      case 'bottoms':
        return <FaTshirt className="fs-1" />;
      case 'dresses':
        return <FaTshirt className="fs-1" />;
      case 'outerwear':
        return <FaTshirt className="fs-1" />;
      case 'shoes':
        return <FaShoePrints className="fs-1" />;
      case 'accessories':
        return <FaGem className="fs-1" />;
      case 'men':
        return <FaUserTie className="fs-1" />;
      case 'women':
        return <FaUser className="fs-1" />;
      case 'kids':
        return <FaChild className="fs-1" />;
      default:
        return <FaTshirt className="fs-1" />;
    }
  };

  const getCategoryColor = (categoryName) => {
    const name = categoryName.toLowerCase();
    switch (name) {
      case 'tops':
        return 'primary';
      case 'bottoms':
        return 'success';
      case 'dresses':
        return 'info';
      case 'outerwear':
        return 'warning';
      case 'shoes':
        return 'secondary';
      case 'accessories':
        return 'dark';
      case 'men':
        return 'primary';
      case 'women':
        return 'danger';
      case 'kids':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getCategoryDescription = (categoryName) => {
    const name = categoryName.toLowerCase();
    switch (name) {
      case 'tops':
        return 'Shirts, T-shirts, Blouses';
      case 'bottoms':
        return 'Pants, Jeans, Shorts';
      case 'dresses':
        return 'Casual & Formal Dresses';
      case 'outerwear':
        return 'Jackets, Coats, Hoodies';
      case 'shoes':
        return 'Sneakers, Boots, Sandals';
      case 'accessories':
        return 'Bags, Jewelry, Hats';
      default:
        return 'Fashion Items';
    }
  };

  const color = getCategoryColor(category.name);

  return (
    <Link 
      to={`/browse?category=${encodeURIComponent(category.name.toLowerCase())}`}
      className="text-decoration-none"
    >
      <Card className="h-100 border-0 shadow-sm category-card text-center hover-lift">
        <Card.Body className="p-4">
          <div className={`text-${color} mb-3 category-icon`}>
            {getCategoryIcon(category.name)}
          </div>
          <Card.Title className="h5 mb-2 fw-bold">{category.name}</Card.Title>
          <Card.Text className="text-muted small mb-3">
            {getCategoryDescription(category.name)}
          </Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <Badge bg={color} className="fs-6">
              {category.count || 0} items
            </Badge>
            <div className={`btn btn-outline-${color} btn-sm`}>
              Browse
            </div>
          </div>
        </Card.Body>
      </Card>

      <style jsx>{`
        .category-card {
          transition: all 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        
        .category-icon {
          transition: transform 0.3s ease;
        }
        
        .category-card:hover .category-icon {
          transform: scale(1.1);
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </Link>
  );
};

export default CategoryCard; 