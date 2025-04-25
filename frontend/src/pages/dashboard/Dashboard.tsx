import React from "react";
import { useOutletContext } from "react-router-dom";
import AdminHeader from "./admin_dashboard/admin_header";
import AdminEvents from "./admin_dashboard/admin_events";
import UserHeader from "./user_dashboard/user_header";
import UserEvents from "./user_dashboard/user_events";
import { useUserContext } from "../../components/UserContext";

export default function Dashboard() {
    const { user } = useUserContext();

  return (
    <div>
      {user.role === "ADMIN" ? (
        <>
          <AdminHeader />
          <AdminEvents />
        </>
      ) : (
        <>
          <UserHeader />
          <UserEvents />
        </>
      )}
    </div>
  );
}
