#!/usr/bin/env python3
"""
RENTZY - Rental Platform Startup Script
This script initializes the database and starts the Flask application.
"""

import os
import sys
from app import app, init_db

def main():
    """Main function to start the RENTZY application."""
    print("🚀 Starting RENTZY - Rental Platform")
    print("=" * 50)
    
    # Initialize database
    print("📊 Initializing database...")
    try:
        init_db()
        print("✅ Database initialized successfully!")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        sys.exit(1)
    
    # Start the application
    print("🌐 Starting Flask application...")
    print("📍 Access the application at: http://localhost:5000")
    print("=" * 50)
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n👋 Application stopped by user")
    except Exception as e:
        print(f"❌ Application failed to start: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()