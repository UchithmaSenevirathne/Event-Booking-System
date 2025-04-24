package lk.ijse.backend.controllers;

import lk.ijse.backend.customeObj.EventResponse;
import lk.ijse.backend.dtos.EventDTO;
import lk.ijse.backend.exceptions.DataPersistFailedException;
import lk.ijse.backend.exceptions.NotFoundException;
import lk.ijse.backend.services.impl.EventServiceIMPL;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("events/backend/event")
@CrossOrigin
@RequiredArgsConstructor
public class EventController {
    private final EventServiceIMPL eventService;

    @PostMapping
    public ResponseEntity<String> addEvent(@RequestBody EventDTO eventDTO) {
        try {
            eventService.addEvent(eventDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }catch (DataPersistFailedException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/update/{eventId}")
    public ResponseEntity<Void> updateEvent(@PathVariable("eventId") Long eventId, @RequestBody EventDTO eventDTO) {
        try {
            eventDTO.setEventId(eventId);
            eventService.updateEvent(eventDTO);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch (NotFoundException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/all_events", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<EventDTO> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping(value = "/get/{eventId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public EventResponse getEventById(@PathVariable("eventId") Long eventId) {
        return eventService.getSelectedEvent(eventId);
    }

    @DeleteMapping(value = "/delete/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("eventId") Long eventId) {
        try {
            eventService.deleteEvent(eventId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch (NotFoundException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
