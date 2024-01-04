// AdminSidebar.jsx

import React from "react";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../redux/features/reducer/AdminAuthSlice";

const AdminSidebar = () => {
  const dispatch = useDispatch();

  return (
    <div className="w-1/5 bg-gray-800 text-white p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <ul className="text-sm">
        <li className="mb-2">
          <a href="#" className="text-gray-300 hover:text-white">
            Users
          </a>
        </li>
        <li>
          <a
            href="#"
            className="text-gray-300 hover:text-white"
            onClick={() => {
              dispatch(logoutAdmin());
            }}
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
