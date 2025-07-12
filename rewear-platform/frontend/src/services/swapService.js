const API_BASE_URL = 'http://localhost:5000/api';

class SwapService {
  // Get all swap requests for the current user
  async getMySwaps() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/swaps/my-swaps`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch swaps');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching swaps:', error);
      throw error;
    }
  }

  // Get swap requests received by the current user
  async getReceivedSwaps() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/swaps/received`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch received swaps');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching received swaps:', error);
      throw error;
    }
  }

  // Create a new swap request
  async createSwap(swapData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/swaps`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(swapData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create swap request');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating swap:', error);
      throw error;
    }
  }

  // Accept a swap request
  async acceptSwap(swapId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/swaps/${swapId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept swap');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error accepting swap:', error);
      throw error;
    }
  }

  // Reject a swap request
  async rejectSwap(swapId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/swaps/${swapId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject swap');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error rejecting swap:', error);
      throw error;
    }
  }

  // Cancel a swap request
  async cancelSwap(swapId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/swaps/${swapId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel swap');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error canceling swap:', error);
      throw error;
    }
  }

  // Get swap history
  async getSwapHistory() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/swaps/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch swap history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching swap history:', error);
      throw error;
    }
  }
}

export default new SwapService(); 