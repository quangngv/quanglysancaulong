# 🚀 HƯỚNG DẪN KHỞI ĐỘNG NHANH

## ✅ KHÔNG CẦN CÀI ĐẶT GÌ THÊM!

Dự án này sử dụng **SQLite** (database dạng file) nên bạn **KHÔNG CẦN** cài đặt MySQL hay bất kỳ database server nào!

## 🎯 CHẠY ỨNG DỤNG

### Cách 1: Sử dụng file START.bat (Dễ nhất - Windows)

1. Mở thư mục `quanlysancaulong`
2. Double-click file **START.bat**
3. Chờ 2 cửa sổ terminal mở lên (Backend và Frontend)
4. Truy cập: http://localhost:3000

### Cách 2: Chạy bằng lệnh

Từ thư mục gốc `quanlysancaulong`:
```powershell
npm run dev
```

### Cách 3: Chạy riêng lẻ

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## 🌐 TRUY CẬP ỨNG DỤNG

- **Frontend (Website)**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 👤 TÀI KHOẢN MẶC ĐỊNH

Hệ thống tự động tạo tài khoản Admin khi chạy lần đầu:

```
Email: admin@example.com
Password: admin123
```

## 📝 ĐĂNG KÝ TÀI KHOẢN MỚI

1. Truy cập: http://localhost:3000
2. Click **"Đăng ký ngay"**
3. Điền thông tin và đăng ký
4. Đăng nhập với tài khoản vừa tạo

## 📂 DATABASE

- Database được lưu tại: `backend/database.sqlite`
- Tự động tạo khi chạy lần đầu
- Muốn reset database: Xóa file `database.sqlite` và chạy lại server

## 📚 TÍNH NĂNG CHÍNH

### Người dùng thường (Customer):
- ✅ Đăng ký/Đăng nhập
- ✅ Xem danh sách sân
- ✅ Đặt sân theo ngày giờ
- ✅ Xem lịch sử đặt sân
- ✅ Hủy đặt sân

### Quản trị viên (Admin):
- ✅ Quản lý người dùng
- ✅ Thêm/sửa/xóa sân
- ✅ Xem và quản lý đặt sân
- ✅ Xác nhận thanh toán
- ✅ Thống kê doanh thu

## 🔧 CẤU TRÚC DỰ ÁN

```
quanlysancaulong/
├── backend/              # Node.js + Express + SQLite
│   ├── config/          # Database config
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── database.sqlite  # SQLite database file (tự tạo)
│   └── server.js        # Entry point
├── frontend/            # React + Vite
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       └── services/    # API services
├── START.bat            # File chạy nhanh
└── README.md
```

## ❗ XỬ LÝ LỖI

### Backend không khởi động được
**Giải pháp:**
- Kiểm tra port 5000 có đang bị chiếm không
- Mở Task Manager, tắt các tiến trình Node.js cũ
- Chạy lại

### Frontend không kết nối được Backend
**Giải pháp:**
- Đảm bảo Backend đang chạy (kiểm tra terminal backend)
- Reload trang (F5)
- Xóa cache trình duyệt (Ctrl + Shift + Delete)

### Muốn xóa hết dữ liệu và bắt đầu lại
**Giải pháp:**
1. Tắt Backend server
2. Xóa file `backend/database.sqlite`
3. Chạy lại Backend

## 🆘 HỖ TRỢ

Xem thêm chi tiết trong:
- `README.md` - Tài liệu đầy đủ về dự án
- `DATABASE_SETUP.md` - Thông tin về database (chỉ tham khảo, không cần thiết)
