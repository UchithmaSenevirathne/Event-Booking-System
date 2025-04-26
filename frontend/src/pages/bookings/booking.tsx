import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUserContext } from '../../components/UserContext';
import 'react-toastify/dist/ReactToastify.css';

interface Booking {
  bookingId: number;
  userId: number;
  eventId: number;
  ticketQuantity: number;
  createdAt: string;
}

export default function Booking() {
  const { user } = useUserContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getBookings = async () => {
    setLoading(true);
    try {
      let response;
      if (user.role === 'ADMIN') {
        response = await axios.get<Booking[]>('http://localhost:8080/events/backend/book/all_bookings');
      } else {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          toast.error('User email not found in local storage');
          return;
        }
        response = await axios.get<Booking[]>(`http://localhost:8080/events/backend/book/user/${email}/details`);
      }
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch booking details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Event ID',
      dataIndex: 'eventId',
      key: 'eventId',
    },
    {
      title: 'Ticket Quantity',
      dataIndex: 'ticketQuantity',
      key: 'ticketQuantity',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">Booking Details</h2>
      <Table
        dataSource={bookings}
        columns={columns}
        rowKey="bookingId"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
