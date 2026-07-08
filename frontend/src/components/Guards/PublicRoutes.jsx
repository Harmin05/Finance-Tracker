import React from "react";
import { useSelector } from "react-redux";
import { NotFound } from "../../pages";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";

const PublicRoutes = () => {
  const currentUser = useSelector((state) => state.auth?.user);

  return currentUser ? (
    <NotFound />
  ) : (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default PublicRoutes;
