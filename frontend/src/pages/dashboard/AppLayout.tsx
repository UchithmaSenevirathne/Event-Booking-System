import React from "react";
import NavigationBar from "./NavigationBar";
import { Outlet } from "react-router-dom";
import { useUserContext } from "../../components/UserContext";

export default function AppLayout() {
  const { user } = useUserContext();

  return (
    <div>
      <NavigationBar role={user.role} />
      <Outlet />
    </div>
  );
}
