package lk.ijse.backend.services.impl;

import lk.ijse.backend.customeObj.EventResponse;
import lk.ijse.backend.dtos.EventDTO;
import lk.ijse.backend.entities.Event;
import lk.ijse.backend.exceptions.NotFoundException;
import lk.ijse.backend.repositories.EventRepository;
import lk.ijse.backend.services.EventService;
import lk.ijse.backend.util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventServiceIMPL implements EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private Mapping mapping;

    @Override
    public void addEvent(EventDTO eventDTO) {
        eventRepository.save(mapping.convertToEventEntity(eventDTO));
    }

    @Override
    public void updateEvent(EventDTO eventDTO) {
        Optional<Event> tmpEventEntity = eventRepository.findById(eventDTO.getEventId());
        System.out.println(tmpEventEntity);
        if (!tmpEventEntity.isPresent()) {
            throw new NotFoundException("Event not found");
        }else {
            tmpEventEntity.get().setTitle(eventDTO.getTitle());
            tmpEventEntity.get().setDate(eventDTO.getDate());
            tmpEventEntity.get().setPrice(eventDTO.getPrice());
            tmpEventEntity.get().setLocation(eventDTO.getLocation());
            tmpEventEntity.get().setAvailableTickets(eventDTO.getAvailableTickets());
        }
    }

    @Override
    public List<EventDTO> getAllEvents() {
        return mapping.convertToEventDTOList(eventRepository.findAll());
    }

    @Override
    public EventResponse getSelectedEvent(Long eventId) {
        if (eventRepository.existsById(eventId)) {
            return mapping.convertToEventDTO(eventRepository.getReferenceById(eventId));
        }else{
            throw new NotFoundException("Event not found");
        }
    }

    @Override
    public void deleteEvent(Long eventId) {
        Optional<Event> findId = eventRepository.findById(eventId);
        if(!findId.isPresent()){
            throw new NotFoundException("Event not found");
        }else {
            eventRepository.deleteById(eventId);
        }
    }
}
