import Session from '../pages/Session/index';
// import Login from '../pages/Login';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/index';

// Định nghĩa các route công khai
const publicRoutes = [
    // { path: '/tutor/sessions/', component: Session },
    // { path: '/tutor', component: Home},
    // { path: '/student', component: Home},
    { path: '/', component: Login}
    // Sau này có Login hay NotFound thì thêm vào đây
];

export { publicRoutes };
