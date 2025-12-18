# Backend API Documentation (ExpressJS + MongoDB)

Dokumentasi sederhana untuk membuat backend yang akan terhubung dengan frontend ini.

## Struktur Folder Backend

```
backend/
├── server.js          # Entry point
├── routes/
│   ├── auth.js        # Routes untuk login/register
│   └── pins.js        # Routes untuk CRUD pins
├── models/
│   ├── User.js        # Model User
│   └── Pin.js         # Model Pin
├── middleware/
│   └── auth.js        # Middleware autentikasi JWT
└── package.json
```

---

## 1. Setup Project

```bash
mkdir backend
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors multer dotenv
```

---

## 2. server.js

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pins', require('./routes/pins'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 3. Models

### models/User.js

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
```

### models/Pin.js

```javascript
const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  tags: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Pin', PinSchema);
```

---

## 4. Middleware Auth

### middleware/auth.js

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

---

## 5. Routes

### routes/auth.js

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ email, password: hashedPassword, username });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      user: { _id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      user: { _id: user._id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

### routes/pins.js

```javascript
const express = require('express');
const Pin = require('../models/Pin');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/pins - Get all pins (public)
router.get('/', async (req, res) => {
  try {
    const pins = await Pin.find().sort({ createdAt: -1 });
    res.json(pins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/pins/:id - Get one pin (public)
router.get('/:id', async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }
    res.json(pin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/pins - Create pin (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const pin = new Pin({
      ...req.body,
      userId: req.userId,
    });
    await pin.save();
    res.status(201).json(pin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/pins/:id - Update pin (auth required)
router.put('/:id', auth, async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    // Check ownership
    if (pin.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Pin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/pins/:id - Delete pin (auth required)
router.delete('/:id', auth, async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    // Check ownership
    if (pin.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await pin.deleteOne();
    res.json({ message: 'Pin deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

---

## 6. Environment Variables (.env)

```
MONGO_URI=mongodb://localhost:27017/pinterest-clone
JWT_SECRET=your_secret_key_here
PORT=5000
```

---

## 7. Test dengan Postman

### Register
- **POST** `http://localhost:5000/api/auth/register`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "123456",
  "username": "testuser"
}
```

### Login
- **POST** `http://localhost:5000/api/auth/login`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

### Get All Pins
- **GET** `http://localhost:5000/api/pins`

### Create Pin (need token)
- **POST** `http://localhost:5000/api/pins`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body (JSON):
```json
{
  "title": "My Pin",
  "description": "Description here",
  "imageUrl": "https://example.com/image.jpg",
  "tags": ["nature", "photography"]
}
```

### Update Pin (need token)
- **PUT** `http://localhost:5000/api/pins/:id`
- Headers: `Authorization: Bearer YOUR_TOKEN`

### Delete Pin (need token)
- **DELETE** `http://localhost:5000/api/pins/:id`
- Headers: `Authorization: Bearer YOUR_TOKEN`

---

## Run Server

```bash
node server.js
```

Server will run at `http://localhost:5000`
