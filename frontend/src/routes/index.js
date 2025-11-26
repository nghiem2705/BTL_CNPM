import Home from '../pages/Home';

// Định nghĩa các route công khai
const publicRoutes = [
    { path: '/', component: Home },
    // Sau này có Login hay NotFound thì thêm vào đây
];

export { publicRoutes };
