import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/",
    withCredentials: true,
})

// const allowUrl = ["/login", "/register"]

// api.interceptors.request.use(config => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     if(userData){
//         const token = userData.token;
//         const expiryTime = userData.expiryTime;
//         const currentPath = location.pathname;
//         if(!allowUrl.includes(currentPath)) {
//             if(!token || new Date(expiryTime) < new Date()){
//                 location.href = "/login";
//                 alert("Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập!!!");
//             } else {
//                 config.headers.Authorization = "Bearer " + token;
//             }
//         }
//     }
//     return config;
// })

export default api;