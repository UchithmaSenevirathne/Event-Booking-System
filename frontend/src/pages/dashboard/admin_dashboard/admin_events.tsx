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
  onUpdate: () => void;
  onDelete: () => void;
}

export default function AdminEvents({
  events,
  loading,
  onUpdate,
  onDelete,
}: AdminEventsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const API = "http://localhost:8080/events/backend/event";

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API}/delete/${id}`);
      toast.success("Event deleted successfully");
      onDelete();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    // Make sure to use the correct prefix if it's not already in the data
    setImagePreview(
      event.imageBase64.startsWith("data:")
        ? event.imageBase64
        : `data:image/jpeg;base64,${event.imageBase64}`
    );
    setIsModalOpen(true);
  };

  const handleEditChange = (key: keyof Event, value: any) => {
    if (!editingEvent) return;
    setEditingEvent({ ...editingEvent, [key]: value });
  };

  const handleImageUpload = async (info: any) => {
    const file = info.file.originFileObj;
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const base64String = e.target.result.toString();
          // Store just the base64 data without the prefix
          const base64Data = base64String.split(",")[1];
          handleEditChange("imageBase64", base64Data);
          setImagePreview(base64String);
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error("Error processing image");
    }
  };

  const updateEvent = async () => {
    if (!editingEvent) return;
  
    try {
      const formData = new FormData();
      formData.append("title", editingEvent.title);
  
      // Format the date correctly for ZonedDateTime parsing
      let dateValue;
      if (typeof editingEvent.date === "string") {
        // If it's already an ISO string, use it
        dateValue = editingEvent.date;
  
        // Ensure it has a time zone if it doesn't already
        if (!dateValue.includes('Z') && !dateValue.includes('+')) {
          dateValue = new Date(dateValue).toISOString();
        }
      } else {
        // Convert dayjs to ISO string
        dateValue = dayjs(editingEvent.date).toISOString();
      }
      formData.append("date", dateValue);
  
      formData.append("location", editingEvent.location);
      formData.append("price", editingEvent.price.toString());
      formData.append(
        "availableTickets",
        editingEvent.availableTickets.toString()
      );
  
      // Handle the image data correctly
      let imageData = editingEvent.imageBase64;
      if (imageData.includes("base64,")) {
        imageData = imageData.split("base64,")[1];
      }
      formData.append("imageBase64", imageData);
  
      // Log the data being sent for debugging
      console.log("Updating event ID:", editingEvent.eventId);
      console.log("Date value being sent:", dateValue);
      
      const response = await axios.put(`${API}/update/${editingEvent.eventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Update response:", response);
      toast.success("Event updated successfully");
      setIsModalOpen(false);
      onUpdate();
    } catch (error: any) {
      console.error("Error updating event:", error);
      // More detailed error logging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      toast.error(`Failed to update event: ${error.message}`);
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
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(event)}
                />
                <Popconfirm
                  title="Delete this event?"
                  onConfirm={() => handleDelete(event.eventId)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        open={isModalOpen}
        title="Edit Event"
        onCancel={() => setIsModalOpen(false)}
        onOk={updateEvent}
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Event Title
            </label>
            <Input
              value={editingEvent?.title}
              onChange={(e) => handleEditChange("title", e.target.value)}
              placeholder="Title"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Location</label>
            <Input
              value={editingEvent?.location}
              onChange={(e) => handleEditChange("location", e.target.value)}
              placeholder="Location"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Price ($)</label>
            <InputNumber
              value={editingEvent?.price}
              onChange={(value) => handleEditChange("price", value || 0)}
              placeholder="Price"
              min={0}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Available Tickets
            </label>
            <InputNumber
              value={editingEvent?.availableTickets}
              onChange={(value) =>
                handleEditChange("availableTickets", value || 0)
              }
              placeholder="Tickets"
              min={0}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Event Date & Time
            </label>
            <DatePicker
              value={editingEvent?.date ? dayjs(editingEvent.date) : undefined}
              onChange={(date) => handleEditChange("date", date?.toISOString())}
              showTime
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Event Image
            </label>
            <Upload
              beforeUpload={() => false}
              onChange={handleImageUpload}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Change Image</Button>
            </Upload>

            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-32 mt-2 rounded"
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}