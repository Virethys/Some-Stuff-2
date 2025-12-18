# Pinspire Backend API

Backend API untuk Pinspire Pinterest Clone menggunakan Express.js dan MongoDB.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Copy file `.env.example` menjadi `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Edit file `.env`:
```
MONGODB_URI=mongodb://localhost:27017/pinspire
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

### 3. Jalankan MongoDB

Pastikan MongoDB sudah terinstall dan berjalan di komputer Anda.

### 4. Buat folder uploads

```bash
mkdir uploads
```

### 5. Jalankan Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Pins
- `GET /api/pins` - Get semua pins
- `GET /api/pins/:id` - Get single pin
- `POST /api/pins` - Create pin (Protected)
- `PUT /api/pins/:id` - Update pin (Protected)
- `DELETE /api/pins/:id` - Delete pin (Protected)

### Boards
- `GET /api/boards` - Get semua boards
- `GET /api/boards/:id` - Get single board
- `POST /api/boards` - Create board (Protected)
- `PUT /api/boards/:id` - Update board (Protected)
- `DELETE /api/boards/:id` - Delete board (Protected)

### Upload
- `POST /api/upload` - Upload image (Protected)

## Testing dengan Postman

1. Import collection dari `API_DOCUMENTATION.md`
2. Set environment variable `BASE_URL` = `http://localhost:5000/api`
3. Register/Login untuk mendapat token
4. Set token di environment variable `TOKEN`
5. Test semua endpoints

## Struktur Folder

```
backend/
├── config/
│   └── db.js           # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── boardController.js
│   ├── pinController.js
│   └── uploadController.js
├── middleware/
│   └── auth.js         # JWT authentication
├── models/
│   ├── Board.js
│   ├── Pin.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── boardRoutes.js
│   ├── pinRoutes.js
│   └── uploadRoutes.js
├── uploads/            # Uploaded images
├── .env.example
├── package.json
├── README.md
└── server.js           # Entry point
```
