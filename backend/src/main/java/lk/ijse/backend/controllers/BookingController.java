package lk.ijse.backend.controllers;

import lk.ijse.backend.dtos.BookingDTO;
import lk.ijse.backend.dtos.EventDTO;
import lk.ijse.backend.exceptions.DataPersistFailedException;
import lk.ijse.backend.services.BookingService;
import lk.ijse.backend.services.impl.BookingServiceIMPL;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("events/backend/book")
@CrossOrigin
@RequiredArgsConstructor
public class BookingController {
    private final BookingServiceIMPL bookingService;

    @PostMapping
    public ResponseEntity<String> makeBooking(@RequestBody BookingDTO bookingDTO) {
        try {
            bookingService.makeBooking(bookingDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }catch (DataPersistFailedException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/all_bookings", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<BookingDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/user/{email}/details")
    public List<BookingDTO> getUserBookingDetails(@PathVariable String email) {
        try {
            return bookingService.getUserBookingDetails(email);
        }catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
