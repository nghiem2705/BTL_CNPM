// import { useSelector } from "react-redux";
import { Navigate, useRoutes } from "react-router-dom";
import Layout from "../layout";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ConsultationDetail from "../pages/ConsultationDetail";

const Routers = () => {
    // const userData = useSelector(state => state.accountReducer);
    const userData = true;
    const routes = useRoutes([
        {
            path: '/',
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: userData ? <Navigate to="/home" replace /> : <Navigate to={"/login"} />
                },
                {
                    path: '/login',
                    element: <Login />
                },
                {
                    path: '/home',
                    element: <Home />
                },
                {
                    path: '/consultation/:id',
                    element: <ConsultationDetail />
                },
                {
                    path: '*',
                    element: <NotFound />
                },
            ]
        },
    ])
    return routes;
}

export default Routers;