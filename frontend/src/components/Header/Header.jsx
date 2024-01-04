import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/reducer/UserAuthSlice";

export const Header = () => {
  const state = useSelector((state) => state);
  const access = state.user?.data?.access;
  const userName = state.user?.data?.user?.name;

  console.log("User Data in State:", state.user);

  const dispatch = useDispatch();

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-light mt-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="nav-items">
            <ul className="flex pt-4">
              <li className="px-8">
                <Link to="/">Home</Link>
              </li>

              <li className="px-8">
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center">
          {access ? (
            <>
              <span className="mr-2 mt-2"></span>
              <button
                onClick={() => dispatch(logout())}
                className="mr-2 mt-2 px-4 py-2 rounded text-black"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="mr-2 mt-2 px-4 py-2 rounded text-black"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
