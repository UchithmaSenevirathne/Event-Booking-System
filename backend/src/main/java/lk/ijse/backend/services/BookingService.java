package lk.ijse.backend.services;

import lk.ijse.backend.dtos.BookingDTO;

import java.util.List;

public interface BookingService {
    void makeBooking(BookingDTO bookingDTO);

    List<BookingDTO> getAllBookings();
}
