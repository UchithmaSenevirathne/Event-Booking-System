import React, { useState } from "react";
import { Button, Modal, Input, DatePicker, InputNumber, Upload, Form, Typography, Image } from "antd";
import { toast } from "react-toastify";
import type { RcFile } from "antd/es/upload/interface";
import axios from "axios";
import { CalendarOutlined } from "@ant-design/icons";
import imageCompression from "browser-image-compression";

const { Title } = Typography;

interface AdminHeaderProps {
  onEventCreated: () => void;
}

export default function AdminHeader({ onEventCreated }: AdminHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: null as any,
    location: "",
    price: 0,
    availableTickets: 0,
    imageBase64: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageUpload = async (file: RcFile): Promise<boolean> => {
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    if (file.size && file.size > maxFileSize) {
      toast.error("File size exceeds the maximum limit of 10 MB.");
      return false;
    }
  
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFormData({ ...formData, imageBase64: reader.result.toString() });
          setImagePreview(reader.result.toString());
        }
      };
      reader.readAsDataURL(compressedFile);
      
    } catch (error) {
      toast.error("Error compressing image");
      console.error(error);
    }
    
    return false; // Prevent default upload behavior
  };

  


  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.location || !formData.price || !formData.availableTickets || !formData.imageBase64) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("date", formData.date?.toISOString());
    form.append("location", formData.location);
    form.append("price", formData.price.toString());
    form.append("availableTickets", formData.availableTickets.toString());
    form.append("imageBase64", formData.imageBase64);

    try {
      await axios.post("http://localhost:8080/events/backend/event", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Event created successfully!");
      onEventCreated();
       // Reset form data
    setFormData({
      title: "",
      date: null,
      location: "",
      price: 0,
      availableTickets: 0,
      imageBase64: "",
    });
    setImagePreview("");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to create event.");
    }
  };

  return (
    <div className="mx-5 mt-4">
  <div className="flex flex-col justify-between p-4 mb-4 bg-white border shadow-sm md:flex-row md:items-center gap-y-4 rounded-2xl">
    <div className="flex-1">
      <h2 className="text-xl font-bold">
        {new Date().toLocaleString("default", { month: "long" })}
      </h2>
      <p className="text-gray-500">
        Today is{" "}
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>

    <div className="flex flex-col items-start flex-1 gap-2 sm:flex-row sm:items-center">
      <h1 className="text-[23px] font-semibold">Board</h1>
      <span className="text-[19px] font-medium text-gray-700">-</span>
      <h4 className="text-[19px] font-medium text-gray-700">Popular Events</h4>
    </div>

    <div className="flex flex-col items-center w-full gap-3 sm:flex-row sm:w-auto">
      <Button
        className="w-full py-5 text-white bg-black sm:w-auto hover:bg-gray-800"
        onClick={() => setIsModalOpen(true)}
      >
        Create Event
      </Button>
      <Button
  className="flex items-center justify-center w-full h-10 text-black bg-white border border-gray-300 sm:w-12 sm:h-12 hover:bg-gray-100"
  onClick={() => toast.info("Calendar Coming Soon!")}
  icon={<CalendarOutlined style={{ fontSize: "18px" }} />}
/>

    </div>
  </div>

      {/* Create Event Modal */}
      <Modal
        title="Create New Event"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText="Create"
        width={600}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }} 
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Event Title"
            name="title"
            rules={[{ required: true, message: "Please enter event title!" }]}
          >
            <Input
              placeholder="Enter event title"
              className="mb-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </Form.Item>

          <Form.Item
            label="Event Date"
            name="date"
            rules={[{ required: true, message: "Please select event date!" }]}
          >
            <DatePicker
              className="w-full mb-2"
              showTime
              placeholder="Select date and time"
              onChange={(date) => setFormData({ ...formData, date: date })}
            />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please enter event location!" }]}
          >
            <Input
              placeholder="Enter event location"
              className="mb-2"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter event price!" }, { type: "number", min: 0, message: "Price must be a positive number!" }]}
          >
            <InputNumber
              className="w-full mb-2"
              placeholder="Enter event price"
              value={formData.price}
              onChange={(value) => setFormData({ ...formData, price: value || 0 })}
            />
          </Form.Item>

          <Form.Item
            label="Available Tickets"
            name="availableTickets"
            rules={[{ required: true, message: "Please enter number of available tickets!" }, { type: "number", min: 1, message: "Must be at least 1 ticket!" }]}
          >
            <InputNumber
              className="w-full mb-2"
              placeholder="Enter number of available tickets"
              value={formData.availableTickets}
              onChange={(value) => setFormData({ ...formData, availableTickets: value || 0 })}
            />
          </Form.Item>

          <Form.Item
            label="Event Image"
            name="imageBase64"
            rules={[{ required: true, message: "Please upload an event image!" }]}
          >
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button className="w-full">Upload Event Image</Button>
            </Upload>
          </Form.Item>

          {/* Image Preview */}
          {imagePreview && (
            <Form.Item label="Image Preview">
              <Image
                src={imagePreview}
                alt="Event Image Preview"
                width={100}
                height={100}
                style={{ objectFit: "cover" }}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
