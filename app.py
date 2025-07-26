from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import re
from functools import wraps

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rentzy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    password_hash = db.Column(db.String(60), nullable=False)
    aadhaar = db.Column(db.String(12), unique=True, nullable=False)
    pan = db.Column(db.String(10), unique=True, nullable=False)
    user_type = db.Column(db.String(10), default='renter')  # 'renter' or 'owner'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)
    
    # Relationships
    listings = db.relationship('Listing', backref='owner', lazy=True)
    bookings = db.relationship('Booking', backref='renter', lazy=True)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    icon = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    
    # Relationships
    listings = db.relationship('Listing', backref='category', lazy=True)

class Listing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price_per_day = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign Keys
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    
    # Relationships
    bookings = db.relationship('Booking', backref='listing', lazy=True)
    images = db.relationship('ListingImage', backref='listing', lazy=True)

class ListingImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    
    # Foreign Key
    listing_id = db.Column(db.Integer, db.ForeignKey('listing.id'), nullable=False)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'confirmed', 'active', 'completed', 'cancelled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign Keys
    renter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listing.id'), nullable=False)

# Utility Functions
def validate_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    pattern = r'^[+]?[0-9]{10,15}$'
    return re.match(pattern, phone.replace(' ', '').replace('-', '')) is not None

def validate_aadhaar(aadhaar):
    pattern = r'^[0-9]{12}$'
    return re.match(pattern, aadhaar.replace(' ', '').replace('-', '')) is not None

