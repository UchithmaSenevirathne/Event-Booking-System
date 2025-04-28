package lk.ijse.backend.services;

import lk.ijse.backend.customeObj.EventResponse;
import lk.ijse.backend.dtos.EventDTO;

import java.util.List;

public interface EventService {
    void addEvent(EventDTO eventDTO);

    void updateEvent(EventDTO eventDTO);

    List<EventDTO> getAllEvents();

    EventResponse getSelectedEvent(String eventId);

    void deleteEvent(String eventId);
}
