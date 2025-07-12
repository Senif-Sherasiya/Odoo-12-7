# ReWear - Sustainable Fashion Exchange Platform

ReWear is a MERN stack application that enables users to exchange sustainable fashion items through a points-based system. Users can list their clothing items, browse others' listings, and initiate swap requests to promote sustainable fashion consumption.

## 🌟 Features

### User Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Item Management**: List, edit, and delete fashion items with images
- **Browse & Search**: Advanced filtering by category, condition, size, and points
- **Swap System**: Initiate, accept, reject, and track swap requests
- **Points System**: Earn and spend points for sustainable fashion exchanges
- **User Profiles**: Manage profile information and view statistics
- **Dashboard**: Overview of items, swaps, and platform activity

### Admin Features
- **User Management**: View, ban/unban users, and manage roles
- **Item Moderation**: Approve, reject, or delete items
- **Platform Statistics**: Monitor platform usage and activity
- **Swap Management**: Oversee all swap requests and transactions

### Technical Features
- **Responsive Design**: Mobile-first approach with Bootstrap
- **Real-time Updates**: Live notifications and status updates
- **Image Upload**: Secure file upload with validation
- **Search & Filtering**: Advanced search with multiple criteria
- **Pagination**: Efficient data loading for large datasets

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Bootstrap** - CSS framework
- **React Icons** - Icon library
- **Context API** - State management

## 📁 Project Structure

```
rewear-platform/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   ├── swapController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   └── SwapRequest.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── items.js
│   │   ├── swaps.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── uploads/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ItemCard.js
│   │   │   ├── SwapCard.js
│   │   │   └── LoadingSpinner.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── Login.js
│   │   │   ├── SignUp.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   ├── BrowseItems.js
│   │   │   ├── ItemDetail.js
│   │   │   ├── AddItem.js
│   │   │   ├── SwapRequests.js
│   │   │   └── AdminPanel.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── itemService.js
│   │   │   ├── swapService.js
│   │   │   ├── userService.js
│   │   │   └── adminService.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rewear-platform
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rewear
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Run the backend server**
   ```bash
   cd backend
   npm start
   ```

7. **Run the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Item Endpoints
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Swap Endpoints
- `GET /api/swaps` - Get user's swaps
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id/accept` - Accept swap
- `PUT /api/swaps/:id/reject` - Reject swap
- `PUT /api/swaps/:id/cancel` - Cancel swap

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get user statistics

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/items` - Get all items
- `PUT /api/admin/items/:id/approve` - Approve item
- `PUT /api/admin/items/:id/reject` - Reject item

## 🎯 Usage Guide

### For Users

1. **Registration & Login**
   - Create an account with email and password
   - Log in to access the platform

2. **Listing Items**
   - Click "List Item" to add new items
   - Upload images and provide details
   - Set points value for your item

3. **Browsing Items**
   - Use search and filters to find items
   - View item details and owner information
   - Initiate swap requests

4. **Managing Swaps**
   - View pending swap requests
   - Accept or reject incoming requests
   - Track swap history

5. **Profile Management**
   - Update personal information
   - View statistics and points
   - Manage listed items

### For Admins

1. **User Management**
   - View all registered users
   - Ban/unban users as needed
   - Manage user roles

2. **Content Moderation**
   - Review pending items
   - Approve or reject listings
   - Remove inappropriate content

3. **Platform Monitoring**
   - View platform statistics
   - Monitor user activity
   - Track swap transactions

## 🔧 Configuration

### Points System
- New users start with 100 points
- Points are earned through successful swaps
- Points are spent when items are swapped

### Item Categories
- Clothing
- Shoes
- Accessories
- Jewelry
- Bags
- Other

### Item Conditions
- Excellent
- Good
- Fair
- Poor

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy to your preferred hosting service (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the build folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🔮 Future Enhancements

- Real-time chat between users
- Mobile app development
- Advanced analytics dashboard
- Social media integration
- Payment system integration
- Shipping and tracking features
- Community features and forums 