def validate_pan(pan):
    pattern = r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
    return re.match(pattern, pan.upper()) is not None

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Login required'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'aadhaar', 'pan', 'password', 'user_type']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate phone format
        if not validate_phone(data['phone']):
            return jsonify({'error': 'Invalid phone number'}), 400
        
        # Validate Aadhaar format
        if not validate_aadhaar(data['aadhaar']):
            return jsonify({'error': 'Invalid Aadhaar number'}), 400
        
        # Validate PAN format
        if not validate_pan(data['pan']):
            return jsonify({'error': 'Invalid PAN number'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        if User.query.filter_by(phone=data['phone']).first():
            return jsonify({'error': 'Phone number already registered'}), 400
        
        if User.query.filter_by(aadhaar=data['aadhaar'].replace(' ', '').replace('-', '')).first():
            return jsonify({'error': 'Aadhaar number already registered'}), 400
        
        if User.query.filter_by(pan=data['pan'].upper()).first():
            return jsonify({'error': 'PAN number already registered'}), 400
        
        # Create new user
        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        user = User(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            password_hash=password_hash,
            aadhaar=data['aadhaar'].replace(' ', '').replace('-', ''),
            pan=data['pan'].upper(),
            user_type=data['user_type']
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Log in the user
        session['user_id'] = user.id
        session['user_type'] = user.user_type
        
        return jsonify({
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'user_type': user.user_type
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email or phone
        user = User.query.filter(
            (User.email == data['email']) | (User.phone == data['email'])
        ).first()
        
        if not user or not bcrypt.check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid email/phone or password'}), 401
        
        # Log in the user
        session['user_id'] = user.id
        session['user_type'] = user.user_type
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'user_type': user.user_type
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/api/profile', methods=['GET'])
@login_required
def get_profile():
    try:
        user = User.query.get(session['user_id'])
        return jsonify({
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'user_type': user.user_type,
                'created_at': user.created_at.isoformat(),
                'is_verified': user.is_verified
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify({
            'categories': [{
                'id': cat.id,
                'name': cat.name,
                'icon': cat.icon,
                'description': cat.description
            } for cat in categories]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/listings', methods=['GET'])
def get_listings():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category_id = request.args.get('category_id', type=int)
        search = request.args.get('search', '')
        
        query = Listing.query.filter_by(available=True)
        
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        if search:
            query = query.filter(Listing.title.contains(search))
        
        listings = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'listings': [{
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_day': listing.price_per_day,
                'location': listing.location,
                'category': listing.category.name,
                'owner': listing.owner.name,
                'created_at': listing.created_at.isoformat()
            } for listing in listings.items],
            'pagination': {
                'page': listings.page,
                'pages': listings.pages,
                'per_page': listings.per_page,
                'total': listings.total
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/listings', methods=['POST'])
@login_required
def create_listing():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['title', 'description', 'price_per_day', 'location', 'category_id']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if category exists
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({'error': 'Invalid category'}), 400
        
        listing = Listing(
            title=data['title'],
            description=data['description'],
            price_per_day=float(data['price_per_day']),
            location=data['location'],
            owner_id=session['user_id'],
            category_id=data['category_id']
        )
        
        db.session.add(listing)
        db.session.commit()
        
        return jsonify({
            'message': 'Listing created successfully',
            'listing': {
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_day': listing.price_per_day,
                'location': listing.location
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['GET'])
@login_required
def get_bookings():
    try:
        user_id = session['user_id']
        bookings = Booking.query.filter_by(renter_id=user_id).all()
        
        return jsonify({
            'bookings': [{
                'id': booking.id,
                'listing_title': booking.listing.title,
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'total_amount': booking.total_amount,
                'status': booking.status,
                'created_at': booking.created_at.isoformat()
            } for booking in bookings]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
@login_required
def create_booking():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['listing_id', 'start_date', 'end_date']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get listing
        listing = Listing.query.get(data['listing_id'])
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        if not listing.available:
            return jsonify({'error': 'Listing not available'}), 400
        
        # Parse dates
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        
        if start_date >= end_date:
            return jsonify({'error': 'End date must be after start date'}), 400
        
        if start_date < datetime.now().date():
            return jsonify({'error': 'Start date cannot be in the past'}), 400
        
        # Calculate total amount
        days = (end_date - start_date).days
        total_amount = days * listing.price_per_day
        
        booking = Booking(
            renter_id=session['user_id'],
            listing_id=data['listing_id'],
            start_date=start_date,
            end_date=end_date,
            total_amount=total_amount
        )
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': {
                'id': booking.id,
                'start_date': booking.start_date.isoformat(),
                'end_date': booking.end_date.isoformat(),
                'total_amount': booking.total_amount,
                'status': booking.status
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
@login_required
def get_dashboard_stats():
    try:
        user_id = session['user_id']
        user_type = session['user_type']
        
        if user_type == 'renter':
            active_bookings = Booking.query.filter_by(
                renter_id=user_id, status='active'
            ).count()
            
            pending_bookings = Booking.query.filter_by(
                renter_id=user_id, status='pending'
            ).count()
            
            total_spent = db.session.query(
                db.func.sum(Booking.total_amount)
            ).filter_by(renter_id=user_id).scalar() or 0
            
            stats = {
                'active_bookings': active_bookings,
                'pending_requests': pending_bookings,
                'total_spent': total_spent,
                'user_rating': 4.5  # Placeholder
            }
        else:  # owner
            active_listings = Listing.query.filter_by(
                owner_id=user_id, available=True
            ).count()
            
            total_bookings = db.session.query(Booking).join(Listing).filter(
                Listing.owner_id == user_id
            ).count()
            
            total_earnings = db.session.query(
                db.func.sum(Booking.total_amount)
            ).join(Listing).filter(Listing.owner_id == user_id).scalar() or 0
            
            stats = {
                'active_listings': active_listings,
                'total_bookings': total_bookings,
                'total_earnings': total_earnings,
                'user_rating': 4.8  # Placeholder
            }
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database
def init_db():
    with app.app_context():
        db.create_all()
        
        # Create default categories
        if Category.query.count() == 0:
            categories = [
                Category(name='Bikes', icon='fas fa-motorcycle', description='Two-wheelers for your daily commute'),
                Category(name='Cars', icon='fas fa-car', description='Luxury cars to budget-friendly options'),
                Category(name='Homes', icon='fas fa-home', description='Comfortable stays for any duration'),
                Category(name='Villas', icon='fas fa-building', description='Luxury getaways and vacation rentals'),
                Category(name='Gadgets', icon='fas fa-laptop', description='Latest tech for your projects')
            ]
            
            for category in categories:
                db.session.add(category)
            
            db.session.commit()
            print("Default categories created!")

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)