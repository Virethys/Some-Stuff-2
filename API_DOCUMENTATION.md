# Pinspire API Documentation

This document describes the REST API endpoints required for the MoodBoardZ backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

### Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

### Get Current User
```
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "user_id",
  "email": "user@example.com",
  "username": "johndoe"
}
```

---

## Pins Endpoints

### Get All Pins
```
GET /api/pins
```

**Query Parameters:**
- `boardId` (optional): Filter by board ID
- `mood` (optional): Filter by mood (minimal, vibrant, dark, pastel, vintage, modern)
- `tag` (optional): Filter by tag

**Response:**
```json
[
  {
    "_id": "pin_id",
    "title": "Pin Title",
    "description": "Pin description",
    "imageUrl": "https://...",
    "boardId": "board_id",
    "tags": ["tag1", "tag2"],
    "mood": "minimal",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Single Pin
```
GET /api/pins/:id
```

### Create Pin (Protected)
```
POST /api/pins
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Pin Title",
  "description": "Pin description",
  "imageUrl": "https://...",
  "boardId": "board_id",
  "tags": ["tag1", "tag2"],
  "mood": "minimal"
}
```

### Update Pin (Protected)
```
PUT /api/pins/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (partial update)
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### Delete Pin (Protected)
```
DELETE /api/pins/:id
```

**Headers:** `Authorization: Bearer <token>`

---

## Boards Endpoints

### Get All Boards
```
GET /api/boards
```

**Response:**
```json
[
  {
    "_id": "board_id",
    "name": "Board Name",
    "description": "Board description",
    "coverImage": "https://...",
    "isPrivate": false,
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Single Board
```
GET /api/boards/:id
```

### Create Board (Protected)
```
POST /api/boards
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Board Name",
  "description": "Board description",
  "isPrivate": false
}
```

### Update Board (Protected)
```
PUT /api/boards/:id
```

**Headers:** `Authorization: Bearer <token>`

### Delete Board (Protected)
```
DELETE /api/boards/:id
```

**Headers:** `Authorization: Bearer <token>`

---

## Upload Endpoint

### Upload Image (Protected)
```
POST /api/upload
```

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:** FormData with `image` field

**Response:**
```json
{
  "url": "https://your-storage.com/uploaded-image.jpg"
}
```

---

## MongoDB Schemas

### User Schema
```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});
```

### Pin Schema
```javascript
const pinSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  tags: [{ type: String }],
  mood: { 
    type: String, 
    enum: ['minimal', 'vibrant', 'dark', 'pastel', 'vintage', 'modern'] 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### Board Schema
```javascript
const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  isPrivate: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});
```

---

## Postman Collection Setup

1. Create a new collection named "Pinspire API"
2. Set up environment variables:
   - `BASE_URL`: `http://localhost:5000/api`
   - `TOKEN`: (set after login)

3. For protected endpoints, add this to the "Authorization" tab:
   - Type: Bearer Token
   - Token: `{{TOKEN}}`

4. Test flow:
   1. Register a new user
   2. Login and save the token to `TOKEN` variable
   3. Create a board
   4. Upload an image
   5. Create a pin with the uploaded image URL
   6. Test GET, PUT, DELETE operations

---

## CORS Configuration

Make sure your Express backend has CORS enabled:

```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-url.com'],
  credentials: true
}));
```
