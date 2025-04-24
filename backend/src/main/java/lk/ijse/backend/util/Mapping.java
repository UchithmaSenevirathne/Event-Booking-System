package lk.ijse.backend.util;

import lk.ijse.backend.dtos.EventDTO;
import lk.ijse.backend.dtos.UserDTO;
import lk.ijse.backend.entities.Event;
import lk.ijse.backend.entities.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class Mapping {

    @Autowired
    private ModelMapper modelMapper;

    public User convertToUserEntity(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }

    public UserDTO convertToUserDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    public Event convertToEventEntity(EventDTO eventDTO) {
        return modelMapper.map(eventDTO, Event.class);
    }

    public EventDTO convertToEventDTO(Event event) {
        return modelMapper.map(event, EventDTO.class);
    }

    public List<EventDTO> convertToEventDTOList(List<Event> eventList) {
        return modelMapper.map(eventList, new TypeToken<List<EventDTO>>() {}.getType());
    }
}
