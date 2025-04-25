import React, { useState, useEffect } from "react";
import {
  Button,
  Popconfirm,
  Spin,
  Modal,
  Input,
  InputNumber,
  DatePicker,
  Upload,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  CalendarOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";
import imageCompression from "browser-image-compression";

// Define Event type
interface Event {
  eventId: number;
  title: string;
  date: string;
  location: string;
  price: number;
  availableTickets: number;
  imageBase64: string;
}

interface AdminEventsProps {
  events: Event[];
  loading: boolean;
}

export default function UserEvents({
  events,
  loading,
}: AdminEventsProps) {

  const API = "http://localhost:8080/events/backend";
  const USER_API = "http://localhost:8080/events/backend/user"

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ticketCount, setTicketCount] = useState<number>(1);

  const fetchUserId = async (email: string ): Promise<number> => {
    const response = await axios.get(`${API}/user/id/${email}`);
    return response.data;
  };

  const handleBookNow = (event: Event) => {
    setSelectedEvent(event);
    setTicketCount(1);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  const handleBooking = async () => {
    if (!selectedEvent) return;
  
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
  
      // Fetch user ID by email
      const userResponse = await axios.get(`${USER_API}/id/${email}`);
      const userId = userResponse.data;
  
      const bookingDTO = {
        eventId: selectedEvent.eventId,
        ticketQuantity: ticketCount,
        userId: userId,
        createdAt: new Date().toISOString(), // Add createdAt timestamp
      };
  
      await axios.post(`${API}/book`, bookingDTO);
      toast.success("Booking successful!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Booking failed", error);
      toast.error("Booking failed. Try again later.");
    }
  };
  


  // Helper function to render image with proper base64 format
  const renderImage = (imageData: string) => {
    // Check if the image data already has the data URI prefix
    if (imageData.startsWith("data:")) {
      return imageData;
    }

    // Check if the data contains the base64 prefix already
    if (imageData.includes("base64,")) {
      return imageData;
    }

    // Add the generic image data URI prefix
    return `data:image/jpeg;base64,${imageData}`;
  };

  return (
    <div className="mx-5 mt-4">
      <h2 className="mb-4 text-xl font-bold">Events Management</h2>

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
                    console.error("Image load error for event:", event.eventId);
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
                    <CalendarOutlined className="mr-1 text-red-700" />{" "}
                    {new Date(event.date).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="mt-1 text-sm text-[green]">
                    <BookOutlined className="mr-1" /> {event.availableTickets}{" "}
                    Tickets
                  </p>
                  <p className="font-medium text-gray-800">
                    $
                    {Number(event.price).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button type="default" className="text-white bg-black" onClick={() => handleBookNow(event)}>Book Now</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        title="Book Tickets"
        visible={isModalVisible}
        onOk={handleBooking}
        onCancel={handleModalCancel}
        okText="Confirm Booking"
      >
        {selectedEvent && (
          <div>
            <p><strong>Event:</strong> {selectedEvent.title}</p>
            <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleString()}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Price per ticket:</strong> ${selectedEvent.price.toFixed(2)}</p>
            <p><strong>Available:</strong> {selectedEvent.availableTickets} tickets</p>

            <div className="mt-4">
              <label className="block mb-2 font-medium">Select ticket count (1–5)</label>
              <InputNumber
                min={1}
                max={5}
                value={ticketCount}
                onChange={(value) => setTicketCount(value || 1)}
              />
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}