# Movie Booking API

API backend cho ứng dụng đặt vé xem phim, được triển khai trên Vercel.

## Cấu trúc dự án

```
server/
  ├── api/                  # Thư mục chứa API serverless cho Vercel
  │   ├── index.js          # Entry point cho API
  │   └── .env              # Biến môi trường cho API
  ├── controllers/          # Xử lý logic nghiệp vụ
  ├── middleware/           # Middleware
  ├── models/               # Định nghĩa schema MongoDB
  ├── routes/               # Định nghĩa routes
  ├── utils/                # Tiện ích
  ├── .env                  # Biến môi trường cho development
  ├── package.json          # Dependencies
  └── vercel.json           # Cấu hình Vercel
```

## Triển khai lên Vercel

1. Đăng nhập vào Vercel CLI:
```bash
vercel login
```

2. Triển khai:
```bash
vercel
```

3. Triển khai phiên bản production:
```bash
vercel --prod
```

## Biến môi trường

Đảm bảo các biến môi trường sau được cấu hình trên Vercel:

- `MONGODB_URI`: URI kết nối MongoDB Atlas
- `JWT_SECRET`: Secret key cho JWT
- `JWT_EXPIRE`: Thời gian hết hạn của JWT (ví dụ: 30d)
- `NODE_ENV`: "production"

## API Endpoints

### Authentication
- `POST /api/users/register`: Đăng ký người dùng mới
- `POST /api/users/login`: Đăng nhập
- `GET /api/users/profile`: Lấy thông tin người dùng hiện tại

### Movies
- `GET /api/movies`: Lấy danh sách phim
- `GET /api/movies/:id`: Lấy thông tin chi tiết phim
- `GET /api/movies/status/now-playing`: Lấy danh sách phim đang chiếu

### Showtimes
- `GET /api/showtimes/movie/:movieId`: Lấy danh sách suất chiếu của phim
- `GET /api/showtimes/:showtimeId/seats`: Lấy danh sách ghế của suất chiếu

### Bookings
- `GET /api/bookings`: Lấy danh sách đặt vé của người dùng
- `POST /api/bookings`: Tạo đặt vé mới
- `PUT /api/bookings/:id/cancel`: Hủy đặt vé

### Events
- `GET /api/events`: Lấy danh sách sự kiện
- `GET /api/events/:id`: Lấy thông tin chi tiết sự kiện

### News
- `GET /api/news`: Lấy danh sách tin tức
- `GET /api/news/:id`: Lấy thông tin chi tiết tin tức

## Phát triển local

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy server trong chế độ development:
```bash
npm run dev
```

Server sẽ chạy tại http://localhost:5010
