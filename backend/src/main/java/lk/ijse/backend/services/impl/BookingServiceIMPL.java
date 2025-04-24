package lk.ijse.backend.services.impl;

import lk.ijse.backend.dtos.BookingDTO;
import lk.ijse.backend.repositories.BookingRepository;
import lk.ijse.backend.repositories.EventRepository;
import lk.ijse.backend.services.BookingService;
import lk.ijse.backend.util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BookingServiceIMPL implements BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private Mapping mapping;

    @Override
    public void makeBooking(BookingDTO bookingDTO) {
        bookingRepository.save(mapping.convertToBookingEntity(bookingDTO));
    }

    @Override
    public List<BookingDTO> getAllBookings() {
        return mapping.convertToBookingDTOList(bookingRepository.findAll());
    }
}
