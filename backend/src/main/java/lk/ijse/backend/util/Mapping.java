package lk.ijse.backend.util;

import lk.ijse.backend.dtos.UserDTO;
import lk.ijse.backend.entities.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Mapping {

    @Autowired
    private ModelMapper modelMapper;

    public User convertToUserEntity(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }
}
