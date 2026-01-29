import React from "react";
import { useNavigate } from "react-router-dom";
const Logo = (props) => {
  const history = useNavigate();
  return (
    <img
      src="/images/logo.svg"
      alt="Logo"
      {...props}
      onClick={() => {
        history("/dashboard");
      }}
    />
  );
};

export default Logo;
