// import { useSelector } from "react-redux";
import { Navigate, useRoutes } from "react-router-dom";
import TutorLayout from "../layout/tutor";
import TutorConsultation from "../pages/tutor/Consultation";
import TutorConsultationCreate from "../pages/tutor/ConsultationCreate";
import TutorConsultationDetail from "../pages/tutor/ConsultationDetail";
import TutorHome from "../pages/tutor/Home";
import StudentHome from "../pages/student/Home";
import StudentConsultation from "../pages/student/Consultation";
// import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import StudentLayout from "../layout/student";
import ConsultationRegister from "../pages/student/ConsultationRegister";
import StudentConsultationDetail from "../pages/student/ConsultationDetail";

const Routers = () => {
    // const userData = useSelector(state => state.accountReducer);
    const userData = true;
    const routes = useRoutes([
        {
            path: '/',
            element: <Navigate to="/student" replace />
        },
        {
            path: '/tutor',
            element: <TutorLayout />,
            children: [
                {
                    index: true,
                    // element: userData ? <Navigate to="/home" replace /> : <Navigate to={"/login"} />
                    element: <Navigate to="/tutor/home" replace />
                },
                // {
                //     path: '/tutor/login',
                //     element: <Login />
                // },
                {
                    path: '/tutor/home',
                    element: <TutorHome />
                },
                {
                    path: '/tutor/consultation',
                    element: <TutorConsultation />
                },
                {
                    path: '/tutor/consultation/:id',
                    element: <TutorConsultationDetail />
                },
                {
                    path: '/tutor/consultation/create',
                    element: <TutorConsultationCreate />
                },
                {
                    path: '*',
                    element: <NotFound />
                },
            ]
        },
        {
            path: '/student',
            element: <StudentLayout />,
            children: [
                {
                    index: true,
                    element: <Navigate to="/student/home" replace />
                },
                {
                    path: '/student/home',
                    element: <StudentHome />
                },
                {
                    path: '/student/register',
                    element: <ConsultationRegister />
                },
                {
                    path: '/student/consultation',
                    element: <StudentConsultation />
                },
                {
                    path: '/student/consultation/:id',
                    element: <StudentConsultationDetail />
                },
                {
                    path: '*',
                    element: <NotFound />
                },
            ]
        },
        {
            path: '*',
            element: <NotFound />
        },
    ])
    return routes;
}

export default Routers;