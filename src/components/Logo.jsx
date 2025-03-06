import React from "react";
import logo from "../assets/logo.webp";

function Logo({ width = "70px" }) {
  return (
    <div className="flex justify-center items-center">
      <img
        src={logo}
        alt="Unishare Logo"
        className="rounded-full shadow-lg object-cover"
        style={{ width, height: width, minWidth: "50px" }}
      />
    </div>
  );
}

export default Logo;
