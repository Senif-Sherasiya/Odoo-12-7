import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert, Pagination, Dropdown, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaSort, FaEye, FaHeart, FaTimes, FaSlidersH, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import itemService from '../services/itemService';
import swapService from '../services/swapService';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemCard from '../components/ItemCard';
import SwapModal from '../components/SwapModal';

const BrowseItems = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Swap modal state
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Available options
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'other', label: 'Other' }
  ];

  const conditions = [
    { value: '', label: 'All Conditions' },
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const sizes = [
    { value: '', label: 'All Sizes' },
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'XXXL', label: 'XXXL' },
    { value: 'One Size', label: 'One Size' }
  ];

  const types = [
    { value: '', label: 'All Types' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'kids', label: 'Kids' },
    { value: 'unisex', label: 'Unisex' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'points-low', label: 'Points: Low to High' },
    { value: 'points-high', label: 'Points: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'views', label: 'Most Viewed' }
  ];

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchTerm, selectedCategory, selectedCondition, selectedSize, selectedType, sortBy, priceRange]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems();
      const itemsArray = Array.isArray(response) ? response : (response.items || []);
      
      // Filter for available items only
      const availableItems = itemsArray.filter(item => item.status === 'available');
      setItems(availableItems);
    } catch (error) {
      console.error('Error loading items:', error);
      setMessage({ type: 'danger', text: 'Failed to load items. Please try again.' });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = [...items];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by condition
    if (selectedCondition) {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }

    // Filter by size
    if (selectedSize) {
      filtered = filtered.filter(item => item.size === selectedSize);
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(item => item.pointValue >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(item => item.pointValue <= parseInt(priceRange.max));
    }

    // Sort items
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'points-low':
        filtered.sort((a, b) => a.pointValue - b.pointValue);
        break;
      case 'points-high':
        filtered.sort((a, b) => b.pointValue - a.pointValue);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'views':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSwap = (item) => {
    if (!user) {
      setMessage({ type: 'warning', text: 'Please log in to initiate a swap' });
      return;
    }

    if (item.uploader?._id === user._id) {
      setMessage({ type: 'warning', text: 'You cannot swap with your own item' });
      return;
    }

    setSelectedItem(item);
    setShowSwapModal(true);
  };

  const handleSwapSuccess = () => {
    setMessage({ type: 'success', text: 'Swap request sent successfully!' });
    loadItems(); // Refresh items
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCondition('');
    setSelectedSize('');
    setSelectedType('');
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedCondition || selectedSize || selectedType || priceRange.min || priceRange.max;

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (loading) {
    return <LoadingSpinner text="Loading items..." />;
  }

  return (
    <Container className="py-4">
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-primary mb-2">
            <FaSearch className="me-3" />
            Browse Items
          </h1>
          <p className="text-muted">
            Discover sustainable fashion items available for swap or redemption
          </p>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          {/* Search Bar */}
          <Row className="mb-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label>
                  <FaSearch className="me-2" />
                  Search Items
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by title, description, category, brand, or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control-lg"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button 
                variant="outline-primary" 
                onClick={() => setShowFilters(!showFilters)}
                className="w-100"
              >
                <FaSlidersH className="me-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </Col>
          </Row>

          {/* Advanced Filters */}
          {showFilters && (
            <>
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      {types.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Condition</Form.Label>
                    <Form.Select
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                    >
                      {conditions.map(condition => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Size</Form.Label>
                    <Form.Select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      {sizes.map(size => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Points Range</Form.Label>
                    <Row>
                      <Col>
                        <Form.Control
                          type="number"
                          placeholder="Min points"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="number"
                          placeholder="Max points"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Sort By</Form.Label>
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                    <FaTimes className="me-2" />
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Results Summary */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <p className="text-muted mb-0">
              Showing {currentItems.length} of {filteredItems.length} items
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            {hasActiveFilters && (
              <Badge bg="info" className="fs-6">
                Filters Applied
              </Badge>
            )}
          </div>
        </Col>
      </Row>

      {/* Items Grid */}
      {currentItems.length > 0 ? (
        <>
          <Row>
            {currentItems.map(item => (
              <Col key={item._id} lg={3} md={4} sm={6} className="mb-4">
                <ItemCard 
                  item={item} 
                  showActions={true}
                  onSwap={handleSwap}
                />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <Pagination className="shadow-sm">
                  <Pagination.First 
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}
                  
                  <Pagination.Next 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last 
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      ) : (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <FaSearch className="display-1 text-muted mb-3" />
            <h5>No items found</h5>
            <p className="text-muted">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or filters' 
                : 'No items are currently available. Be the first to list an item!'
              }
            </p>
            <div className="d-flex justify-content-center gap-2">
              {hasActiveFilters && (
                <Button variant="outline-primary" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
              <Button variant="primary" href="/add-item">
                <FaPlus className="me-2" />
                List New Item
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Swap Modal */}
      <SwapModal
        show={showSwapModal}
        onHide={() => setShowSwapModal(false)}
        item={selectedItem}
        onSuccess={handleSwapSuccess}
      />
    </Container>
  );
};

export default BrowseItems; 