import React from "react";
import Header from "./Header";

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className=" bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="">
        {children}
      </main>
    </div>
  );
};

export default Layout;
