import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Modal from "../Modal/Modal";
import authAxios from "../../redux/features/api/authApi";
import { registeredUsers } from "../../utils/constants";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  

  const authTokens = JSON.parse(localStorage.getItem("authTokens"));
  const access = authTokens?.access;

  const editedUser = useSelector((state) => state.updateUser?.editedUser);
  const deletedUser = useSelector((state) => state.updateUser?.deletedUser);

  const dispatch = useDispatch();

  useEffect(() => {
    getUsers();
  }, [editedUser, deletedUser]);

  const getUsers = async () => {
    try {
      const response = await authAxios.get(registeredUsers, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };



  
  const handleUserUnblock = async (userId) => {
    console.log("Unblock button clicked for user ID:", userId);
    try {
      // Assuming you have an endpoint like "/unblock-user" that handles unblocking users
      const response = await authAxios.post("/unblock-user", { userId }, {
        headers: { Authorization: `Bearer ${access}` },
      });
  
      // Assuming the server responds with a success message or status
      if (response.data.success) {
        Swal.fire("User Unblocked!", "", "success");
        // Refresh the user list after unblocking
        getUsers();
      } else {
        // Handle the case where unblocking was not successful
        Swal.fire("Failed to unblock user", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      // Handle error scenarios, display an error message, etc.
      Swal.fire("Error", "An error occurred while unblocking the user", "error");
    }
  };
  const handleUserBlock = async (userId) => {
    console.log("Block button clicked for user ID:", userId);
    try {
        const response = await authAxios.post("/api/block-user/" + userId + "/", {}, {
            headers: { Authorization: `Bearer ${access}` },
        });

        console.log(response.data);  // Log the response data

        if (response.data.success) {
            Swal.fire("User Blocked!", "", "success");
            getUsers();
        } else {
            Swal.fire("Failed to block user", response.data.message, "error");
        }
    } catch (error) {
        console.error("Error blocking user:", error);
        Swal.fire("Error", "An error occurred while blocking the user", "error");
    }
};


  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const tableStyle = {
    width: "100%",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    marginTop: "20px",
  };

  const thStyle = {
    padding: "12px",
    borderBottom: "1px solid #ccc",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #ccc",
    textAlign: "left",
  };

  const inputStyle = {
    border: "1px solid #ccc",
    padding: "8px",
  };

  return (
    <div style={{ margin: "auto", width: "80%" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>User List</h1>
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by name"
          style={inputStyle}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user, index) => (
              <tr key={index}>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() =>
                      user.isBlocked
                        ? handleUserUnblock(user.id)
                        : handleUserBlock(user.id)
                    }
                    
                    style={{
                      backgroundColor: user.isBlocked ? "green" : "orange",
                      color: "#fff",
                      padding: "8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {isModalOpen && (
        <Modal
          show={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UserTable;
