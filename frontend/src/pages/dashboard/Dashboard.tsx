import React from "react";
import { useOutletContext } from "react-router-dom";
import AdminHeader from "./admin_dashboard/admin_header";
import AdminEvents from "./admin_dashboard/admin_events";
import UserHeader from "./user_dashboard/user_header";
import UserEvents from "./user_dashboard/user_events";
import { useUserContext } from "../../components/UserContext";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const { user } = useUserContext();
  const [events, setEvents] = useState([]);
  const API = "http://localhost:8080/events/backend/event";

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/all_events`);
      setEvents(response.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      {user.role === "ADMIN" ? (
        <>
          <AdminHeader onEventCreated={fetchEvents} />
          <AdminEvents
            events={events}
            onUpdate={fetchEvents}
            onDelete={fetchEvents}
          />
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
