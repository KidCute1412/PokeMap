import {createBrowserRouter} from "react-router-dom";
import MainLayout from "@/layouts/MainLayout.jsx";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import HomePage from "@/pages/client/HomePage.jsx";
import ProfilePage from "@/pages/client/ProfilePage.jsx";
import LoginPage from "@/pages/auth/LoginPage.jsx";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashBoardPage from "@/pages/admin/DashboardPage.jsx";
import UserAdminPage from "@/pages/admin/users/UserAdminPage.jsx";
import PostAdminPage from "@/pages/admin/posts/PostAdminPage.jsx";
const routers = createBrowserRouter([
    {
        path : "/",
        element: <MainLayout></MainLayout>,
        children : [
            {
                path: "",
                element: <HomePage></HomePage>,
                
            },
            {
                path: "profile",
                element: <ProfilePage></ProfilePage>
            }
        ]
    },
    {
        path: "/account",
        children: [
            {
                path: "login",
                element: <LoginPage></LoginPage>
            },
            {
                path: "register",
                element: <RegisterPage></RegisterPage>
            }
        ]
    },
    {
        path : "/admin",
        element: <AdminLayout></AdminLayout>,
        children : [
            {
                path: "",
                element: <DashBoardPage></DashBoardPage>
            },
            {
                path: "users",
                element : <UserAdminPage></UserAdminPage>
            },
            {
                path: "posts",
                element : <PostAdminPage></PostAdminPage>
            }
        ]
    }

]);

export default routers;