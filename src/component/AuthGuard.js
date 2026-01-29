import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/context/Auth";

export default function AuthGuard(props) {
  const { children } = props;
  const auth = useContext(AuthContext);
  if (!auth.userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
