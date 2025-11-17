import {Outlet} from "react-router-dom";
import Navbar from "@/components/common/NavBar.jsx";


function MainLayout(){
    return (
        <div>
            <Navbar></Navbar>
            <main>
                <Outlet/>
            </main>
            <footer>
                <p>Main Layout Footer</p>
            </footer>
        </div>
    )
}
export default MainLayout;