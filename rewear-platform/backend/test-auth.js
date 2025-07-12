const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('🧪 Testing Authentication Routes...\n');

    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test 2: Register a new user
    console.log('\n2. Testing user registration...');
    const registerData = {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
      console.log('✅ Registration successful:', registerResponse.data);
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('⚠️  User already exists, continuing with login test...');
      } else {
        console.log('❌ Registration failed:', error.response?.data || error.message);
      }
    }

    // Test 3: Login
    console.log('\n3. Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData);
      console.log('✅ Login successful:', {
        user: loginResponse.data.name,
        token: loginResponse.data.token ? 'Token received' : 'No token'
      });

      // Test 4: Get profile with token
      console.log('\n4. Testing profile retrieval...');
      const token = loginResponse.data.token;
      const profileResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile retrieval successful:', profileResponse.data.name);

    } catch (error) {
      console.log('❌ Login failed:', error.response?.data || error.message);
    }

    // Test 5: Test with seeded user
    console.log('\n5. Testing with seeded user (john@example.com)...');
    const seededLoginData = {
      email: 'john@example.com',
      password: 'password123'
    };

    try {
      const seededLoginResponse = await axios.post(`${API_URL}/auth/login`, seededLoginData);
      console.log('✅ Seeded user login successful:', {
        user: seededLoginResponse.data.name,
        token: seededLoginResponse.data.token ? 'Token received' : 'No token'
      });
    } catch (error) {
      console.log('❌ Seeded user login failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth(); 