package lk.ijse.backend.services.impl;

import lk.ijse.backend.dtos.BookingDTO;
import lk.ijse.backend.entities.Event;
import lk.ijse.backend.entities.User;
import lk.ijse.backend.repositories.BookingRepository;
import lk.ijse.backend.repositories.EventRepository;
import lk.ijse.backend.repositories.UserRepository;
import lk.ijse.backend.services.BookingService;
import lk.ijse.backend.util.IdGenerator;
import lk.ijse.backend.util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookingServiceIMPL implements BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private IdGenerator idGenerator;

    @Autowired
    private Mapping mapping;

    @Override
    public void makeBooking(BookingDTO bookingDTO) {
        bookingDTO.setBookingId(idGenerator.generateBookingId());
        bookingRepository.save(mapping.convertToBookingEntity(bookingDTO));

        // Now update available tickets
        Optional<Event> eventOptional = eventRepository.findById(bookingDTO.getEventId());
        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            int updatedTickets = event.getAvailableTickets() - bookingDTO.getTicketQuantity();

            if (updatedTickets < 0) {
                throw new RuntimeException("Not enough tickets available.");
            }

            event.setAvailableTickets(updatedTickets);
            eventRepository.save(event);
        } else {
            throw new RuntimeException("Event not found for booking.");
        }
    }

    @Override
    public List<BookingDTO> getAllBookings() {
        return mapping.convertToBookingDTOList(bookingRepository.findAll());
    }

    @Override
    public List<BookingDTO> getUserBookingDetails(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return mapping.convertToBookingDTOList(bookingRepository.findByUser(user));
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
