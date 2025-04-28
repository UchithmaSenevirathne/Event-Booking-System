import React, { useState, useEffect } from "react";
import { Button, Spin, Modal, InputNumber, Empty } from "antd";
import { CalendarOutlined, BookOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";

interface Event {
  eventId: string;
  title: string;
  date: string;
  location: string;
  price: number;
  availableTickets: number;
  imageBase64: string;
}

interface UserEventsProps {
  events: Event[];
  loading: boolean;
  selectedEvent?: Event | null;
  openBookingModal?: boolean;
  fetchEvents: () => void;
}

export default function UserEvents({
  events,
  loading,
  selectedEvent,
  openBookingModal,
  fetchEvents,
}: UserEventsProps) {
  const API = "http://localhost:8080/events/backend";
  const USER_API = "http://localhost:8080/events/backend/user";

  const [localSelectedEvent, setLocalSelectedEvent] = useState<Event | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ticketCount, setTicketCount] = useState<number>(1);

  useEffect(() => {
    if (openBookingModal && selectedEvent) {
      setLocalSelectedEvent(selectedEvent);
      setTicketCount(1);
      setIsModalVisible(true);
    }
  }, [openBookingModal, selectedEvent]);

  const fetchUserId = async (email: string): Promise<number> => {
    const response = await axios.get(`${USER_API}/id/${email}`);
    return response.data;
  };

  const handleBookNow = (event: Event) => {
    setLocalSelectedEvent(event);
    setTicketCount(1);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setLocalSelectedEvent(null);
  };

  const handleBooking = async () => {
    if (!localSelectedEvent) return;

    if (ticketCount < 1 || ticketCount > 5) {
      toast.error("You can only book between 1 and 5 tickets.");
      return;
    }

    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        toast.error("User not logged in.");
        return;
      }

      const userId = await fetchUserId(email);

      const now = new Date();

      const formattedDate =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        "T" +
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        ":" +
        String(now.getSeconds()).padStart(2, "0");

      const bookingDTO = {
        eventId: localSelectedEvent.eventId,
        ticketQuantity: ticketCount,
        userId: userId,
        createdAt: formattedDate,
      };

      await axios.post(`${API}/book`, bookingDTO);
      toast.success("Booking successful!");
      setIsModalVisible(false);
      fetchEvents();
    } catch (error) {
      console.error("Booking failed", error);
      toast.error("Booking failed. Try again later.");
    }
  };

  const renderImage = (imageData: string) => {
    if (imageData.startsWith("data:")) return imageData;
    if (imageData.includes("base64,")) return imageData;
    return `data:image/jpeg;base64,${imageData}`;
  };

  return (
    <div className="mx-5 mt-4">
      <h2 className="mb-4 text-xl font-bold">Upcoming Events</h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : events.length === 0 ? (
        <Empty description="No events found" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.eventId}
              className="p-4 bg-white border shadow-md rounded-2xl"
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

              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-700">
                    <CalendarOutlined className="mr-1 text-red-700" />
                    {new Date(event.date).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p
                    className={`mt-1 text-sm ${
                      event.availableTickets <= 5
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    <BookOutlined className="mr-1" />
                    {event.availableTickets === 0
                      ? "Sold Out"
                      : `${event.availableTickets} Tickets`}
                  </p>
                  <p className="font-medium text-gray-800">
                    ${Number(event.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <Button
                  type="default"
                  className="text-white bg-black"
                  onClick={() => handleBookNow(event)}
                  disabled={event.availableTickets === 0}
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        title="Book Tickets"
        open={isModalVisible}
        onOk={handleBooking}
        onCancel={handleModalCancel}
        okText="Confirm Booking"
      >
        {localSelectedEvent && (
          <div>
            <p>
              <strong>Event:</strong> {localSelectedEvent.title}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(localSelectedEvent.date).toLocaleString()}
            </p>
            <p>
              <strong>Location:</strong> {localSelectedEvent.location}
            </p>
            <p>
              <strong>Price per ticket:</strong> $
              {localSelectedEvent.price.toFixed(2)}
            </p>
            <p>
              <strong>Available:</strong> {localSelectedEvent.availableTickets}{" "}
              tickets
            </p>

            <div className="mt-4">
              <label className="block mb-2 font-medium">
                Select ticket count (1–5)
              </label>
              <InputNumber
                min={1}
                max={5}
                value={ticketCount}
                onChange={(value) => setTicketCount(value || 1)}
              />
            </div>
            {/* Total Price Section */}
            <div className="mt-4">
              <p className="text-lg font-semibold">
                Total Price: $
                {(ticketCount * localSelectedEvent.price).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
