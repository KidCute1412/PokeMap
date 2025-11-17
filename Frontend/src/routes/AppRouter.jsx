import {createBrowserRouter} from "react-router-dom";
import MainLayout from "@/layouts/MainLayout.jsx";
import HomePage from "@/pages/HomePage.jsx";

const routers = createBrowserRouter([
    {
        path : "/",
        element: <MainLayout></MainLayout>,
        children : [
            {
                path: "/",
                element: <HomePage></HomePage>
            }
        ]
    }

]);

export default routers;