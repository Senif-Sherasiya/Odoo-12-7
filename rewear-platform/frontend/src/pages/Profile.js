import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Tab, Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemCard from '../components/ItemCard';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profile, userStats, items] = await Promise.all([
        userService.getProfile(),
        userService.getStats(),
        userService.getMyItems()
      ]);

      setProfileData({
        username: profile.username || '',
        email: profile.email || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || ''
      });

      setStats(userStats);
      setMyItems(items);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updatedProfile = await userService.updateProfile(profileData);
      updateUser(updatedProfile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'danger', text: 'Password must be at least 6 characters long' });
      return;
    }

    try {
      setSaving(true);
      await userService.changePassword(passwordData);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await userService.deleteAccount();
        // Redirect to logout or home page
        window.location.href = '/';
      } catch (error) {
        setMessage({ type: 'danger', text: 'Failed to delete account' });
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={3}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
              <h5>{user?.username}</h5>
              <p className="text-muted">{user?.email}</p>
              <Badge bg={user?.role === 'admin' ? 'danger' : 'primary'}>
                {user?.role}
              </Badge>
            </Card.Body>
          </Card>

          {stats && (
            <Card className="mb-4">
              <Card.Header>Statistics</Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Points:</span>
                  <Badge bg="primary">{stats.totalPoints}</Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items Listed:</span>
                  <Badge bg="info">{stats.itemsListed}</Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Swaps Completed:</span>
                  <Badge bg="success">{stats.swapsCompleted}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Member Since:</span>
                  <small className="text-muted">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={9}>
          <Card>
            <Card.Header>
              <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="profile">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="security">Security</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="items">My Items</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                  {message.text}
                </Alert>
              )}

              <Tab.Content>
                <Tab.Pane active={activeTab === 'profile'}>
                  <Form onSubmit={handleProfileUpdate}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Username</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.username}
                            onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                            required
                            autoComplete="username"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            required
                            autoComplete="email"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            autoComplete="given-name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            autoComplete="family-name"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            autoComplete="tel"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button type="submit" variant="primary" disabled={saving}>
                      {saving ? 'Saving...' : 'Update Profile'}
                    </Button>
                  </Form>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'security'}>
                  <Form onSubmit={handlePasswordChange}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        required
                        autoComplete="current-password"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        required
                        autoComplete="new-password"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        required
                        autoComplete="new-password"
                      />
                    </Form.Group>

                    <Button type="submit" variant="warning" disabled={saving}>
                      {saving ? 'Changing...' : 'Change Password'}
                    </Button>
                  </Form>

                  <hr />

                  <div className="mt-4">
                    <h6 className="text-danger">Danger Zone</h6>
                    <p className="text-muted small">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="outline-danger" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </div>
                </Tab.Pane>

                <Tab.Pane active={activeTab === 'items'}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>My Items ({myItems.length})</h5>
                    <Button variant="primary" href="/add-item">
                      Add New Item
                    </Button>
                  </div>

                  {myItems.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted">You haven't listed any items yet.</p>
                      <Button variant="primary" href="/add-item">
                        List Your First Item
                      </Button>
                    </div>
                  ) : (
                    <Row>
                      {myItems.map(item => (
                        <Col key={item._id} lg={4} md={6} className="mb-3">
                          <ItemCard 
                            item={item} 
                            showActions={true}
                            onEdit={(item) => window.location.href = `/edit-item/${item._id}`}
                            onDelete={(itemId) => {
                              if (window.confirm('Are you sure you want to delete this item?')) {
                                // Handle delete
                              }
                            }}
                          />
                        </Col>
                      ))}
                    </Row>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 