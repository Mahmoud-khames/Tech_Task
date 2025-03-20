import { MdOutlineDashboard } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthWrapper";
import { FaUsers } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

export default function Slider() {
  const location = useLocation();
  const { logout , user } = useAuth();
  return (
    <nav className="h-screen w-80 bg-white border border-gray-500">
      {/* header */}
      <h2 className="text-center text-2xl font-bold text-gray-700 h-24 flex items-center justify-center border-b border-gray-500">
      TECH Academy Task
      </h2>

      {/* content */}
      <div className="mt-4 w-full h-full">
        <ul className="flex flex-col px-6 gap-2">
          <Link to={"/dashboard"}>
            <li
              className={`flex items-center gap-2 font-semibold hover:bg-gray-200 ${
                location.pathname === "/dashboard" && "bg-gray-200"
              } hover:shadow-2xl w-full p-2 rounded-md cursor-pointer mb-2`}
            >
              <span className=" text-2xl">
                {" "}
                <MdOutlineDashboard />
              </span>
              <span>Dashboard</span>
            </li>
          </Link>
         { user?.role === "admin" && <Link to={"/users"}>
            <li
              className={`flex items-center gap-2 font-semibold hover:bg-gray-200 ${
                location.pathname === "/users" && "bg-gray-200"
              } hover:shadow-2xl w-full p-2 rounded-md cursor-pointer mb-2`}
            >
              <span className=" text-2xl">
                {" "}
                <FaUsers />
              </span>
              <span>Users</span>
            </li>
          </Link>}
          <Link to={"/profile"}>
            <li
              className={`flex items-center gap-2 font-semibold hover:bg-gray-200 ${
                location.pathname === "/profile" && "bg-gray-200"
              } hover:shadow-2xl w-full p-2 rounded-md cursor-pointer mb-2`}
            >
              <span className=" text-2xl">
                {" "}
                <CgProfile  />
              </span>
              <span>Profile</span>
            </li>
          </Link>
          <button  
           onClick={logout}
          >
            <li className="flex items-center gap-2 font-semibold hover:bg-gray-200 hover:shadow-2xl w-full p-2 rounded-md cursor-pointer">
              <span className=" text-2xl">
                {" "}
                <GoSignOut />
              </span>
              <span>Sign Out</span>
            </li>
          </button>
        </ul>
      </div>
    </nav>
  );
}
