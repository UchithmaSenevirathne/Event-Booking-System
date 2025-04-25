import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AdminHeader from "./admin_dashboard/admin_header";
import AdminEvents from "./admin_dashboard/admin_events";
import UserHeader from "./user_dashboard/user_header";
import UserEvents from "./user_dashboard/user_events";
import { useUserContext } from "../../components/UserContext";

export default function Dashboard() {
  const { user } = useUserContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = "http://localhost:8080/events/backend/event";

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/all_events`);
      console.log("Events data received:", response.data);
      setEvents(response.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
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
            loading={loading}
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