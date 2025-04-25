import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Spin, Modal, Input, InputNumber, DatePicker, Upload, Empty } from "antd";
import { EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
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
  onUpdate: () => void;
  onDelete: () => void;
}

export default function AdminEvents({ events: initialEvents, onUpdate, onDelete }: AdminEventsProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const API = "http://localhost:8080/events/backend/event";

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/all_events`);
      // Log the first event's image data for debugging
      if (response.data.length > 0) {
        console.log("First event image data prefix:", 
          response.data[0].imageBase64.substring(0, 50) + "...");
      }
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

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
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const base64String = e.target.result.toString();
          // Store just the base64 data without the prefix
          const base64Data = base64String.split(',')[1];
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
      
      // Make sure date is in ISO format for the backend
      const dateValue = typeof editingEvent.date === 'string' 
        ? editingEvent.date 
        : dayjs(editingEvent.date).toISOString();
      formData.append("date", dateValue);
      
      formData.append("location", editingEvent.location);
      formData.append("price", editingEvent.price.toString());
      formData.append("availableTickets", editingEvent.availableTickets.toString());
      
      // Ensure we're only sending the base64 data without prefix
      const imageData = editingEvent.imageBase64.includes('base64,') 
        ? editingEvent.imageBase64.split('base64,')[1] 
        : editingEvent.imageBase64;
      formData.append("imageBase64", imageData);

      await axios.put(`${API}/update/${editingEvent.eventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Event updated successfully");
      setIsModalOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  // Helper function to render image with proper base64 format
  const renderImage = (imageData: string) => {
    // Check if the image data already has the data URI prefix
    if (imageData.startsWith('data:')) {
      return imageData;
    }
    
    // Check if the data contains the base64 prefix already
    if (imageData.includes('base64,')) {
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
            <div key={event.eventId} className="p-4 bg-white border shadow-md rounded-2xl">
              <div className="w-full h-48 mb-3 overflow-hidden bg-gray-100 rounded-xl">
                <img
                  src={renderImage(event.imageBase64)}
                  alt={event.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    console.error("Image load error for event:", event.eventId);
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x200?text=Image+Error";
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.location}</p>
              <p className="mt-1 text-sm text-gray-700">🎫 {event.availableTickets} Tickets</p>
              <p className="text-sm text-gray-700">📅 {new Date(event.date).toLocaleString()}</p>
              <p className="font-medium text-gray-800">💰 ${Number(event.price).toFixed(2)}</p>
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
            <label className="block mb-1 text-sm font-medium">Event Title</label>
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
            <label className="block mb-1 text-sm font-medium">Available Tickets</label>
            <InputNumber
              value={editingEvent?.availableTickets}
              onChange={(value) => handleEditChange("availableTickets", value || 0)}
              placeholder="Tickets"
              min={0}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Event Date & Time</label>
            <DatePicker
              value={editingEvent?.date ? dayjs(editingEvent.date) : undefined}
              onChange={(date) => handleEditChange("date", date?.toISOString())}
              showTime
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Event Image</label>
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