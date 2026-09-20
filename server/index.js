import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Initialize database connection
async function initDb() {
  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
  console.log('Connected to SQLite database.');
  
  // Safely add profile_pic column if it doesn't exist
  try {
    await db.exec('ALTER TABLE users ADD COLUMN profile_pic TEXT');
    console.log('Added profile_pic column to users table.');
  } catch (err) {
    // Column already exists, ignore
  }
}

initDb();

// --- Auth Endpoints ---

app.post('/api/auth/login', async (req, res) => {
  const { uniqueId, password, role } = req.body;
  
  if (!uniqueId || !password) {
    return res.status(400).json({ error: 'Missing uniqueId or password' });
  }

  try {
    const user = await db.get(
      'SELECT id, unique_id, name, role, designation, phone, badge_number, profile_pic FROM users WHERE unique_id = ? AND password = ?',
      [uniqueId.toUpperCase(), password]
    );

    if (user) {
      if (role && user.role !== role && !(role === 'customer' && user.role !== 'admin')) {
        if (role === 'cook' && user.role !== 'cook') {
            return res.status(403).json({ error: 'Access denied. Cook portal requires Cook role.' });
        }
        if (role === 'admin' && user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin portal requires Admin role.' });
        }
      }

      // Map snake_case to camelCase for the frontend
      const userData = {
        id: user.id,
        uniqueId: user.unique_id,
        name: user.name,
        role: user.role,
        designation: user.designation,
        phone: user.phone,
        badgeNumber: user.badge_number,
        profilePic: user.profile_pic
      };
      return res.json({ user: userData });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { uniqueId, password, name, phone, role } = req.body;

  if (!uniqueId || !password || !name || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if uniqueId already exists
    const existing = await db.get('SELECT unique_id FROM users WHERE unique_id = ?', [uniqueId.toUpperCase()]);
    if (existing) {
      return res.status(409).json({ error: 'Unique ID already exists. Please choose another.' });
    }

    const designation = role === 'cook' ? 'New Home Cook' : 'New Customer';

    await db.run(
      'INSERT INTO users (id, unique_id, name, role, designation, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uniqueId.toUpperCase(), uniqueId.toUpperCase(), name, role || 'customer', designation, phone, password]
    );

    const newUser = {
      id: uniqueId.toUpperCase(),
      uniqueId: uniqueId.toUpperCase(),
      name,
      role: role || 'customer',
      designation,
      phone
    };

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/auth/profile', async (req, res) => {
  const { uniqueId, name, password, profilePic } = req.body;
  if (!uniqueId) return res.status(400).json({ error: 'Missing uniqueId' });

  try {
    await db.run(
      'UPDATE users SET name = ?, password = ?, profile_pic = ? WHERE unique_id = ?',
      [name, password, profilePic, uniqueId.toUpperCase()]
    );
    // Fetch updated user to return
    const user = await db.get(
      'SELECT id, unique_id, name, role, designation, phone, badge_number, profile_pic FROM users WHERE unique_id = ?',
      [uniqueId.toUpperCase()]
    );
    const userData = {
      id: user.id,
      uniqueId: user.unique_id,
      name: user.name,
      role: user.role,
      designation: user.designation,
      phone: user.phone,
      badgeNumber: user.badge_number,
      profilePic: user.profile_pic
    };
    return res.json({ user: userData, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Orders Endpoints ---

app.post('/api/orders', async (req, res) => {
  const { id, customerId, customerName, cookName, items, foodCategory, price, deliveryFee, status, orderedAt, deliveryAddress, estimatedDelivery } = req.body;

  try {
    await db.run(
      `INSERT INTO orders (id, customer_id, customer_name, cook_name, items, food_category, price, delivery_fee, status, ordered_at, delivery_address, estimated_delivery)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, customerId, customerName, cookName, items, foodCategory || 'Mixed', price, deliveryFee, status, orderedAt, deliveryAddress, estimatedDelivery]
    );
    res.status(201).json({ success: true, message: 'Order saved' });
  } catch (error) {
    console.error('Save order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await db.all(
      'SELECT id, customer_id as customerId, customer_name as customer, cook_name as cook, items, food_category as foodCategory, price, delivery_fee as deliveryFee, status, ordered_at as orderedAt, delivery_address as deliveryAddress, estimated_delivery as estimatedDelivery FROM orders WHERE customer_id = ? ORDER BY ordered_at DESC',
      [userId.toUpperCase()]
    );
    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/all', async (req, res) => {
  try {
    const orders = await db.all(
      'SELECT id, customer_id as customerId, customer_name as customer, cook_name as cook, items, food_category as foodCategory, price, delivery_fee as deliveryFee, status, ordered_at as orderedAt, delivery_address as deliveryAddress, estimated_delivery as estimatedDelivery FROM orders ORDER BY ordered_at DESC'
    );
    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/order/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.get(
      'SELECT id, customer_id as customerId, customer_name as customer, cook_name as cook, items, food_category as foodCategory, price, delivery_fee as deliveryFee, status, ordered_at as orderedAt, delivery_address as deliveryAddress, estimated_delivery as estimatedDelivery FROM orders WHERE id = ?',
      [id]
    );
    if (order) {
      res.json({ order });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Get single order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
