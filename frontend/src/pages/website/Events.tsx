import React, { useState, useEffect } from "react";
import { Spin, Empty, Button } from "antd";
import axios from "axios";
import { CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../components/UserContext";

// Event type
interface Event {
  eventId: number;
  title: string;
  date: string;
  location: string;
  price: number;
  availableTickets: number;
  imageBase64: string;
}

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setUser } = useUserContext();
  const { user } = useUserContext();

  const API = "http://localhost:8080/events/backend/event/all_events";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<Event[]>(API);
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderImage = (imageData: string) => {
    if (imageData.startsWith("data:")) return imageData;
    if (imageData.includes("base64,")) return imageData;
    return `data:image/jpeg;base64,${imageData}`;
  };

  const handleBookNow = (event: Event) => {
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");

    if (email) {
      // const storedUser = { email, role };
      setUser({ role: role ?? 'USER' });

      localStorage.setItem("selectedEvent", JSON.stringify(event));
      navigate("/layout", {
        state: { openBooking: true, selectedEvent: event },
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="mx-5 mt-8" id="events">
      <h1 className="mb-6 text-2xl font-bold text-center">Upcoming Events</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : events.length === 0 ? (
        <Empty description="No events available" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.eventId}
              className="p-4 transition bg-white border shadow-md rounded-2xl hover:shadow-lg"
            >
              <div className="w-full h-48 mb-3 overflow-hidden bg-gray-100 rounded-xl">
                <img
                  src={renderImage(event.imageBase64)}
                  alt={event.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/400x200?text=Image+Error";
                  }}
                />
              </div>

              <h3 className="mb-2 text-lg font-semibold">{event.title}</h3>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-700">
                    <CalendarOutlined className="mr-1 text-red-700" />
                    {new Date(event.date).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-semibold text-green-600">
                    ${Number(event.price).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.availableTickets} Tickets
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  type="default"
                  className="text-white bg-black"
                  onClick={() => handleBookNow(event)}
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
