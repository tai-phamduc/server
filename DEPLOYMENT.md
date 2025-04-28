# Hướng dẫn triển khai Movie Booking App

## Cấu trúc dự án

Dự án được chia thành hai phần chính:
- **client**: Frontend React.js
- **server**: Backend Express.js API

## Triển khai API lên Vercel

### 1. Chuẩn bị dự án

1. Tạo thư mục `api` trong thư mục server:
```bash
mkdir -p server/api
```

2. Tạo file `vercel.json` trong thư mục server:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. Tạo file `index.js` trong thư mục `server/api`:
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://your-client-domain.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection - Optimized for Vercel serverless environment
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const client = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('MongoDB Connected');
    cachedDb = client;
    return cachedDb;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
}

// Connect to MongoDB
connectToDatabase();

// API Routes
app.use('/api/movies', require('../routes/movieRoutes'));
// Thêm các routes khác

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Export for Vercel
module.exports = app;
```

4. Cập nhật `package.json` trong thư mục server:
```json
{
  "main": "api/index.js",
  "scripts": {
    "start": "node api/index.js",
    "dev": "nodemon api/index.js",
    "vercel-build": "echo 'Building API for Vercel'"
  }
}
```

### 2. Triển khai lên Vercel

1. Cài đặt Vercel CLI:
```bash
npm install -g vercel
```

2. Đăng nhập vào Vercel:
```bash
vercel login
```

3. Triển khai từ thư mục server:
```bash
cd server
vercel
```

4. Triển khai phiên bản production:
```bash
vercel --prod
```

### 3. Cấu hình biến môi trường trên Vercel

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn dự án của bạn
3. Đi đến tab "Settings" > "Environment Variables"
4. Thêm các biến môi trường:
   - `MONGODB_URI`: URI kết nối MongoDB Atlas
   - `JWT_SECRET`: Secret key cho JWT
   - `NODE_ENV`: "production"

## Cập nhật client để sử dụng API đã triển khai

1. Tạo file `.env` trong thư mục client:
```
REACT_APP_API_URL=https://your-api-url.vercel.app/api
```

2. Cập nhật file `api.js` trong thư mục client:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://your-api-url.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});
```

## Triển khai client lên Vercel

1. Tạo file `vercel.json` trong thư mục client:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

2. Triển khai từ thư mục client:
```bash
cd client
vercel
```

3. Triển khai phiên bản production:
```bash
vercel --prod
```

## Kiểm tra ứng dụng đã triển khai

1. Truy cập URL client đã triển khai (ví dụ: https://movie-booking-client.vercel.app)
2. Đăng nhập với tài khoản admin:
   - Email: admin@example.com
   - Password: password123
3. Kiểm tra các chức năng của ứng dụng

## Xử lý lỗi phổ biến

1. **Lỗi CORS**: Cập nhật cấu hình CORS trong file `index.js` của server để cho phép domain của client
2. **Lỗi kết nối MongoDB**: Kiểm tra biến môi trường `MONGODB_URI` và cấu hình Network Access trong MongoDB Atlas
3. **Lỗi timeout**: Tối ưu hóa các API xử lý quá lâu hoặc tăng giá trị timeout trong client

## Theo dõi logs và hiệu suất

1. Xem logs API:
```bash
vercel logs your-api-project-name
```

2. Xem logs client:
```bash
vercel logs your-client-project-name
```

3. Theo dõi hiệu suất qua Vercel Dashboard
