# Rich & Catering — Restaurant + Events App

A complete web application for restaurant menu management, online ordering, and event/party bookings with a comprehensive admin panel.

## Features

### Customer Features
- **Menu Browsing**: Browse menu items by category (Breakfast, Lunch, Dinner, Beverages, Desserts)
- **Online Ordering**: Add items to cart and place orders for pickup/delivery
- **Event Booking**: Book event packages with customizable add-ons
- **Gallery**: Browse event photos categorized by event type
- **User Profile**: View order history and booking history
- **Multi-language**: Support for English and Telugu

### Admin Features
- **Dashboard**: Overview with KPIs (revenue, orders, bookings)
- **Menu Management**: Full CRUD operations for menu items
- **Package Management**: Manage event packages
- **Order Management**: View and update order status
- **Booking Management**: View and manage event bookings
- **Gallery Management**: Upload and manage gallery images
- **Reports & Analytics**: View sales reports and popular items

## Tech Stack

### Frontend
- React 18
- React Router
- Tailwind CSS
- Axios
- Vite

### Backend
- Node.js
- Express.js
- JSON file storage (easily replaceable with database)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Initialize sample data:**
   ```bash
   npm run init-data
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend dev server on `http://localhost:3000`

### Production Build

1. **Build frontend:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

## Demo Accounts

- **Admin**: 
  - Email: `admin@rich.com`
  - Password: `admin123`

- **Customer**: 
  - Email: `customer@rich.com`
  - Password: `customer123`

## Project Structure

```
rich-catering-app/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (Auth, Cart, Language)
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                 # Backend Express app
│   ├── data/              # JSON data files (created on first run)
│   ├── index.js           # Express server
│   └── initData.js        # Sample data initialization
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Menu
- `GET /api/menu` - Get all menu items (query: category, search)
- `GET /api/menu/:id` - Get menu item by ID

### Orders
- `POST /api/cart/checkout` - Place order (requires auth)
- `GET /api/orders` - Get user orders (requires auth)

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings` - Get user bookings (requires auth)

### Gallery
- `GET /api/gallery` - Get gallery images (query: category)

### Admin
- `GET /api/admin/bookings` - Get all bookings (requires admin)
- `PUT /api/admin/bookings/:id` - Update booking status (requires admin)
- `GET /api/admin/orders` - Get all orders (requires admin)
- `PUT /api/admin/orders/:id` - Update order status (requires admin)
- `POST /api/admin/menu` - Create menu item (requires admin)
- `PUT /api/admin/menu/:id` - Update menu item (requires admin)
- `DELETE /api/admin/menu/:id` - Delete menu item (requires admin)
- `GET /api/admin/reports` - Get analytics (requires admin)

## Features in Detail

### Menu System
- Category-based filtering
- Search functionality
- Item details with ingredients and dietary tags
- Add to cart functionality
- Availability status

### Booking System
- Multi-step booking wizard
- Date and time selection
- Guest count validation
- Add-on selection
- Contact details collection
- Booking confirmation

### Admin Dashboard
- Real-time statistics
- Order management with status updates
- Booking management with status workflow
- Menu item CRUD operations
- Reports and analytics

## Customization

### Adding a Database
The current implementation uses JSON files for data storage. To use a database:

1. Install your preferred database driver (e.g., `pg` for PostgreSQL, `mysql2` for MySQL)
2. Replace the `readData` and `writeData` functions in `server/index.js` with database queries
3. Update the data models as needed

### Adding Images
Currently, images are placeholder. To add real images:

1. Set up image upload using `multer` (already included)
2. Store images in `server/uploads/`
3. Update menu items and packages with image URLs

### Email Notifications
To add email notifications:

1. Install `nodemailer` or similar
2. Add email sending logic in booking/order creation endpoints
3. Configure SMTP settings

## Development Notes

- Authentication is simplified (password stored as plain text in demo). Use bcrypt in production.
- CORS is enabled for development. Configure properly for production.
- Image uploads are not fully implemented. Add multer configuration for file handling.

## License

MIT

## Support

For issues or questions, please open an issue on the repository.

