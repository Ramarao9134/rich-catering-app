const fs = require('fs').promises
const path = require('path')

const DATA_DIR = path.join(__dirname, 'data')

const sampleData = {
  users: {
    users: [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@rich.com',
        phone: '+91 98765 43210',
        passwordHash: 'admin123',
        role: 'admin',
        address: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'John Customer',
        email: 'customer@rich.com',
        phone: '+91 98765 43211',
        passwordHash: 'customer123',
        role: 'customer',
        address: ['123 Main Street, Hyderabad'],
        createdAt: new Date().toISOString()
      }
    ],
    nextId: 3
  },
  menuItems: {
    items: [
      {
        id: 1,
        name: 'Masala Dosa',
        category: 'Breakfast',
        description: 'Crispy dosa with spiced potato filling, served with sambar and chutney',
        price: 120,
        images: [],
        tags: ['Vegetarian', 'South Indian'],
        ingredients: ['Rice', 'Urad dal', 'Potato', 'Onions', 'Spices'],
        isAvailable: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Idli Sambar',
        category: 'Breakfast',
        description: 'Soft steamed rice cakes with lentil sambar',
        price: 80,
        images: [],
        tags: ['Vegetarian', 'South Indian', 'Healthy'],
        ingredients: ['Rice', 'Urad dal', 'Lentils', 'Vegetables'],
        isAvailable: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Biryani',
        category: 'Lunch',
        description: 'Fragrant basmati rice cooked with tender meat and aromatic spices',
        price: 250,
        images: [],
        tags: ['Non-Vegetarian', 'Spicy'],
        ingredients: ['Basmati rice', 'Chicken', 'Yogurt', 'Spices', 'Onions'],
        isAvailable: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Veg Biryani',
        category: 'Lunch',
        description: 'Aromatic basmati rice with mixed vegetables and spices',
        price: 180,
        images: [],
        tags: ['Vegetarian', 'Spicy'],
        ingredients: ['Basmati rice', 'Mixed vegetables', 'Spices', 'Onions'],
        isAvailable: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Butter Chicken',
        category: 'Dinner',
        description: 'Creamy tomato-based curry with tender chicken pieces',
        price: 320,
        images: [],
        tags: ['Non-Vegetarian', 'Creamy'],
        ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Butter', 'Spices'],
        isAvailable: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 6,
        name: 'Paneer Tikka',
        category: 'Dinner',
        description: 'Marinated cottage cheese grilled to perfection',
        price: 280,
        images: [],
        tags: ['Vegetarian', 'Grilled'],
        ingredients: ['Paneer', 'Yogurt', 'Spices', 'Bell peppers'],
        isAvailable: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 7,
        name: 'Mango Lassi',
        category: 'Beverages',
        description: 'Refreshing yogurt drink with sweet mango',
        price: 90,
        images: [],
        tags: ['Vegetarian', 'Cold'],
        ingredients: ['Yogurt', 'Mango', 'Sugar'],
        isAvailable: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 8,
        name: 'Masala Chai',
        category: 'Beverages',
        description: 'Spiced tea with milk and aromatic spices',
        price: 40,
        images: [],
        tags: ['Vegetarian', 'Hot'],
        ingredients: ['Tea', 'Milk', 'Spices', 'Sugar'],
        isAvailable: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 9,
        name: 'Gulab Jamun',
        category: 'Desserts',
        description: 'Sweet milk dumplings in rose-flavored syrup',
        price: 100,
        images: [],
        tags: ['Vegetarian', 'Sweet'],
        ingredients: ['Milk', 'Flour', 'Sugar', 'Rose water'],
        isAvailable: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 10,
        name: 'Kheer',
        category: 'Desserts',
        description: 'Creamy rice pudding with nuts and cardamom',
        price: 110,
        images: [],
        tags: ['Vegetarian', 'Sweet'],
        ingredients: ['Rice', 'Milk', 'Sugar', 'Nuts', 'Cardamom'],
        isAvailable: true,
        createdAt: new Date().toISOString()
      }
    ],
    nextId: 11
  },
  packages: {
    packages: [
      {
        id: 1,
        title: 'Gold Wedding Package',
        description: 'Premium wedding package with complete catering, decor, and photography services. Perfect for grand celebrations.',
        pricePerGuest: 1500,
        minGuests: 50,
        maxGuests: 500,
        includes: [
          'Premium multi-course meal',
          'Live cooking stations',
          'Professional decor setup',
          'Basic photography (100 photos)',
          'DJ and sound system',
          'Cake cutting ceremony',
          'Event coordinator'
        ],
        images: [],
        addOns: [
          {
            id: 1,
            name: 'Premium Photography',
            description: 'Professional photographer for 8 hours',
            price: 15000
          },
          {
            id: 2,
            name: 'Videography',
            description: 'Professional videography with highlights reel',
            price: 25000
          },
          {
            id: 3,
            name: 'Floral Decor',
            description: 'Premium floral arrangements and centerpieces',
            price: 30000
          },
          {
            id: 4,
            name: 'Live Band',
            description: 'Live music performance during event',
            price: 40000
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Standard Birthday Package',
        description: 'Complete birthday celebration package with food, decor, and entertainment.',
        pricePerGuest: 800,
        minGuests: 20,
        maxGuests: 100,
        includes: [
          'Buffet meal',
          'Birthday cake',
          'Basic decor',
          'Party games and activities',
          'Sound system'
        ],
        images: [],
        addOns: [
          {
            id: 5,
            name: 'Magic Show',
            description: 'Professional magician performance',
            price: 8000
          },
          {
            id: 6,
            name: 'Face Painting',
            description: 'Face painting for kids',
            price: 5000
          }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Corporate Event Package',
        description: 'Professional catering for corporate meetings, conferences, and seminars.',
        pricePerGuest: 600,
        minGuests: 30,
        maxGuests: 200,
        includes: [
          'Business lunch/dinner',
          'Coffee and tea service',
          'Projector and AV setup',
          'Professional service staff',
          'Conference room setup'
        ],
        images: [],
        addOns: [
          {
            id: 7,
            name: 'Extended AV Support',
            description: 'Additional AV equipment and support',
            price: 10000
          }
        ],
        createdAt: new Date().toISOString()
      }
    ],
    nextId: 4
  },
  gallery: {
    images: [
      {
        id: 1,
        title: 'Grand Wedding Reception',
        category: 'Wedding',
        imageUrl: '',
        caption: 'Elegant wedding reception with 300 guests',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Birthday Celebration',
        category: 'Birthday',
        imageUrl: '',
        caption: 'Colorful birthday party setup',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Corporate Conference',
        category: 'Corporate',
        imageUrl: '',
        caption: 'Professional corporate event setup',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Anniversary Dinner',
        category: 'Anniversary',
        imageUrl: '',
        caption: 'Intimate anniversary celebration',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Wedding Ceremony',
        category: 'Wedding',
        imageUrl: '',
        caption: 'Traditional wedding ceremony decor',
        createdAt: new Date().toISOString()
      },
      {
        id: 6,
        title: 'Kids Birthday Party',
        category: 'Birthday',
        imageUrl: '',
        caption: 'Fun-filled kids birthday celebration',
        createdAt: new Date().toISOString()
      },
      {
        id: 7,
        title: 'Product Launch',
        category: 'Corporate',
        imageUrl: '',
        caption: 'Corporate product launch event',
        createdAt: new Date().toISOString()
      },
      {
        id: 8,
        title: 'Golden Anniversary',
        category: 'Anniversary',
        imageUrl: '',
        caption: '50th anniversary celebration',
        createdAt: new Date().toISOString()
      },
      {
        id: 9,
        title: 'Destination Wedding',
        category: 'Wedding',
        imageUrl: '',
        caption: 'Beachside wedding celebration',
        createdAt: new Date().toISOString()
      },
      {
        id: 10,
        title: 'Team Building Event',
        category: 'Corporate',
        imageUrl: '',
        caption: 'Corporate team building activity',
        createdAt: new Date().toISOString()
      },
      {
        id: 11,
        title: 'Sweet 16 Party',
        category: 'Birthday',
        imageUrl: '',
        caption: 'Elegant sweet 16 celebration',
        createdAt: new Date().toISOString()
      },
      {
        id: 12,
        title: 'Silver Anniversary',
        category: 'Anniversary',
        imageUrl: '',
        caption: '25th anniversary celebration',
        createdAt: new Date().toISOString()
      }
    ],
    nextId: 13
  },
  orders: {
    orders: [],
    nextId: 1
  },
  bookings: {
    bookings: [],
    nextId: 1
  },
  coupons: {
    coupons: [],
    nextId: 1
  },
  notifications: {
    notifications: [],
    nextId: 1
  }
}

async function initData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    
    for (const [filename, data] of Object.entries(sampleData)) {
      const filePath = path.join(DATA_DIR, `${filename}.json`)
      await fs.writeFile(filePath, JSON.stringify(data, null, 2))
      console.log(`✓ Initialized ${filename}.json`)
    }
    
    console.log('\n✅ Sample data initialized successfully!')
    console.log('\nDemo accounts:')
    console.log('  Admin: admin@rich.com / admin123')
    console.log('  Customer: customer@rich.com / customer123')
  } catch (error) {
    console.error('Error initializing data:', error)
  }
}

initData()

