import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  DatePicker,
  Card,
  InputNumber,
  Upload,
  Form,
  Typography,
  Image,
} from "antd";
import { toast } from "react-toastify";
import type { RcFile } from "antd/es/upload/interface";
import axios from "axios";
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import imageCompression from "browser-image-compression";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

const { Title } = Typography;
const { RangePicker } = DatePicker;

// Define type for filter options
interface FilterOptions {
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  priceRange?: [number, number] | null;
}

interface EventData {
  title?: string;
  start: string;
  id: string;
  display?: string;
  backgroundColor?: string;
  classNames?: string[];
  extendedProps?: {
    location: string;
    price: number;
    availableTickets: number;
    imageUrl?: string;
  };
}

interface AdminHeaderProps {
  onEventCreated: () => void;
  onFilterChange: (filters: FilterOptions | null) => void;
}

export default function AdminHeader({
  onEventCreated,
  onFilterChange,
}: AdminHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] =
    useState<boolean>(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    date: null as dayjs.Dayjs | null,
    location: "",
    price: 0,
    availableTickets: 0,
    imageBase64: "",
  });

  const [filterData, setFilterData] = useState<FilterOptions>({
    dateRange: null,
    priceRange: [0, 1000],
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Add custom CSS for calendar
  useEffect(() => {
    // Create a style element
    const styleEl = document.createElement("style");
    // Define the CSS content
    styleEl.innerHTML = `
      .has-event {
        background-color: rgba(55, 136, 216, 0.1);
        font-weight: bold;
      }
      .fc-event {
        cursor: pointer;
        border-radius: 4px;
        padding: 2px;
      }
      .event-highlight {
        cursor: pointer;
      }
    `;
    // Append the style element to the document head
    document.head.appendChild(styleEl);

    // Cleanup function to remove the style element when component unmounts
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/events/backend/event"
      );
      const formattedEvents: EventData[] = [];

      response.data.forEach((event: any) => {
        // Regular event with details
        formattedEvents.push({
          title: event.title,
          start: event.date,
          id: String(event.id),
          extendedProps: {
            location: event.location,
            price: event.price,
            availableTickets: event.availableTickets,
            imageUrl: event.imageUrl || "",
          },
        });

        // Background highlight for the same event
        formattedEvents.push({
          start: event.date,
          id: `bg-${event.id}`,
          display: "background",
          backgroundColor: "rgba(55, 136, 216, 0.3)",
          classNames: ["event-highlight"],
        });
      });

      setEvents(formattedEvents);
      toast.success("Events loaded successfully");
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const openCalendarModal = () => {
    setIsCalendarModalOpen(true);
  };

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
        useWebWorker: true,
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
    if (
      !formData.title ||
      !formData.date ||
      !formData.location ||
      !formData.price ||
      !formData.availableTickets ||
      !formData.imageBase64
    ) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("date", formData.date?.toISOString() || "");
    form.append("location", formData.location);
    form.append("price", formData.price.toString());
    form.append("availableTickets", formData.availableTickets.toString());
    form.append("imageBase64", formData.imageBase64);

    try {
      await axios.post("http://localhost:8080/events/backend/event", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Event created successfully!");
      fetchEvents(); // Refresh events after creating a new one
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

  const handleFilterApply = () => {
    // Apply the filters
    onFilterChange({
      dateRange: filterData.dateRange,
      priceRange: filterData.priceRange,
    });
    setIsFilterModalOpen(false);
    toast.info("Filters applied");
  };

  const handleFilterClear = () => {
    // Clear all filters
    setFilterData({
      dateRange: null,
      priceRange: [0, 1000],
    });
    onFilterChange(null);
    setIsFilterModalOpen(false);
    toast.info("Filters cleared");
  };

  // Handle event click in calendar
  const handleEventClick = (info: any) => {
    // Only show info for regular events, not background events
    if (!info.event.id.startsWith("bg-")) {
      const eventData = info.event.extendedProps;
      toast.info(`
        Event: ${info.event.title}
        Location: ${eventData.location}
        Price: $${eventData.price}
        Available Tickets: ${eventData.availableTickets}
      `);
    }
  };

  // Handle date click in calendar
  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    const eventsOnDay = events.filter((event) => {
      if (event.display === "background") return false;
      const eventDate = new Date(event.start).toISOString().split("T")[0];
      return eventDate === clickedDate;
    });

    if (eventsOnDay.length > 0) {
      toast.info(
        `${eventsOnDay.length} event(s) on ${new Date(
          clickedDate
        ).toLocaleDateString()}`
      );
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
          <h4 className="text-[19px] font-medium text-gray-700">
            Popular Events
          </h4>
        </div>

        <div className="flex flex-col items-center w-full gap-3 sm:flex-row sm:w-auto">
          <Button
            className="w-full py-5 text-black bg-white sm:w-auto hover:bg-gray-800"
            onClick={() => setIsModalOpen(true)}
          >
            Create Event
          </Button>
          <Button
            className="flex items-center justify-center w-full h-10 py-5 text-white bg-black border border-gray-300 sm:w-auto hover:bg-gray-100"
            onClick={() => setIsFilterModalOpen(true)}
            icon={
              <FilterOutlined
                style={{ fontSize: "16px", marginRight: "8px" }}
              />
            }
          >
            Filter
          </Button>
          <Button
            className="flex items-center justify-center w-full h-10 text-black bg-white border border-gray-300 sm:w-12 sm:h-12 hover:bg-gray-100"
            onClick={openCalendarModal}
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
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Event Title"
            name="title"
            rules={[{ required: true, message: "Please enter event title!" }]}
          >
            <Input
              placeholder="Enter event title"
              className="mb-2"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
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
            rules={[
              { required: true, message: "Please enter event location!" },
            ]}
          >
            <Input
              placeholder="Enter event location"
              className="mb-2"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please enter event price!" },
              {
                type: "number",
                min: 0,
                message: "Price must be a positive number!",
              },
            ]}
          >
            <InputNumber
              className="w-full mb-2"
              placeholder="Enter event price"
              value={formData.price}
              onChange={(value) =>
                setFormData({ ...formData, price: value || 0 })
              }
            />
          </Form.Item>

          <Form.Item
            label="Available Tickets"
            name="availableTickets"
            rules={[
              {
                required: true,
                message: "Please enter number of available tickets!",
              },
              { type: "number", min: 1, message: "Must be at least 1 ticket!" },
            ]}
          >
            <InputNumber
              className="w-full mb-2"
              placeholder="Enter number of available tickets"
              value={formData.availableTickets}
              onChange={(value) =>
                setFormData({ ...formData, availableTickets: value || 0 })
              }
            />
          </Form.Item>

          <Form.Item
            label="Event Image"
            name="imageBase64"
            rules={[
              { required: true, message: "Please upload an event image!" },
            ]}
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

      {/* Filter Modal */}
      <Modal
        title="Filter Events"
        open={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        footer={[
          <Button key="clear" onClick={handleFilterClear}>
            Clear Filters
          </Button>,
          <Button key="apply" type="primary" onClick={handleFilterApply}>
            Apply Filters
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Filter by Date Range">
            <RangePicker
              className="w-full"
              onChange={(dates) =>
                setFilterData({
                  ...filterData,
                  dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs],
                })
              }
              value={filterData.dateRange as [dayjs.Dayjs, dayjs.Dayjs] | null}
            />
          </Form.Item>

          <Form.Item label="Filter by Price Range">
            <div className="flex items-center gap-4">
              <InputNumber
                className="flex-1"
                placeholder="Min Price"
                min={0}
                value={filterData.priceRange ? filterData.priceRange[0] : 0}
                onChange={(value) =>
                  setFilterData({
                    ...filterData,
                    priceRange: [
                      value || 0,
                      filterData.priceRange ? filterData.priceRange[1] : 1000,
                    ],
                  })
                }
              />
              <span>to</span>
              <InputNumber
                className="flex-1"
                placeholder="Max Price"
                min={filterData.priceRange ? filterData.priceRange[0] : 0}
                value={filterData.priceRange ? filterData.priceRange[1] : 1000}
                onChange={(value) =>
                  setFilterData({
                    ...filterData,
                    priceRange: [
                      filterData.priceRange ? filterData.priceRange[0] : 0,
                      value || 1000,
                    ],
                  })
                }
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Calendar Modal */}
      {isCalendarModalOpen && (
        <Modal
          title="Event Calendar"
          open={isCalendarModalOpen}
          onCancel={() => setIsCalendarModalOpen(false)}
          width={800}
          footer={[
            <Button key="close" onClick={() => setIsCalendarModalOpen(false)}>
              Close
            </Button>,
          ]}
        >
          <div style={{ height: "500px" }}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events as EventInput[]}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek,dayGridDay",
              }}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
              eventContent={(eventInfo) => {
                // Only render content for non-background events
                if (eventInfo.event.display !== "background") {
                  return (
                    <div className="p-1">
                      <strong>{eventInfo.event.title}</strong>
                    </div>
                  );
                }
                return null;
              }}
              dayCellDidMount={(info) => {
                // Add custom styling to days with events
                const eventDate = info.date.toISOString().split("T")[0];
                const hasEvent = events.some((event) => {
                  if (event.display === "background") return false; // Skip background events to avoid double counting
                  const eventStartDate = new Date(event.start)
                    .toISOString()
                    .split("T")[0];
                  return eventStartDate === eventDate;
                });

                if (hasEvent) {
                  info.el.classList.add("has-event");
                }
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
