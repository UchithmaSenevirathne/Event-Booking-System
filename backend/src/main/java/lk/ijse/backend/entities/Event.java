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
@Table(name = "\"event\"")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;
    private String title;
    private LocalDateTime date;
    private String location;
    private Double price;
    private int availableTickets;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageBase64;
}
