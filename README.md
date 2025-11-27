# Quản Lý Sân Cầu Lông

Hệ thống quản lý đặt sân cầu lông với React + Vite frontend và Node.js backend.

## Cấu trúc dự án

```
quanlysancaulong/
├── backend/           # Node.js + Express backend
│   ├── config/       # Database configuration
│   ├── models/       # Data models
│   ├── services/     # Business logic
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   └── server.js     # Entry point
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app
│   └── index.html
└── package.json
```

## Yêu cầu hệ thống

- Node.js >= 16
- MySQL >= 5.7
- npm hoặc yarn

## Cài đặt

1. **Cài đặt dependencies:**
```bash
npm run install:all
```

2. **Cấu hình database:**
- Tạo database MySQL với tên `quanlysancaulong`
- Cập nhật thông tin trong `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quanlysancaulong
```

3. **Chạy ứng dụng:**
```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000
Frontend sẽ chạy tại: http://localhost:3000

## Tính năng

### Người dùng (Customer)
- Đăng ký/Đăng nhập
- Xem danh sách sân
- Đặt sân theo ngày giờ
- Xem lịch sử đặt sân
- Hủy đặt sân

### Quản trị viên (Admin)
- Quản lý người dùng
- Thêm/sửa/xóa sân
- Xem danh sách đặt sân
- Xác nhận thanh toán
- Thống kê doanh thu

## API Endpoints

### Authentication
- POST `/api/users/register` - Đăng ký
- POST `/api/users/login` - Đăng nhập
- GET `/api/users/profile` - Thông tin user

### Courts
- GET `/api/courts` - Danh sách sân
- POST `/api/courts` - Thêm sân (Admin)
- PUT `/api/courts/:id` - Cập nhật sân (Admin)
- DELETE `/api/courts/:id` - Xóa sân (Admin)

### Bookings
- GET `/api/bookings/my-bookings` - Lịch sử đặt sân
- POST `/api/bookings` - Tạo đặt sân
- PATCH `/api/bookings/:id/status` - Cập nhật trạng thái (Admin)

### Payments
- POST `/api/payments/confirm/:bookingId` - Xác nhận thanh toán (Admin)

## Database Schema

- **User**: UserID, FullName, Email, Password, Phone, Role
- **Court**: CourtID, CourtName, Address, PricePerHour, Status
- **Booking**: BookingID, UserID, CourtID, BookingDate, StartTime, EndTime, Status
- **Payment**: PaymentID, BookingID, Amount, PaymentDate, TransactionCode

## Công nghệ sử dụng

### Backend
- Node.js + Express
- MySQL2
- JWT authentication
- bcryptjs

### Frontend
- React 18
- Vite
- React Router
- Axios
- Lucide Icons

## License

MIT
# quanglysancaulong
