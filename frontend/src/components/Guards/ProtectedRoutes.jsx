import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { resetCredentials } from "../../features/authenticate/authSlice";
import { useGetUserDetailsQuery } from "../../features/api/apiSlices/userApiSlice";

const ProtectedRoutes = () => {
  const currentUser = useSelector((state) => state.auth?.user);
  const dispatch = useDispatch();

  const {
    isFetching,
    error,
    isError,
  } = useGetUserDetailsQuery(undefined, {
    skip: !currentUser,
  });

  useEffect(() => {
    if (isError && error?.status === 401) {
      dispatch(resetCredentials());
    }
  }, [dispatch, error, isError]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (isFetching) {
    return null;
  }

  if (isError && error?.status === 401) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
