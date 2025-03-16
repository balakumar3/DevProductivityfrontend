import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout({ children }) {
    return (
        <div>
            <Header />
            <div className="p-4">
                {children || <Outlet />}
            </div>
        </div>
    );
}
