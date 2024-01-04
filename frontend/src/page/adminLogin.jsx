import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthAdmin } from "../redux/features/reducer/AdminAuthSlice";
import authAxios from "../redux/features/api/authApi";
import { login } from "../utils/constants";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAdminLogin = (e) => {
    e.preventDefault();

    const body = JSON.stringify({
      email: e.target.adminemail.value,
      password: e.target.password.value,
    });

    authAxios
      .post(login, body, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status === 200) {
          const decodedToken = jwtDecode(response?.data?.access);

          if (decodedToken.is_superuser) {
            localStorage.setItem("authTokens", JSON.stringify(response?.data));

            dispatch(
              setAuthAdmin({
                adminAuthToken: JSON.stringify(response?.data),
                admin: jwtDecode(response?.data?.access),
              })
            );

            Swal.fire({
              icon: "success",
              title: "Successfully logged in",
              showConfirmButton: false,
              timer: 1500,
            });

            navigate("/admin");
          }
        }
      })
      .catch((err) => {
        console.log(err);

        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Invalid Credentials",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/admin/login");
      });
  };

  return (
    <div
      style={{
        maxWidth: "600px", // Increase the maximum width
        maxHeight: "500px", // Increase the maximum height
        margin: "auto",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        padding: "30px", // Increase the padding
        justifyContent: "center",
        border: "1px solid #3498db",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ecf0f1",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#2c3e50" }}>Admin Login</h2>
      <br />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <form onSubmit={handleAdminLogin}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              name="adminemail"
              style={{
                marginBottom: "15px",
                padding: "15px", // Increase the input padding
                fontSize: "16px", // Increase the font size
                border: "3px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
              placeholder="Email"
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="password"
              name="password"
              style={{
                padding: "15px", // Increase the input padding
                fontSize: "16px", // Increase the font size
                border: "3px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#333",
              color: "#fff",
              padding: "15px 20px", // Increase the button padding
              fontSize: "18px", // Increase the font size
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
