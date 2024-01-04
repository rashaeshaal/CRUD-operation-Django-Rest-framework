import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserLogin } from "../redux/features/reducer/UserAuthSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./UserLoginPage.css";

const UserLoginPage = () => {
  const loading = useSelector((s) => s.user?.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(UserLogin(credentials));

      if (response.error) {
        throw new Error("Invalid credentials");
      }

      // Display success message
      Swal.fire({
        icon: "success",
        title: "Successfully logged in",
        showConfirmButton: false,
        timer: 1500,
      });

      // Navigate to another page
      navigate("/");
    } catch (error) {
      console.error(error);

      // Display error message
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Please check your credentials and try again.",
      });
    }
  };

  return (
    <div className="container mt-5 mx-auto px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-center font-bold text-2xl mb-4">Sign In</h1>
        <p className="text-center text-gray-500 mb-8">Sign into your account</p>

        <form onSubmit={handleOnSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              className="input-field"
              value={credentials.email}
              onChange={(e) => setCredentials((s) => ({ ...s, email: e.target.value }))}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="input-field"
              value={credentials.password}
              onChange={(e) => setCredentials((s) => ({ ...s, password: e.target.value }))}
            />
          </div>

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
 