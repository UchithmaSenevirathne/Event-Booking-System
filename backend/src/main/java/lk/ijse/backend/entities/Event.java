package lk.ijse.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "\"events\"")
public class Event {
    @Id
    private String eventId;
    private String title;
    private LocalDateTime date;
    private String location;
    private Double price;
    private int availableTickets;
    @Column(columnDefinition = "TEXT")
    private String imageBase64;
}
