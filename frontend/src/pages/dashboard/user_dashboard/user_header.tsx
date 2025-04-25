import React, { useState, useEffect } from "react";
import { Button, Modal, DatePicker, InputNumber, Form, Typography } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const { Title } = Typography;
const { RangePicker } = DatePicker;

// Define type for filter options
interface FilterOptions {
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  priceRange?: [number, number] | null;
}

interface AdminHeaderProps {
  onFilterChange: (filters: FilterOptions | null) => void;
}

export default function UserHeader({ onFilterChange }: AdminHeaderProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);

  const [filterData, setFilterData] = useState<FilterOptions>({
    dateRange: null,
    priceRange: [0, 1000],
  });

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/events/backend/event");
      // Transform events data to FullCalendar format
      const formattedEvents = response.data.map((event: any) => ({
        title: event.title,
        start: event.date,
        id: event.id,
        extendedProps: {
          location: event.location,
          price: event.price,
          availableTickets: event.availableTickets
        }
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    }
  };

  const openCalendarModal = () => {
    console.log("Opening calendar modal");
    setIsCalendarModalOpen(true);
  };

  // const handleImageUpload = async (file: RcFile): Promise<boolean> => {
  //   const maxFileSize = 10 * 1024 * 1024; // 10 MB
  //   if (file.size && file.size > maxFileSize) {
  //     toast.error("File size exceeds the maximum limit of 10 MB.");
  //     return false;
  //   }

  //   try {
  //     const options = {
  //       maxSizeMB: 1,
  //       maxWidthOrHeight: 1920,
  //       useWebWorker: true
  //     };

  //     const compressedFile = await imageCompression(file, options);

  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (reader.result) {
  //         setFormData({ ...formData, imageBase64: reader.result.toString() });
  //         setImagePreview(reader.result.toString());
  //       }
  //     };
  //     reader.readAsDataURL(compressedFile);

  //   } catch (error) {
  //     toast.error("Error compressing image");
  //     console.error(error);
  //   }

  //   return false; // Prevent default upload behavior
  // };

  // const handleSubmit = async () => {
  //   if (!formData.title || !formData.date || !formData.location || !formData.price || !formData.availableTickets || !formData.imageBase64) {
  //     toast.error("Please fill in all fields correctly.");
  //     return;
  //   }

  //   const form = new FormData();
  //   form.append("title", formData.title);
  //   form.append("date", formData.date?.toISOString() || "");
  //   form.append("location", formData.location);
  //   form.append("price", formData.price.toString());
  //   form.append("availableTickets", formData.availableTickets.toString());
  //   form.append("imageBase64", formData.imageBase64);

  //   try {
  //     await axios.post("http://localhost:8080/events/backend/event", form, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     toast.success("Event created successfully!");
  //     fetchEvents(); // Refresh events after creating a new one
  //     onEventCreated();
  //     // Reset form data
  //     setFormData({
  //       title: "",
  //       date: null,
  //       location: "",
  //       price: 0,
  //       availableTickets: 0,
  //       imageBase64: "",
  //     });
  //     setImagePreview("");
  //     setIsModalOpen(false);
  //   } catch (err) {
  //     toast.error("Failed to create event.");
  //   }
  // };

  const handleFilterApply = () => {
    // Apply the filters
    onFilterChange({
      dateRange: filterData.dateRange,
      priceRange: filterData.priceRange
    });
    setIsFilterModalOpen(false);
    toast.info("Filters applied");
  };

  const handleFilterClear = () => {
    // Clear all filters
    setFilterData({
      dateRange: null,
      priceRange: [0, 1000]
    });
    onFilterChange(null);
    setIsFilterModalOpen(false);
    toast.info("Filters cleared");
  };

  // Handle event click in calendar
  const handleEventClick = (info: any) => {
    toast.info(`Event: ${info.event.title}`);
    // You could open a modal with event details here
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
            className="flex items-center justify-center w-full h-10 py-5 text-white bg-black border border-gray-300 sm:w-auto hover:bg-gray-100"
            onClick={() => setIsFilterModalOpen(true)}
            icon={<FilterOutlined style={{ fontSize: "16px", marginRight: "8px" }} />}
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
              onChange={(dates) => setFilterData({ ...filterData, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] })}
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
                onChange={(value) => setFilterData({ 
                  ...filterData, 
                  priceRange: [value || 0, filterData.priceRange ? filterData.priceRange[1] : 1000]
                })}
              />
              <span>to</span>
              <InputNumber
                className="flex-1"
                placeholder="Max Price"
                min={filterData.priceRange ? filterData.priceRange[0] : 0}
                value={filterData.priceRange ? filterData.priceRange[1] : 1000}
                onChange={(value) => setFilterData({ 
                  ...filterData, 
                  priceRange: [filterData.priceRange ? filterData.priceRange[0] : 0, value || 1000]
                })}
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
          <div style={{ height: '500px' }}>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay'
              }}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
              eventColor="#3788d8"
              eventBorderColor="#3788d8"
              eventTextColor="#ffffff"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}