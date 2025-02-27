import React from 'react';
import logo from '../assets/logo.webp';

function Logo({ width = '100px' }) {
  return (
    <div className="flex justify-center items-center m-4">
      <img
        src={logo}
        alt="logo"
        className="rounded-full shadow-lg object-cover"
        style={{ width, height:width }}
      />
    </div>
  );
}

export default Logo;
