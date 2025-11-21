import {createBrowserRouter} from "react-router-dom";
import MainLayout from "@/layouts/MainLayout.jsx";
import HomePage from "@/pages/HomePage.jsx";
import ProfilePage from "@/pages/ProfilePage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import RegisterPage from "@/pages/RegisterPage";
const routers = createBrowserRouter([
    {
        path : "/",
        element: <MainLayout></MainLayout>,
        children : [
            {
                path: "/",
                element: <HomePage></HomePage>,
                
            },
            {
                path: "/profile",
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
    }

]);

export default routers;