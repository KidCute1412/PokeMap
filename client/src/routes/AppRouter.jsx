import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout.jsx";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import HomePage from "@/pages/client/HomePage.jsx";
import ProfilePage from "@/pages/client/Profile/ProfilePage.jsx";
import MapPage from "@/pages/client/MapPage.jsx";
import PokedexPage from "@/pages/client/PokedexPage";
import PokeDetail from "@/pages/client/PokeDetail";
import LoginPage from "@/pages/auth/LoginPage.jsx";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashBoardPage from "@/pages/admin/DashboardPage.jsx";
import UserAdminPage from "@/pages/admin/users/UserAdminPage.jsx";
import PostAdminPage from "@/pages/admin/posts/PostAdminPage.jsx";
import ProtectedRouter from "@/routes/ProtectedRouter.jsx";
import EditProfile from "@/pages/client/Profile/components/EditProfile";
import ChangePassword from "@/pages/client/Profile/components/ChangePassword";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRouter>
            <MainLayout></MainLayout>
        </ProtectedRouter>,
        children: [
            {
                path: "",
                element: <HomePage></HomePage>,

            },
            {
                path: "pokemap",
                element: <MapPage></MapPage>
            },
            {
                path: "pokedex",
                element: <PokedexPage></PokedexPage>
            },
            {
                path: "pokedex/detail",
                element: <PokeDetail></PokeDetail>
            },
            {
                path: "profile/:username_id",
                element: <ProfilePage></ProfilePage>
            },
            {
                path: "profile/edit/",
                element: <EditProfile></EditProfile>
            },
            {
                path: "profile/change-password",
                element: <ChangePassword></ChangePassword>
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
        path: "/admin",
        element: <ProtectedRouter>
                    <AdminLayout></AdminLayout>
                </ProtectedRouter>,
        children: [
            {
                path: "",
                element: <DashBoardPage></DashBoardPage>
            },
            {
                path: "users",
                element: <UserAdminPage></UserAdminPage>
            },
            {
                path: "posts",
                element: <PostAdminPage></PostAdminPage>
            }
        ]
    }

]);

export default routers;