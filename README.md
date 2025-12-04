# 🎓 BTL CNPM - Hệ thống tư vấn học tập

Đây là một nền tảng học tập mở, nơi sinh viên có thể dễ dàng kết nối với giảng viên phù hợp, đặt lịch tư vấn học thuật, chia sẻ tài liệu, nhận phản hồi, và phát triển năng lực học tập một cách chủ động và hiệu quả.

## 📋 Mục lục

- [Các tính năng](#-các-tính-năng)
- [Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Troubleshooting](#-troubleshooting)
- [Đóng góp](#-đóng-góp)

---

## 🌟 Các tính năng

#### Cho Sinh viên

- 🔍 Tìm kiếm và xem danh sách giảng viên tư vấn
- 📅 Đăng ký buổi tư vấn với giảng viên
- 📊 Xem lịch sử các buổi tư vấn đã đăng ký
- ⭐ Đánh giá buổi tư vấn sau khi hoàn thành
- 👤 Quản lý thông tin cá nhân

#### Cho Tutor

- 📝 Tạo và quản lý các buổi tư vấn
- 📋 Xem danh sách sinh viên đã đăng ký
- 📆 Quản lý lịch trình tư vấn
- 📈 Xem đánh giá từ sinh viên
- 👤 Quản lý hồ sơ cá nhân

---

## 🛠️ Công nghệ sử dụng

### Backend Stack

- **Python** 3.13+ - Programming language
- **Django** 5.2.8 - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (development)
- **JSON Files** - Data storage (user, session, etc.)

### Frontend Stack

- **React** 19.2.0 - UI library
- **React Router DOM** 7.9.6 - Client-side routing
- **React Redux** 9.2.0 - State management
- **Tailwind CSS** 3.4.18 - Utility-first CSS
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Development Tools

- **React Scripts** 5.0.1 - Build tools
- **Testing Library** - Unit testing
- **ESLint** - Code linting
- **Git** - Version control

---

## 💻 Yêu cầu hệ thống

### Backend Requirements

- **Python** 3.13+ - [Tải về](https://www.python.org/downloads/)
- **pip** (Python package manager)
- **Django** 5.2.8

### Frontend Requirements

- **Node.js** 16.x+ - [Tải về](https://nodejs.org/)
- **npm** 8.x+ (đi kèm với Node.js)

### Chung

- **Git** - [Tải về](https://git-scm.com/)

### Kiểm tra phiên bản

```bash
# Python
python --version    # Python 3.13+

# Node.js
node --version      # v16.x.x+
npm --version       # 8.x.x+
```

---

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/nghiem2705/BTL_CNPM.git
cd BTL_CNPM
```

### 2. Cài đặt Backend (Django)

#### 2.1. Tạo và kích hoạt môi trường ảo

```bash
# Tạo virtual environment
python -m venv .venv

# Kích hoạt virtual environment
# Trên Windows:
.venv\Scripts\activate

# Trên macOS/Linux:
source .venv/bin/activate
```

#### 2.2. Cài đặt dependencies

```bash
# Cài đặt các package từ requirements.txt
pip install -r requirements.txt
```

#### 2.3. Cấu hình database

```bash
# Di chuyển đến thư mục backend
cd backend

# Chạy migrations để tạo database
python manage.py makemigrations
python manage.py migrate
```

#### 2.4. Tạo superuser (tùy chọn)

```bash
python manage.py createsuperuser
```

### 3. Cài đặt Frontend (React)

```bash
# Di chuyển đến thư mục frontend
cd frontend

# Cài đặt dependencies
# Sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install
```

### 4. Cấu hình môi trường (tùy chọn)

Tạo file `.env` trong thư mục `frontend`:

```bash
# Tạo file .env trong thư mục frontend
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
```

---

## 🏃 Chạy ứng dụng

### Chạy cả Backend và Frontend

#### Terminal 1 - Backend Server

```bash
cd backend
# Chạy server trên port 8000
python manage.py runserver
# Backend chạy tại: http://localhost:8000

# Hoặc chạy trên port tùy chỉnh
python manage.py runserver 8080
```

#### Terminal 2 - Frontend Development Server

```bash
cd frontend
npm start
# Frontend chạy tại: http://localhost:3000
```

### Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin (nếu đã tạo superuser)

### Build cho Production

#### Backend

```bash
cd backend
python manage.py collectstatic
# Deploy với WSGI server (Gunicorn, uWSGI, etc.)
```

#### Frontend

```bash
cd frontend
npm run build
# Output trong thư mục build/

# Serve build locally để test
npm install -g serve
serve -s build -l 3000
```

---

## 📁 Cấu trúc dự án

```
BTL_CNPM/
├── README.md                      # Tài liệu chính (file này)
├── requirements.txt               # Python dependencies
│
├── backend/                       # Django Backend
│   ├── manage.py                  # Django management script
│   ├── data/                      # JSON data files
│   │   ├── user.json             # User profiles (10 students + 10 tutors)
│   │   ├── session.json          # Session schedules (16 sessions)
│   │   ├── grade.json            # Student grades
│   │   ├── rate.json             # Session ratings
│   │   └── sso/
│   │       └── user.json         # Authentication credentials
│   ├── init_project/             # Django settings
│   │   ├── settings.py           # Main configuration
│   │   ├── urls.py               # Root URL routing
│   │   ├── utils.py              # Utility functions
│   │   ├── wsgi.py               # WSGI config
│   │   └── asgi.py               # ASGI config
│   ├── polls/                    # Main Django app
│   │   ├── models.py             # Database models
│   │   ├── views.py              # View functions
│   │   ├── urls.py               # App URL routing
│   │   ├── services.py           # Business logic
│   │   ├── controller/           # Controllers
│   │   │   ├── BaseController.py
│   │   │   ├── InformationController.py    # Auth & user info
│   │   │   ├── SchedulerController.py      # Session management
│   │   │   ├── LibraryController.py
│   │   │   ├── GradingController.py
│   │   │   └── RatingController.py
│   │   ├── view/                 # API Views
│   │   │   ├── BaseView.py
│   │   │   ├── InformationView.py
│   │   │   ├── SchedulerView.py
│   │   │   ├── LibraryView.py
│   │   │   ├── GradingView.py
│   │   │   └── RatingView.py
│   │   ├── entity/               # Data entities
│   │   │   ├── UserEntity.py
│   │   │   ├── SessionEntity.py
│   │   │   └── GradingEntity.py
│   │   └── migrations/           # Database migrations
│   └── tests/                    # Backend tests
│       └── postman_test_collection.json
│
└── frontend/                      # React Frontend
    ├── package.json               # Node dependencies
    ├── tailwind.config.js         # Tailwind CSS config
    ├── public/
    │   ├── index.html            # HTML template
    │   ├── manifest.json         # PWA manifest
    │   └── avatar/               # User avatars
    └── src/
        ├── App.jsx               # Main App component
        ├── index.js              # App entry point
        ├── index.css             # Global styles + Tailwind
        ├── api/                  # API calls
        │   ├── index.js
        │   ├── Login.js
        │   ├── ProfileApi.js
        │   ├── StudentSession.js
        │   ├── TutorSession.js
        │   └── StudentGetTutor.js
        ├── utils/                # Utility functions
        │   └── validation.js     # Form validation (8 functions)
        ├── components/           # Reusable components
        │   └── ViewMorePopup/
        ├── layout/               # Layout components
        │   ├── Header/
        │   │   ├── student_index.jsx
        │   │   └── tutor_index.jsx
        │   └── Footer/
        ├── pages/                # Page components
        │   ├── Home/
        │   ├── Login/
        │   │   ├── index.jsx
        │   │   └── RoleSelection.jsx
        │   ├── NotFound/
        │   ├── student/          # Student pages
        │   │   ├── Home/
        │   │   ├── Profile/
        │   │   ├── TutorMatch/   # Find tutors
        │   │   ├── Consultation/ # View sessions
        │   │   ├── ConsultationDetail/
        │   │   └── ConsultationRegister/
        │   └── tutor/            # Tutor pages
        │       ├── Home/
        │       ├── Profile/
        │       ├── Consultation/ # Manage sessions
        │       ├── ConsultationDetail/
        │       └── ConsultationCreate/
        └── routes/               # Route configuration
            └── index.js
```

---

## 🔧 Lệnh hữu ích

### Backend Commands

```bash
# Database Management
python manage.py makemigrations     # Tạo migrations
python manage.py migrate            # Áp dụng migrations
python manage.py flush              # Xóa tất cả data

# Development
python manage.py runserver          # Chạy dev server
python manage.py runserver 8080     # Chạy trên port 8080
python manage.py shell              # Django shell
python manage.py test               # Chạy tests

# Production
python manage.py collectstatic      # Collect static files
python manage.py check --deploy     # Check deployment issues

# Package Management
pip freeze > requirements.txt       # Update requirements
pip install [package]               # Cài package mới
pip list --outdated                 # Check outdated packages
```

### Frontend Scripts

```bash
# Development
npm start                           # Dev server (port 3000)
npm test                            # Run tests
npm test -- --coverage              # Run tests with coverage

# Production
npm run build                       # Build for production
npm run build -- --profile          # Build with profiling

# Maintenance
npm install                         # Install dependencies
npm update                          # Update dependencies
npm audit                           # Check vulnerabilities
npm audit fix                       # Fix vulnerabilities

# Utilities
npx kill-port 3000                  # Kill process on port 3000
npm run eject                       # Eject from CRA (⚠️ irreversible)
```

---

## 🐛 Troubleshooting

### Backend Issues

#### ModuleNotFoundError

```bash
# Đảm bảo virtual environment được kích hoạt
.venv\Scripts\activate              # Windows
source .venv/bin/activate           # macOS/Linux

# Cài lại dependencies
pip install -r requirements.txt
```

#### Database errors

```bash
# Reset database
cd backend
del db.sqlite3                      # Windows
rm db.sqlite3                       # macOS/Linux

# Recreate database
python manage.py migrate
```

#### Port already in use

```bash
# Sử dụng port khác
python manage.py runserver 8080

# Hoặc kill process (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend Issues

#### `Module not found` errors

```bash
cd frontend
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Tailwind CSS không hoạt động

```bash
# Đảm bảo Tailwind được import trong src/index.css
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# Restart dev server
npm start
```

#### Build fails

```bash
# Clear cache
npm start -- --reset-cache

# Hoặc xóa cache manually
rm -rf node_modules/.cache
```

#### Port 3000 already in use

```bash
# Sử dụng port khác
PORT=3001 npm start

# Hoặc kill process
npx kill-port 3000
```

### Common Issues

#### CORS errors

Backend `settings.py` đã cấu hình CORS. Nếu vẫn lỗi:

```python
# backend/init_project/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

#### API connection refused

- Đảm bảo backend server đang chạy
- Check URL trong frontend API calls
- Verify port numbers (backend: 8000, frontend: 3000)

---

## 🤝 Đóng góp

1. **Fork** repository
2. **Clone** fork của bạn
   ```bash
   git clone https://github.com/YOUR_USERNAME/BTL_CNPM.git
   ```
3. **Tạo branch** mới
   ```bash
   git checkout -b feature/TenTinhNangMoi
   ```
4. **Commit** changes
   ```bash
   git commit -m 'Add: Thêm tính năng XYZ'
   ```
5. **Push** lên branch
   ```bash
   git push origin feature/TenTinhNangMoi
   ```
6. **Tạo Pull Request** trên GitHub

---

## 📚 Tài liệu tham khảo

### Backend

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [PEP 8 Style Guide](https://pep8.org/)

### Frontend

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Create React App](https://create-react-app.dev/)

### Tools

- [Git Documentation](https://git-scm.com/doc)
- [Postman API Testing](https://www.postman.com/)
- [VS Code](https://code.visualstudio.com/docs)

---

## 📄 License

Dự án này được phân phối dưới giấy phép MIT License.

---

## 📞 Liên hệ

**Repository**: [https://github.com/nghiem2705/BTL_CNPM](https://github.com/nghiem2705/BTL_CNPM)

---

**Made with ❤️ and ☕ by CNPM Team | Bugs 🐛 are features ✨ we didn't know we wanted... yet!**
