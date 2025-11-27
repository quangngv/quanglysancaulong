# Hướng dẫn thiết lập Database

## Bước 1: Cài đặt MySQL

### Windows:
1. Tải XAMPP từ: https://www.apachefriends.org/
2. Cài đặt XAMPP
3. Mở XAMPP Control Panel
4. Khởi động MySQL (nhấn nút "Start" bên cạnh MySQL)

### Hoặc cài MySQL trực tiếp:
1. Tải MySQL từ: https://dev.mysql.com/downloads/installer/
2. Cài đặt và thiết lập mật khẩu root

## Bước 2: Tạo Database

### Sử dụng XAMPP:
1. Mở trình duyệt, truy cập: http://localhost/phpmyadmin
2. Click tab "SQL"
3. Chạy lệnh: `CREATE DATABASE quanlysancaulong;`

### Hoặc sử dụng MySQL Command Line:
```sql
mysql -u root -p
CREATE DATABASE quanlysancaulong;
EXIT;
```

## Bước 3: Cấu hình Backend

Mở file `backend/.env` và cập nhật:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=         # Để trống nếu dùng XAMPP, hoặc nhập mật khẩu MySQL của bạn
DB_NAME=quanlysancaulong
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

## Bước 4: Chạy ứng dụng

```bash
# Từ thư mục gốc dự án
npm run dev
```

Hệ thống sẽ tự động tạo các bảng và dữ liệu mẫu khi khởi động lần đầu.

## Tài khoản mặc định (sẽ tạo khi chạy lần đầu)

Sau khi database được khởi tạo, bạn có thể tự đăng ký tài khoản admin hoặc tạo thủ công:

### Tạo tài khoản Admin thủ công:
1. Truy cập: http://localhost:3000/register
2. Đăng ký tài khoản mới
3. Vào phpMyAdmin
4. Chọn database `quanlysancaulong` -> bảng `User`
5. Sửa cột `Role` của user vừa tạo thành `Admin`

## Xử lý lỗi thường gặp

### Lỗi: ECONNREFUSED
- MySQL chưa được khởi động
- Kiểm tra XAMPP hoặc MySQL service đang chạy

### Lỗi: Access denied for user
- Sai mật khẩu MySQL trong file .env
- Kiểm tra lại DB_USER và DB_PASSWORD

### Lỗi: Unknown database
- Database chưa được tạo
- Tạo database theo Bước 2
