package lk.ijse.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventDTO {
    private Long eventId;
    private String title;
    private LocalDateTime date;
    private String location;
    private Double price;
    private int availableTickets;
}
