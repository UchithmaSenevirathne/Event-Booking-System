// Define proper TypeScript interfaces
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AdminHeader from "./admin_dashboard/admin_header";
import AdminEvents from "./admin_dashboard/admin_events";
import UserHeader from "./user_dashboard/user_header";
import UserEvents from "./user_dashboard/user_events";
import { useUserContext } from "../../components/UserContext";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";


// Define interfaces for better type checking
interface Event {
  eventId: number;
  title: string;
  date: string;
  location: string;
  price: number;
  availableTickets: number;
  imageBase64: string;
}

interface FilterOptions {
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  priceRange?: [number, number] | null;
}

export default function Dashboard() {
  const location = useLocation();
  const { user } = useUserContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const API = "http://localhost:8080/events/backend/event";

  useEffect(() => {
    if (location.state && location.state.openBooking && location.state.selectedEvent) {
      setSelectedEvent(location.state.selectedEvent);
      setOpenBookingModal(true);
    }
  }, [location]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/all_events`);
      console.log("Events data received:", response.data);
      setEvents(response.data);
      setFilteredEvents(response.data);
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

  // Filter events when activeFilters change or when events are updated
  useEffect(() => {
    if (!activeFilters) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event: Event) => {
      let passesDateFilter = true;
      let passesPriceFilter = true;

      // Apply date filter if set
      if (activeFilters.dateRange && activeFilters.dateRange[0] && activeFilters.dateRange[1]) {
        const eventDate = dayjs(event.date);
        const startDate = activeFilters.dateRange[0];
        const endDate = activeFilters.dateRange[1];
        
        passesDateFilter = eventDate.isAfter(startDate) && eventDate.isBefore(endDate);
      }

      // Apply price filter if set
      if (activeFilters.priceRange) {
        const [minPrice, maxPrice] = activeFilters.priceRange;
        passesPriceFilter = event.price >= minPrice && event.price <= maxPrice;
      }

      return passesDateFilter && passesPriceFilter;
    });

    setFilteredEvents(filtered);
  }, [activeFilters, events]);

  const handleFilterChange = (filters: FilterOptions | null) => {
    setActiveFilters(filters);
  };

  return (
    <div>
      {user.role === "ADMIN" ? (
        <>
          <AdminHeader 
            onEventCreated={fetchEvents} 
            onFilterChange={handleFilterChange}
          />
          <AdminEvents
            events={filteredEvents}
            loading={loading}
            onUpdate={fetchEvents}
            onDelete={fetchEvents}
          />
        </>
      ) : (
        <>
          <UserHeader onFilterChange={handleFilterChange}/>
          <UserEvents events={filteredEvents}
            loading={loading}
            selectedEvent={selectedEvent}
            openBookingModal={openBookingModal}
            fetchEvents={fetchEvents}
            />
        </>
      )}
    </div>
  );
}