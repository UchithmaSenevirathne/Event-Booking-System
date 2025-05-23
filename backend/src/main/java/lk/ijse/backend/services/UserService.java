package lk.ijse.backend.services;

import lk.ijse.backend.dtos.UserDTO;

public interface UserService {
    int saveUser(UserDTO userDTO);

    UserDTO loadUserDetailsByUsername(String email);

    String getUserIdByEmail(String email);
}
