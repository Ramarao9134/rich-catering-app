const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs').promises

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data')
const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize data files
const initDataFiles = async () => {
  await ensureDataDir()
  
  const files = {
    users: { users: [], nextId: 1 },
    menuItems: { items: [], nextId: 1 },
    orders: { orders: [], nextId: 1 },
    packages: { packages: [], nextId: 1 },
    bookings: { bookings: [], nextId: 1 },
    gallery: { images: [], nextId: 1 },
    coupons: { coupons: [], nextId: 1 },
    notifications: { notifications: [], nextId: 1 }
  }
  
  for (const [key, defaultData] of Object.entries(files)) {
    const filePath = path.join(DATA_DIR, `${key}.json`)
    try {
      await fs.access(filePath)
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2))
    }
  }
}

// Helper functions for data operations
const readData = async (filename) => {
  const filePath = path.join(DATA_DIR, `${filename}.json`)
  try {
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return null
  }
}

const writeData = async (filename, data) => {
  const filePath = path.join(DATA_DIR, `${filename}.json`)
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}

// Auth middleware (simplified - in production use JWT)
const requireAuth = (req, res, next) => {
  const userId = req.headers['user-id']
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  req.userId = userId
  next()
}

const requireAdmin = async (req, res, next) => {
  const userId = req.headers['user-id']
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const data = await readData('users')
  const user = data.users.find(u => u.id === parseInt(userId))
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}

