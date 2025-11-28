# 🚀 Backend API - Django Project

## 📖 Mô tả
Dự án backend API được xây dựng bằng Django Framework, cung cấp các API endpoints cho ứng dụng web.

## 🛠️ Công nghệ sử dụng
- **Python** 3.13+
- **Django** 5.2.8
- **SQLite** (Database mặc định)
- **Django REST Framework** (Tùy chọn cho API)

## 📋 Yêu cầu hệ thống
- Python 3.13 hoặc cao hơn
- pip (Python package manager)
- Git

## 🚀 Hướng dẫn cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd BTL_CNPM
```

### 2. Tạo và kích hoạt môi trường ảo
```bash
# Tạo virtual environment
python -m venv .venv

# Kích hoạt virtual environment
# Trên Windows:
.venv\Scripts\activate

# Trên macOS/Linux:
source .venv/bin/activate
```

### 3. Cài đặt dependencies
```bash
# Di chuyển đến thư mục gốc (nếu chưa có)
cd BTL_CNPM

# Cài đặt các package cần thiết
pip install -r requirements.txt
```

### 4. Cấu hình database
```bash
# Di chuyển đến thư mục Django project
cd init_project

# Chạy migrations để tạo database
python manage.py makemigrations
python manage.py migrate
```

### 5. Tạo superuser (tùy chọn)
```bash
# Tạo tài khoản admin
python manage.py createsuperuser
```

### 6. Chạy development server
```bash
# Chạy server trên port 8000
python manage.py runserver

# Hoặc chạy trên port tùy chỉnh
python manage.py runserver 8080
```

### 7. Truy cập ứng dụng
- **Trang web chính**: http://localhost:8000/
- **Admin panel**: http://localhost:8000/admin/ (nếu đã tạo superuser)
- **Polls app**: http://localhost:8000/polls/

## 📁 Cấu trúc project
```
init_project/
├── manage.py              # Django management script
├── db.sqlite3            # SQLite database file
├── init_project/         # Main project settings
│   ├── __init__.py
│   ├── settings.py       # Cấu hình Django
│   ├── urls.py           # URL routing chính
│   ├── wsgi.py           # WSGI configuration
│   └── asgi.py           # ASGI configuration
└── polls/                # App polls
    ├── __init__.py
    ├── admin.py          # Django admin configuration
    ├── apps.py           # App configuration
    ├── models.py         # Database models
    ├── views.py          # View functions
    ├── urls.py           # App URL routing
    ├── services.py       # Business logic
    ├── tests.py          # Unit tests
    ├── migrations/       # Database migrations
    └── templates/        # HTML templates
        └── polls/
            └── index.html
```

## 🔧 Lệnh hữu ích

### Database Management
```bash
# Tạo migrations mới
python manage.py makemigrations [app_name]

# Áp dụng migrations
python manage.py migrate

# Reset database (xóa db.sqlite3 và tạo lại)
rm db.sqlite3
python manage.py migrate
```

### Development
```bash
# Chạy tests
python manage.py test

# Collect static files (production)
python manage.py collectstatic

# Tạo app mới
python manage.py startapp [app_name]

# Django shell
python manage.py shell
```

### Package Management
```bash
# Cập nhật requirements.txt
pip freeze > requirements.txt

# Cài đặt package mới
pip install [package_name]

# Gỡ cài đặt package
pip uninstall [package_name]
```

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **ModuleNotFoundError**: Đảm bảo đã kích hoạt virtual environment và cài đặt dependencies
```bash
.venv\Scripts\activate
pip install -r requirements.txt
```

2. **Database errors**: Chạy lại migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

3. **Port đã được sử dụng**: Thay đổi port
```bash
python manage.py runserver 8080
```

4. **Permission errors**: Đảm bảo có quyền ghi trong thư mục project

## 📚 Tài liệu tham khảo
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)

## 🤝 Đóng góp
1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License
Dự án này được phân phối dưới giấy phép MIT License.

## 📞 Liên hệ
- **Developer**: [Tên của bạn]
- **Email**: [email@example.com]
- **Project Link**: [https://github.com/nghiem2705/BTL_CNPM](https://github.com/nghiem2705/BTL_CNPM)

---

## 🔄 Cập nhật gần đây
- **[Date]**: Khởi tạo project Django
- **[Date]**: Thêm polls app
- **[Date]**: Cấu hình cơ bản