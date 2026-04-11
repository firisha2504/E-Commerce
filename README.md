# FA Restaurant E-Commerce Application

A complete full-stack restaurant e-commerce application built with React, Node.js, and MySQL. Features a modern responsive design with admin panel, shopping cart, user authentication, and comprehensive restaurant management system.

## 🚀 Features

### Customer Features
- **User Authentication**: Register, login, and profile management
- **Product Browsing**: Search, filter, and browse restaurant menu items
- **Shopping Cart**: Add items to cart with real-time notification badges
- **Order Management**: Place orders and track order history
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Profile Management**: Update personal information and profile pictures

### Admin Features
- **Admin Dashboard**: Comprehensive analytics and overview
- **Product Management**: Add, edit, delete menu items with image upload
- **Order Management**: View and manage customer orders
- **Customer Management**: View customer details and send messages
- **Analytics**: Sales trends, customer insights, and performance metrics
- **Settings**: Restaurant information and logo management
- **Profile Management**: Admin profile with image upload

### Technical Features
- **Real-time Cart Updates**: Cart badge shows item count with animations
- **Modal System**: Custom modal components instead of browser alerts
- **Logo Management**: Upload and change restaurant logo dynamically
- **Local Storage**: Cart persistence across browser sessions
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Form Validation**: Client-side and server-side validation
- **Security**: JWT authentication and protected routes

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Joi** - Data validation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/firisha2504/E-Commerce.git
cd E-Commerce
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_NAME=fa_restaurant
# JWT_SECRET=your_jwt_secret

# Run database migrations and seed data
npm run migrate
npm run seed

# Start the backend server
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👥 Default Credentials

### Admin Account
- **Email**: admin@farestaurant.com
- **Password**: admin123

### Customer Account
- **Email**: customer@example.com
- **Password**: customer123

## 🎯 Key Features Implemented

### Cart Notification System
- Real-time cart badge showing number of items
- Animated notification with pulse effect
- Persistent cart using localStorage
- Automatic cart updates across all pages

### Product Management
- **Add Products**: Complete form with image upload
- **Edit Products**: Inline editing with pre-filled forms
- **Delete Products**: Confirmation modal before deletion
- **View Products**: Detailed product information modal

### Enhanced User Experience
- **Modal System**: All alerts replaced with custom modals
- **Theme Support**: Consistent dark/light theme across all components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Proper loading indicators and error handling

## 📱 Screenshots

### Customer Interface
- Modern product grid with hover effects
- Shopping cart with item management
- User profile with image upload
- Responsive navigation with theme toggle

### Admin Panel
- Comprehensive dashboard with analytics
- Product management with CRUD operations
- Order management and customer insights
- Settings panel with logo upload

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fa_restaurant
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Database Schema
The application uses MySQL with the following main tables:
- `users` - User accounts (customers and admins)
- `products` - Restaurant menu items
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `cart_items` - Shopping cart items

## 🚀 Deployment

### Backend Deployment
1. Set up MySQL database on your hosting provider
2. Update environment variables for production
3. Deploy to services like Heroku, Railway, or DigitalOcean
4. Run migrations and seed data

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting service
3. Update API endpoints to point to production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Firisha**
- GitHub: [@firisha2504](https://github.com/firisha2504)
- Email: firisha2504@gmail.com

## 🙏 Acknowledgments

- Ethiopian cuisine inspiration for the restaurant theme
- Modern e-commerce UX/UI patterns
- React and Node.js communities for excellent documentation
- Tailwind CSS for the utility-first approach

---

**Note**: This is a demonstration project showcasing full-stack development skills. For production use, additional security measures, testing, and optimizations should be implemented.