// ========== AUTH ROUTES ==========
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body
    const data = await readData('users')
    
    if (data.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' })
    }
    
    const newUser = {
      id: data.nextId++,
      name,
      email,
      phone,
      passwordHash: password, // In production, use bcrypt
      role: 'customer',
      address: address || [],
      createdAt: new Date().toISOString()
    }
    
    data.users.push(newUser)
    await writeData('users', data)
    
    res.json({ success: true, user: { id: newUser.id, name, email, role: newUser.role } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const data = await readData('users')
    
    const user = data.users.find(u => u.email === email && u.passwordHash === password)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== MENU ROUTES ==========
app.get('/api/menu', async (req, res) => {
  try {
    const { category, search } = req.query
    const data = await readData('menuItems')
    let items = data.items
    
    if (category) {
      items = items.filter(item => item.category === category)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    }
    
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/menu/:id', async (req, res) => {
  try {
    const data = await readData('menuItems')
    const item = data.items.find(i => i.id === parseInt(req.params.id))
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== ORDER ROUTES ==========
app.post('/api/cart/checkout', requireAuth, async (req, res) => {
  try {
    const { items, total, address, paymentMethod } = req.body
    const data = await readData('orders')
    
    const order = {
      id: data.nextId++,
      userId: parseInt(req.userId),
      items,
      total,
      address,
      paymentMethod: paymentMethod || 'cash',
      status: 'pending',
      adminApproval: 'pending',
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      paidAmount: paymentMethod === 'online' ? total : 0,
      paymentNotes: '', // For admin to add notes about cash payments
      createdAt: new Date().toISOString()
    }
    
    data.orders.push(order)
    await writeData('orders', data)
    
    // Create notification
    const notifData = await readData('notifications')
    notifData.notifications.push({
      id: notifData.nextId++,
      userId: parseInt(req.userId),
      type: 'order',
      message: `Order #${order.id} placed successfully`,
      read: false,
      createdAt: new Date().toISOString()
    })
    await writeData('notifications', notifData)
    
    res.json({ success: true, orderId: order.id, order })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const data = await readData('orders')
    const userOrders = data.orders.filter(o => o.userId === parseInt(req.userId))
    res.json(userOrders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== PACKAGE ROUTES ==========
app.get('/api/packages', async (req, res) => {
  try {
    const data = await readData('packages')
    res.json(data.packages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/packages/:id', async (req, res) => {
  try {
    const data = await readData('packages')
    const pkg = data.packages.find(p => p.id === parseInt(req.params.id))
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' })
    }
    res.json(pkg)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== BOOKING ROUTES ==========
// Check space availability for a date/time slot
app.get('/api/bookings/availability', async (req, res) => {
  try {
    const { date, timeSlot } = req.query
    if (!date || !timeSlot) {
      return res.status(400).json({ error: 'Date and timeSlot are required' })
    }
    
    const data = await readData('bookings')
    // Find approved bookings for the same date and time slot
    const conflictingBookings = data.bookings.filter(b => 
      b.date === date && 
      b.timeSlot === timeSlot && 
      (b.adminApproval === 'approved' || b.adminApproval === 'pending')
    )
    
    res.json({ 
      available: conflictingBookings.length === 0,
      conflictingBookings: conflictingBookings.map(b => ({
        id: b.id,
        date: b.date,
        timeSlot: b.timeSlot,
        guestCount: b.guestCount
      }))
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/bookings', requireAuth, async (req, res) => {
  try {
    const { packageId, date, timeSlot, guestCount, addOns, totalEstimate, contactDetails, paymentMethod } = req.body
    const data = await readData('bookings')
    
    const booking = {
      id: data.nextId++,
      userId: parseInt(req.userId),
      packageId: parseInt(packageId),
      date,
      timeSlot,
      guestCount,
      addOns: addOns || [],
      totalEstimate,
      contactDetails,
      paymentMethod: paymentMethod || 'cash',
      status: 'pending',
      adminApproval: 'pending',
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      paidAmount: paymentMethod === 'online' ? totalEstimate : 0,
      paymentNotes: '', // For admin to add notes about cash payments
      createdAt: new Date().toISOString()
    }
    
    data.bookings.push(booking)
    await writeData('bookings', data)
    
    // Create notification for admin
    const notifData = await readData('notifications')
    const adminData = await readData('users')
    const admin = adminData.users.find(u => u.role === 'admin')
    if (admin) {
      notifData.notifications.push({
        id: notifData.nextId++,
        userId: admin.id,
        type: 'booking',
        message: `New booking request #${booking.id} - ${date} ${timeSlot}`,
        read: false,
        createdAt: new Date().toISOString()
      })
    }
    
    // Create notification for customer
    notifData.notifications.push({
      id: notifData.nextId++,
      userId: parseInt(req.userId),
      type: 'booking',
      message: `Booking request #${booking.id} submitted. Awaiting admin approval.`,
      read: false,
      createdAt: new Date().toISOString()
    })
    await writeData('notifications', notifData)
    
    res.json({ success: true, bookingId: booking.id, booking })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/bookings', requireAuth, async (req, res) => {
  try {
    const data = await readData('bookings')
    const userBookings = data.bookings.filter(b => b.userId === parseInt(req.userId))
    res.json(userBookings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== PAYMENT ROUTES ==========
app.post('/api/payments/order/:id', requireAuth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body
    const data = await readData('orders')
    const order = data.orders.find(o => o.id === parseInt(req.params.id) && o.userId === parseInt(req.userId))
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    
    const paidAmount = (order.paidAmount || 0) + parseFloat(amount)
    order.paidAmount = paidAmount
    order.paymentStatus = paidAmount >= order.total ? 'paid' : 'partial'
    order.paymentMethod = paymentMethod || order.paymentMethod
    
    await writeData('orders', data)
    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/payments/booking/:id', requireAuth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body
    const data = await readData('bookings')
    const booking = data.bookings.find(b => b.id === parseInt(req.params.id) && b.userId === parseInt(req.userId))
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    
    const paidAmount = (booking.paidAmount || 0) + parseFloat(amount)
    booking.paidAmount = paidAmount
    booking.paymentStatus = paidAmount >= booking.totalEstimate ? 'paid' : 'partial'
    
    await writeData('bookings', data)
    res.json({ success: true, booking })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== GALLERY ROUTES ==========
app.get('/api/gallery', async (req, res) => {
  try {
    const { category } = req.query
    const data = await readData('gallery')
    let images = data.images
    
    if (category) {
      images = images.filter(img => img.category === category)
    }
    
    res.json(images)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ========== ADMIN ROUTES ==========
app.get('/api/admin/bookings', requireAdmin, async (req, res) => {
  try {
    const data = await readData('bookings')
    res.json(data.bookings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/admin/bookings/:id', requireAdmin, async (req, res) => {
  try {
    const { status, adminApproval } = req.body
    const data = await readData('bookings')
    const booking = data.bookings.find(b => b.id === parseInt(req.params.id))
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    if (status) booking.status = status
    if (adminApproval) booking.adminApproval = adminApproval
    await writeData('bookings', data)
    
    // Create notification for customer
    const notifData = await readData('notifications')
    notifData.notifications.push({
      id: notifData.nextId++,
      userId: booking.userId,
      type: 'booking',
      message: `Booking #${booking.id} ${adminApproval === 'approved' ? 'approved' : adminApproval === 'rejected' ? 'rejected' : 'status updated'}`,
      read: false,
      createdAt: new Date().toISOString()
    })
    await writeData('notifications', notifData)
    
    res.json({ success: true, booking })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/admin/bookings/:id/payment', requireAdmin, async (req, res) => {
  try {
    const { paidAmount, paymentNotes } = req.body
    const data = await readData('bookings')
    const booking = data.bookings.find(b => b.id === parseInt(req.params.id))
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    booking.paidAmount = (booking.paidAmount || 0) + parseFloat(paidAmount || 0)
    booking.paymentStatus = booking.paidAmount >= booking.totalEstimate ? 'paid' : booking.paidAmount > 0 ? 'partial' : 'pending'
    if (paymentNotes) {
      booking.paymentNotes = (booking.paymentNotes || '') + (booking.paymentNotes ? '\n' : '') + `[${new Date().toLocaleString()}] ${paymentNotes}`
    }
    await writeData('bookings', data)
    
    // Create notification for customer
    const notifData = await readData('notifications')
    notifData.notifications.push({
      id: notifData.nextId++,
      userId: booking.userId,
      type: 'booking',
      message: `Payment recorded for booking #${booking.id}. Amount: ₹${paidAmount}`,
      read: false,
      createdAt: new Date().toISOString()
    })
    await writeData('notifications', notifData)
    
    res.json({ success: true, booking })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/admin/menu', requireAdmin, async (req, res) => {
  try {
    const data = await readData('menuItems')
    const newItem = {
      id: data.nextId++,
      ...req.body,
      createdAt: new Date().toISOString()
    }
    data.items.push(newItem)
    await writeData('menuItems', data)
    res.json({ success: true, item: newItem })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/admin/menu/:id', requireAdmin, async (req, res) => {
  try {
    const data = await readData('menuItems')
    const item = data.items.find(i => i.id === parseInt(req.params.id))
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    Object.assign(item, req.body)
    await writeData('menuItems', data)
    res.json({ success: true, item })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/admin/menu/:id', requireAdmin, async (req, res) => {
  try {
    const data = await readData('menuItems')
    data.items = data.items.filter(i => i.id !== parseInt(req.params.id))
    await writeData('menuItems', data)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    const data = await readData('orders')
    res.json(data.orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { status, adminApproval } = req.body
    const data = await readData('orders')
    const order = data.orders.find(o => o.id === parseInt(req.params.id))
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    if (status) order.status = status
    if (adminApproval) order.adminApproval = adminApproval
    await writeData('orders', data)
    
    // Create notification for customer
    const notifData = await readData('notifications')
    notifData.notifications.push({
      id: notifData.nextId++,
      userId: order.userId,
      type: 'order',
      message: `Order #${order.id} ${adminApproval === 'approved' ? 'approved' : adminApproval === 'rejected' ? 'rejected' : 'status updated'}`,
      read: false,
      createdAt: new Date().toISOString()
    })
    await writeData('notifications', notifData)
    
    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/admin/orders/:id/payment', requireAdmin, async (req, res) => {
  try {
    const { paidAmount, paymentNotes } = req.body
    const data = await readData('orders')
    const order = data.orders.find(o => o.id === parseInt(req.params.id))
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    order.paidAmount = (order.paidAmount || 0) + parseFloat(paidAmount || 0)
    order.paymentStatus = order.paidAmount >= order.total ? 'paid' : order.paidAmount > 0 ? 'partial' : 'pending'
    if (paymentNotes) {
      order.paymentNotes = (order.paymentNotes || '') + (order.paymentNotes ? '\n' : '') + `[${new Date().toLocaleString()}] ${paymentNotes}`
    }
    await writeData('orders', data)
    
    // Create notification for customer
    const notifData = await readData('notifications')
    notifData.notifications.push({
      id: notifData.nextId++,
      userId: order.userId,
      type: 'order',
      message: `Payment recorded for order #${order.id}. Amount: ₹${paidAmount}`,
      read: false,
      createdAt: new Date().toISOString()
    })
    await writeData('notifications', notifData)
    
    res.json({ success: true, order })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/admin/reports', requireAdmin, async (req, res) => {
  try {
    const ordersData = await readData('orders')
    const bookingsData = await readData('bookings')
    const menuData = await readData('menuItems')
    
    const today = new Date().toISOString().split('T')[0]
    const todayOrders = ordersData.orders.filter(o => o.createdAt.startsWith(today))
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0)
    
    const upcomingBookings = bookingsData.bookings.filter(b => 
      b.status === 'confirmed' && b.date >= today
    )
    
    const pendingOrders = ordersData.orders.filter(o => o.status === 'pending')
    
    // Popular items
    const itemCounts = {}
    ordersData.orders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.menuItemId] = (itemCounts[item.menuItemId] || 0) + item.qty
      })
    })
    
    const popularItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const item = menuData.items.find(i => i.id === parseInt(id))
        return { ...item, orderCount: count }
      })
    
    res.json({
      todayRevenue,
      todayOrders: todayOrders.length,
      upcomingBookings: upcomingBookings.length,
      pendingOrders: pendingOrders.length,
      popularItems
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

// Initialize and start server
initDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}).catch(console.error)

