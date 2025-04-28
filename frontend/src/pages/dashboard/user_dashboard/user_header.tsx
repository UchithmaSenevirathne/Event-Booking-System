import React, { useState, useEffect } from "react";
import { Button, Modal, DatePicker, InputNumber, Form, Typography } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

const { RangePicker } = DatePicker;

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

interface UserHeaderProps {
  onFilterChange: (filters: FilterOptions | null) => void;
}

export default function UserHeader({ onFilterChange }: UserHeaderProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] =
    useState<boolean>(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filterData, setFilterData] = useState<FilterOptions>({
    dateRange: null,
    priceRange: [0, 1000],
  });

  useEffect(() => {
    const styleEl = document.createElement("style");
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
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

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

  const handleFilterApply = () => {
    onFilterChange({
      dateRange: filterData.dateRange,
      priceRange: filterData.priceRange,
    });
    setIsFilterModalOpen(false);
    toast.info("Filters applied");
  };

  const handleFilterClear = () => {
    setFilterData({
      dateRange: null,
      priceRange: [0, 1000],
    });
    onFilterChange(null);
    setIsFilterModalOpen(false);
    toast.info("Filters cleared");
  };

  const handleEventClick = (info: any) => {
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
