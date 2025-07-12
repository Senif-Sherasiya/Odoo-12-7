import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaTshirt, 
  FaExchangeAlt, 
  FaCoins, 
  FaStar, 
  FaHeart,
  FaSearch,
  FaPlus,
  FaUsers,
  FaRecycle,
  FaLeaf
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import itemService from '../services/itemService';
import FeaturedCarousel from '../components/Carousel';
import CategoryCard from '../components/CategoryCard';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      // Load all available items
      const response = await itemService.getAllItems({ status: 'available' });
      const allItems = Array.isArray(response) ? response : (response.items || []);

      // Get featured items (items with highest views or likes)
      const featured = allItems
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

      // Get recent items
      const recent = allItems
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

      setFeaturedItems(featured);
      setRecentItems(recent);

      // Create categories with real counts
      const categoryData = [
        { 
          name: 'Tops', 
          icon: 'FaTshirt',
          count: allItems.filter(item => item.category === 'tops').length,
          color: 'primary'
        },
        { 
          name: 'Bottoms', 
          icon: 'FaTshirt',
          count: allItems.filter(item => item.category === 'bottoms').length,
          color: 'success'
        },
        { 
          name: 'Dresses', 
          icon: 'FaTshirt',
          count: allItems.filter(item => item.category === 'dresses').length,
          color: 'info'
        },
        { 
          name: 'Outerwear', 
          icon: 'FaTshirt',
          count: allItems.filter(item => item.category === 'outerwear').length,
          color: 'warning'
        },
        { 
          name: 'Shoes', 
          icon: 'FaTshirt',
          count: allItems.filter(item => item.category === 'shoes').length,
          color: 'secondary'
        },
        { 
          name: 'Accessories', 
          icon: 'FaTshirt',
          count: allItems.filter(item => item.category === 'accessories').length,
          color: 'dark'
        }
      ];

      setCategories(categoryData);

      // Calculate stats
      const totalItems = allItems.length;
      const totalPoints = allItems.reduce((sum, item) => sum + (item.pointValue || 0), 0);
      const avgPoints = totalItems > 0 ? Math.round(totalPoints / totalItems) : 0;

      setStats({
        totalItems,
        totalPoints,
        avgPoints,
        totalUsers: Math.max(3, Math.ceil(totalItems / 2)) // Estimate based on items
      });

    } catch (error) {
      console.error('Error loading home data:', error);
      setMessage({ type: 'warning', text: 'Some data may not be available. Please try again.' });
      
      // Set fallback data
      setFeaturedItems([]);
      setRecentItems([]);
      setCategories([
        { name: 'Tops', icon: 'FaTshirt', count: 0, color: 'primary' },
        { name: 'Bottoms', icon: 'FaTshirt', count: 0, color: 'success' },
        { name: 'Dresses', icon: 'FaTshirt', count: 0, color: 'info' },
        { name: 'Outerwear', icon: 'FaTshirt', count: 0, color: 'warning' },
        { name: 'Shoes', icon: 'FaTshirt', count: 0, color: 'secondary' },
        { name: 'Accessories', icon: 'FaTshirt', count: 0, color: 'dark' }
      ]);
      setStats({ totalItems: 0, totalPoints: 0, avgPoints: 0, totalUsers: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading home..." />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section bg-gradient text-white py-5 mb-5" 
           style={{ 
             background: 'linear-gradient(135deg, #28a745 0%, #20c997 50%, #17a2b8 100%)',
             minHeight: '400px'
           }}>
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4 text-shadow">
                <FaLeaf className="me-3" />
                Sustainable Fashion Exchange
              </h1>
              <p className="lead mb-4 fs-5">
                Give your clothes a second life. Swap, exchange, and discover sustainable fashion 
                while earning points and reducing waste. Join the circular fashion revolution!
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/browse" className="btn btn-light btn-lg px-4 py-3 shadow-sm">
                  <FaSearch className="me-2" />
                  Browse Items
                </Link>
                <Link to="/add-item" className="btn btn-outline-light btn-lg px-4 py-3">
                  <FaPlus className="me-2" />
                  List Item
                </Link>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="position-relative">
                <div className="hero-icon-container">
                  <FaTshirt className="display-1 text-light opacity-25" />
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <FaExchangeAlt className="display-4 text-light" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}

        {/* Stats Section */}
        <section className="mb-5">
          <Row className="g-4">
            <Col md={3} sm={6}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body className="py-4">
                  <FaTshirt className="text-primary fs-1 mb-3" />
                  <h3 className="fw-bold text-primary">{stats.totalItems}</h3>
                  <p className="text-muted mb-0">Items Available</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body className="py-4">
                  <FaUsers className="text-success fs-1 mb-3" />
                  <h3 className="fw-bold text-success">{stats.totalUsers}</h3>
                  <p className="text-muted mb-0">Active Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body className="py-4">
                  <FaCoins className="text-warning fs-1 mb-3" />
                  <h3 className="fw-bold text-warning">{stats.totalPoints}</h3>
                  <p className="text-muted mb-0">Total Points</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body className="py-4">
                  <FaRecycle className="text-info fs-1 mb-3" />
                  <h3 className="fw-bold text-info">{stats.avgPoints}</h3>
                  <p className="text-muted mb-0">Avg Points/Item</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Featured Carousel */}
        {featuredItems.length > 0 && (
          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 fw-bold">
                <FaStar className="text-warning me-2" />
                Featured Items
              </h2>
              <Link to="/browse" className="btn btn-outline-primary">
                View All
              </Link>
            </div>
            <FeaturedCarousel items={featuredItems} />
          </section>
        )}

        {/* Categories Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold">
              <FaTshirt className="text-primary me-2" />
              Browse Categories
            </h2>
            <Link to="/browse" className="btn btn-outline-primary">
              View All Categories
            </Link>
          </div>
          <Row>
            {categories.map((category, index) => (
              <Col key={index} lg={4} md={6} className="mb-4">
                <CategoryCard category={category} />
              </Col>
            ))}
          </Row>
        </section>

        {/* Recent Items Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold">
              <FaExchangeAlt className="text-success me-2" />
              Latest Items
            </h2>
            <Link to="/browse" className="btn btn-outline-success">
              View All Items
            </Link>
          </div>
          
          {recentItems.length > 0 ? (
            <Row>
              {recentItems.map(item => (
                <Col key={item._id} lg={3} md={4} sm={6} className="mb-4">
                  <ItemCard item={item} showActions={false} />
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="text-center py-5 border-0 shadow-sm">
              <Card.Body>
                <FaTshirt className="display-1 text-muted mb-3" />
                <h5>No items available yet</h5>
                <p className="text-muted mb-4">
                  Be the first to list an item and start the sustainable fashion movement!
                </p>
                <Link to="/add-item" className="btn btn-primary">
                  <FaPlus className="me-2" />
                  List Your First Item
                </Link>
              </Card.Body>
            </Card>
          )}
        </section>

        {/* How It Works Section */}
        <section className="mb-5">
          <div className="text-center mb-5">
            <h2 className="h2 fw-bold mb-3">How ReWear Works</h2>
            <p className="text-muted lead">Three simple steps to sustainable fashion</p>
          </div>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div className="step-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                   style={{ width: '100px', height: '100px' }}>
                <FaPlus className="fs-1 text-primary" />
              </div>
              <h5 className="fw-bold mb-3">1. List Your Items</h5>
              <p className="text-muted">
                Upload photos and details of clothes you no longer wear. Set your point value and help others discover your items.
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="step-icon bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                   style={{ width: '100px', height: '100px' }}>
                <FaExchangeAlt className="fs-1 text-success" />
              </div>
              <h5 className="fw-bold mb-3">2. Swap or Redeem</h5>
              <p className="text-muted">
                Browse items from other users. Swap directly with your items or redeem using your earned points.
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="step-icon bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                   style={{ width: '100px', height: '100px' }}>
                <FaCoins className="fs-1 text-warning" />
              </div>
              <h5 className="fw-bold mb-3">3. Earn Points</h5>
              <p className="text-muted">
                Complete swaps to earn points. Use your points to redeem items you love and build your sustainable wardrobe.
              </p>
            </Col>
          </Row>
        </section>

        {/* Call to Action */}
        <section className="text-center py-5 bg-light rounded-3 shadow-sm">
          <h3 className="mb-3 fw-bold">Ready to Start Your Sustainable Fashion Journey?</h3>
          <p className="text-muted mb-4 lead">
            Join thousands of users who are making fashion more sustainable, one swap at a time.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/add-item" className="btn btn-primary btn-lg px-4 py-3">
              <FaPlus className="me-2" />
              List Your First Item
            </Link>
            <Link to="/browse" className="btn btn-outline-primary btn-lg px-4 py-3">
              <FaSearch className="me-2" />
              Explore Items
            </Link>
          </div>
        </section>
      </Container>

      <style jsx>{`
        .hero-section {
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }
        
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .step-icon {
          transition: transform 0.3s ease;
        }
        
        .step-icon:hover {
          transform: scale(1.1);
        }
        
        .min-vh-50 {
          min-height: 50vh;
        }
      `}</style>
    </div>
  );
};

export default Home; 