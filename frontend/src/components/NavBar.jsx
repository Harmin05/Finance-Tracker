import React from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import logo from "/logo.webp";
import { Register, Login, Logout, Dashboard } from "../utils/Icons";
import { useLogoutMutation } from "../features/api/apiSlices/userApiSlice";
import { resetCredentials } from "../features/authenticate/authSlice";
import { updateLoader } from "../features/loader/loaderSlice";
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.user);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      dispatch(updateLoader(40));
      const res = await logout().unwrap();
      await dispatch(resetCredentials());
      dispatch(updateLoader(60));
      toast.success(res.message || "Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  return (
    <header className="w-full h-[10vh] px-6 sm:px-8 md:px-12 flex justify-between items-center border-b-1 border-gray-300 z-[999]">
      <div className="flex items-center gap-x-3">
        <img
          src={logo}
          alt="spend smart logo"
          className="w-[2rem] md:w-[3rem]"
        />
        <h1
          className="text-xl sm:text-2xl md:text-3xl uppercase cursor-pointer"
          onClick={() => navigate("/")}
        >
          Finance{" "}
          <span className="text-primary text-base sm:text-xl md:text-2xl">
            Tracker
          </span>
        </h1>
      </div>
      <div className="hidden min-[460px]:flex items-center space-x-2 sm:space-x-4">
        {currentUser ? (
          <>
            <Button
              color="primary"
              className="text-base md:text-lg w-[9rem] sm:w-[10rem]"
              startContent={<Dashboard />}
              onPress={() => navigate("/dashboard")}
              radius="sm"
            >
              Dashboard
            </Button>
            <Button
              color="danger"
              variant="bordered"
              className="text-base md:text-lg w-[7rem] sm:w-[8rem]"
              startContent={<Logout />}
              onPress={handleLogout}
              isLoading={isLoading}
              radius="sm"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              color="primary"
              className="text-base md:text-lg w-[7rem] sm:w-[8rem]"
              startContent={<Register />}
              onPress={() => navigate("/register")}
              radius="sm"
            >
              Register
            </Button>
            <Button
              color="primary"
              variant="bordered"
              className="text-base md:text-lg w-[7rem] sm:w-[8rem]"
              startContent={<Login />}
              onPress={() => navigate("/login")}
              radius="sm"
            >
              Login
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
