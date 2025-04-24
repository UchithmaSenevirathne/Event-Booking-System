package lk.ijse.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingDTO {
    private Long bookingId;
    private Long user_id;
    private Long event_id;
    private int ticketQuantity;
    private LocalDateTime createdAt;
}
