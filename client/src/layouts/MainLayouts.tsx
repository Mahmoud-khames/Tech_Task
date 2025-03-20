import { Outlet, useLocation } from "react-router-dom";
import Slider from "./Slider";

export default function MainLayouts() {
  const location = useLocation();
  return (
    <div className="flex  h-screen overflow-hidden">
      <Slider />
      {/* main */}
      <div className="flex-1 overflow-hidden overflow-y-auto">
        <div className="flex-1 bg-white h-24  flex items-center border-b border-gray-500">
          <h2 className="text-2xl  p-3">
            {location.pathname === "/dashboard" ? "Dashboard" : location.pathname === "/users" ? "Users" : location.pathname === "/profile" ? "Profile" : ""}
          </h2>
        </div>
        <div className="flex-1 bg-gray-50 h-screen p-8 ">
            <Outlet/>
        </div>
      </div>
    </div>
  );
}
