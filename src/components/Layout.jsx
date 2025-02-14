import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"

/**
 * @description Layout component
 * 
 * @returns {JSX.Element}
 */

const Layout = () => {
    return (
        <>
            <Header />
            <div className="page-container">
                <Sidebar />
                <main className="wrapper">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default Layout;