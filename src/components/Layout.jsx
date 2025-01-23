import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./sidebar"



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