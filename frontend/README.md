# 🎯 Frontend - BTL CNPM

Ứng dụng React Frontend cho dự án Bài Tập Lớn Công Nghệ Phần Mềm.

## 📋 Mục lục

- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Scripts có sẵn](#-scripts-có-sẵn)
- [Triển khai](#-triển-khai)
- [Troubleshooting](#-troubleshooting)

## 💻 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

- **Node.js** (phiên bản 16.x trở lên) - [Tải về](https://nodejs.org/)
- **npm** (đi kèm với Node.js) hoặc **yarn**
- **Git** - [Tải về](https://git-scm.com/)

### Kiểm tra phiên bản:
```bash
node --version    # v16.x.x trở lên
npm --version     # 8.x.x trở lên
```

## 🚀 Cài đặt

### 1. Clone repository
```bash
git clone https://github.com/nghiem2705/BTL_CNPM.git
cd BTL_CNPM/frontend
```

### 2. Cài đặt dependencies
```bash
# Sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install
```

### 3. Tạo file cấu hình môi trường (tuỳ chọn)
```bash
# Tạo file .env trong thư mục frontend
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
```

## 🏃 Chạy ứng dụng

### Development Mode
```bash
# Chạy server development
npm start

# Ứng dụng sẽ mở tại: http://localhost:3000
```

### Production Build
```bash
# Build ứng dụng cho production
npm run build

# Serve build folder (cài đặt serve nếu chưa có)
npm install -g serve
serve -s build -l 3000
```

## 📁 Cấu trúc dự án

```
frontend/
├── public/
│   ├── index.html          # HTML template chính
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # SEO robots
├── src/
│   ├── api/                # API calls và services
│   │   └── index.js
│   ├── layout/             # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── index.jsx
│   ├── pages/              # Page components
│   │   ├── Home/
│   │   ├── Login/
│   │   └── NotFound/       # 404 page với Tailwind
│   ├── routes/             # Route configuration
│   │   └── index.js
│   ├── App.jsx             # Main App component
│   ├── App.css             # App styles
│   ├── index.css           # Global styles + Tailwind
│   └── main.jsx            # App entry point
├── package.json            # Dependencies và scripts
└── README.md              # Tài liệu này
```

## 🛠️ Công nghệ sử dụng

### Core Technologies
- **React 19.2.0** - JavaScript library cho UI
- **React DOM 19.2.0** - React renderer
- **React Router Dom 7.9.6** - Client-side routing
- **React Redux 9.2.0** - State management

### Development Tools
- **React Scripts 5.0.1** - Build tools và development server
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Testing Library** - Testing utilities

### Key Features
- ⚡ **Hot Reload** - Tự động reload khi code thay đổi
- 🎨 **Tailwind CSS** - Modern styling với utility classes
- 🧪 **Testing Ready** - Configured với Jest và Testing Library
- 📱 **Responsive Design** - Mobile-first approach
- 🔄 **State Management** - Redux cho global state
- 🛣️ **Routing** - SPA với React Router

## 📜 Scripts có sẵn

### `npm start`
- Chạy app ở development mode
- Mở [http://localhost:3000](http://localhost:3000)
- Hot reload enabled
- Hiển thị lint errors trong console

### `npm test`
- Chạy test runner ở interactive mode
- Tự động chạy lại khi file thay đổi
- Coverage reports có sẵn

### `npm run build`
- Build app cho production vào thư mục `build/`
- Optimized và minified
- Filenames bao gồm content hashes
- Sẵn sàng deploy

### `npm run eject`
- ⚠️ **Không thể undo!**
- Expose tất cả configuration files
- Full control over webpack, Babel, ESLint, etc.

## 🚢 Triển khai

### Build cho Production
```bash
# 1. Build ứng dụng
npm run build

# 2. Test build locally
npm install -g serve
serve -s build

# 3. Deploy build/ folder lên hosting platform
```

### Hosting Options
- **Netlify** - Drag & drop build folder
- **Vercel** - Connect GitHub repo
- **GitHub Pages** - Static hosting
- **Firebase Hosting** - Google's platform

## 🔧 Troubleshooting

### Lỗi thường gặp

#### `Could not find a required file. Name: index.js`
```bash
# Đảm bảo có file src/index.js hoặc src/main.jsx
# Project này sử dụng main.jsx làm entry point
```

#### `Module not found`
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

#### `Port 3000 is already in use`
```bash
# Sử dụng port khác
PORT=3001 npm start

# Hoặc kill process đang dùng port 3000
npx kill-port 3000
```

#### Tailwind CSS không hoạt động
```bash
# Đảm bảo Tailwind được import trong src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Performance Issues
```bash
# Analyze bundle size
npm run build
npx source-map-explorer build/static/js/*.js
```

### Development Tips
```bash
# Clear cache nếu có vấn đề
npm start -- --reset-cache

# Debug với React DevTools
# Cài extension: React Developer Tools
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Mở Pull Request

## 📞 Liên hệ

- **Repository**: [BTL_CNPM](https://github.com/nghiem2705/BTL_CNPM)
- **Issues**: [GitHub Issues](https://github.com/nghiem2705/BTL_CNPM/issues)

---

## 📚 Tài liệu tham khảo

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
