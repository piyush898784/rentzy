# RENTZY - Rental Platform

A professional rental platform where you can rent everything from bikes and cars to homes, villas, and gadgets. Built with modern web technologies including HTML, CSS, JavaScript, and Python Flask.

## 🚀 Features

### Core Features
- **Dual Login System**: Separate accounts for renters and owners
- **Comprehensive Categories**: Bikes, Cars, Homes, Villas, Gadgets
- **Secure Authentication**: Aadhaar and PAN verification
- **Professional Dashboard**: GOIBIBO-inspired design with animations
- **Water Effects & Animations**: Smooth hover effects and transitions
- **Responsive Design**: Mobile-first approach
- **Real-time Search**: Filter by category and search items

### User Types
1. **Renters**: Browse and rent items
2. **Owners**: List items for rent and manage bookings

### Authentication Features
- Login with Email, Phone, or Google
- Secure password hashing
- Session management
- Aadhaar and PAN validation
- User verification system

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, animations, and effects
- **JavaScript**: Interactive functionality and AJAX requests
- **Font Awesome**: Icons
- **Google Fonts**: Typography

### Backend
- **Python Flask**: Web framework
- **SQLAlchemy**: ORM for database operations
- **Flask-Bcrypt**: Password hashing
- **SQLite**: Database (development)
- **Flask-CORS**: Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rentzy
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

## 🎯 Usage

### Getting Started

1. **Visit the homepage** - Beautiful landing page with categories
2. **Choose user type** - Renter or Owner
3. **Sign up** - Provide required details including Aadhaar and PAN
4. **Access dashboard** - Professional interface for managing activities

### For Renters
- Browse available items by category
- Use search and filters
- View item details and pricing
- Book items for specific dates
- Track booking status
- Manage profile

### For Owners
- Add new listings
- Upload item photos
- Set pricing and availability
- Manage bookings
- Track earnings
- View analytics

## 🏗 Project Structure

```
rentzy/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── styles.css    # Main stylesheet
│   └── js/
│       └── script.js     # JavaScript functionality
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables
- `SECRET_KEY`: Flask secret key for sessions
- `DATABASE_URL`: Database connection string

### Database Models
- **User**: User accounts with authentication
- **Category**: Item categories (Bikes, Cars, etc.)
- **Listing**: Items available for rent
- **Booking**: Rental bookings and history
- **ListingImage**: Item photos

## 🎨 Design Features

### Animations & Effects
- **Water Effect**: Animated SVG waves in hero section
- **Floating Cards**: Animated category cards
- **Hover Effects**: Smooth transitions on interactions
- **Ripple Effects**: Button click animations
- **Parallax Scrolling**: Hero section parallax
- **Fade In Animations**: Scroll-triggered animations

### UI/UX Features
- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on all devices
- **Intuitive Navigation**: Easy-to-use menu system
- **Visual Feedback**: Loading states and notifications
- **Accessibility**: Keyboard navigation and screen reader support

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- Input validation and sanitization
- SQL injection prevention
- CSRF protection
- Secure file uploads

## 📱 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/profile` - Get user profile

### Listings
- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create new listing
- `GET /api/categories` - Get all categories

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🚀 Deployment

### Development
```bash
python app.py
```

### Production
1. Set environment variables
2. Use production WSGI server (Gunicorn)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificate
5. Use production database (PostgreSQL)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📋 TODO

- [ ] Payment gateway integration
- [ ] Real-time chat system
- [ ] Mobile app development
- [ ] Advanced search filters
- [ ] Rating and review system
- [ ] Email notifications
- [ ] SMS verification
- [ ] Photo upload functionality
- [ ] Map integration
- [ ] Multi-language support

## 🐛 Known Issues

- Google OAuth integration needs API setup
- File upload not implemented yet
- Email verification pending
- Payment processing not integrated

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@rentzy.com
- Documentation: [Wiki](wiki-link)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Flask community for excellent documentation
- Inspiration from GOIBIBO's design patterns

---

**Made with ❤️ for the rental economy** 
