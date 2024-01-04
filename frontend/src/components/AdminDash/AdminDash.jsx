// AdminDash.jsx

import React from "react";
import  UserTable  from "../UserTable/UserTable";
import AdminSidebar from "./AdminSidebar"; // Adjust the path as needed

const AdminDash = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="w-full overflow-y-auto p-8">
        <UserTable />
      </div>
    </div>
  );
};

export default AdminDash;
