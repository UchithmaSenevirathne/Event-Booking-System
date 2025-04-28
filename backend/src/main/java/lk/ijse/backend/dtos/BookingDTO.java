package lk.ijse.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingDTO {
    private String bookingId;
    private String userId;
    private String eventId;
    private int ticketQuantity;
    private LocalDateTime createdAt;
}
