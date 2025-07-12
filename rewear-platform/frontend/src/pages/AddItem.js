import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { FaPlus, FaUpload, FaSave, FaTimes, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import itemService from '../services/itemService';

const AddItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    condition: '',
    size: '',
    brand: '',
    pointValue: '',
    color: ''
  });

  const [errors, setErrors] = useState({});

  const categories = ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other'];
  const types = ['men', 'women', 'kids', 'unisex'];
  const conditions = ['new', 'like-new', 'good', 'fair', 'poor'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Brown', 'Gray', 'Orange', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setMessage({ type: 'warning', text: 'Maximum 5 images allowed' });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'warning', text: 'Image size should be less than 5MB' });
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'warning', text: 'Please select only image files' });
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (!formData.pointValue || formData.pointValue < 1) newErrors.pointValue = 'Point value must be at least 1';
    if (images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      // Convert images to base64 for now (in production, you'd upload to cloud storage)
      const imageData = await Promise.all(
        images.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        })
      );

      const itemData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        size: formData.size,
        condition: formData.condition,
        pointValue: parseInt(formData.pointValue),
        images: imageData,
        brand: formData.brand || undefined,
        color: formData.color || undefined
      };

      const result = await itemService.createItem(itemData);
      
      setMessage({ type: 'success', text: 'Item created successfully!' });
      
      // Redirect to the new item's detail page
      setTimeout(() => {
        navigate(`/item/${result._id}`);
      }, 1500);

    } catch (error) {
      console.error('Error creating item:', error);
      setMessage({ type: 'danger', text: 'Failed to create item. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold text-success mb-2">
            <FaPlus className="me-3" />
            Add New Item
          </h1>
          <p className="text-muted">
            List your sustainable fashion item for the community
          </p>
        </Col>
      </Row>

      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Item Details</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Blue Denim Jacket"
                        isInvalid={!!errors.title}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Brand</Form.Label>
                      <Form.Control
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="e.g., Levi's"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your item in detail..."
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        isInvalid={!!errors.category}
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Type *</Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        isInvalid={!!errors.type}
                      >
                        <option value="">Select Type</option>
                        {types.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Condition *</Form.Label>
                      <Form.Select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        isInvalid={!!errors.condition}
                      >
                        <option value="">Select Condition</option>
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>
                            {condition.charAt(0).toUpperCase() + condition.slice(1)}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.condition}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Size *</Form.Label>
                      <Form.Select
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        isInvalid={!!errors.size}
                      >
                        <option value="">Select Size</option>
                        {sizes.map(size => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.size}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Color</Form.Label>
                      <Form.Select
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                      >
                        <option value="">Select Color</option>
                        {colors.map(color => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Points Value *</Form.Label>
                      <Form.Control
                        type="number"
                        name="pointValue"
                        value={formData.pointValue}
                        onChange={handleChange}
                        placeholder="Enter points value"
                        min="1"
                        isInvalid={!!errors.pointValue}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.pointValue}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Set the points value for your item (minimum 1)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  className="w-100 py-3 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Item...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      Create Item
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">
                <FaImage className="me-2" />
                Images
              </h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Upload Images *</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  isInvalid={!!errors.images}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.images}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Upload up to 5 images (max 5MB each)
                </Form.Text>
              </Form.Group>

              {imagePreview.length > 0 && (
                <div className="mt-3">
                  <h6>Preview:</h6>
                  <div className="row g-2">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="col-6 position-relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="img-fluid rounded"
                          style={{ height: '100px', objectFit: 'cover' }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          onClick={() => removeImage(index)}
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mt-3">
            <Card.Body>
              <h6 className="fw-bold text-success mb-3">
                <FaUpload className="me-2" />
                Tips for Better Listings
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <small className="text-muted">✓ Take clear, well-lit photos</small>
                </li>
                <li className="mb-2">
                  <small className="text-muted">✓ Show any flaws or wear honestly</small>
                </li>
                <li className="mb-2">
                  <small className="text-muted">✓ Include measurements if possible</small>
                </li>
                <li>
                  <small className="text-muted">✓ Set fair point values</small>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddItem; 