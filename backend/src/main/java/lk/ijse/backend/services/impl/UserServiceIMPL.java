package lk.ijse.backend.services.impl;

import lk.ijse.backend.dtos.UserDTO;
import lk.ijse.backend.repositories.UserRepository;
import lk.ijse.backend.services.UserService;
import lk.ijse.backend.util.Mapping;
import lk.ijse.backend.util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceIMPL implements UserService, UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Mapping mapping;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }

    @Override
    public int saveUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return VarList.Not_Acceptable;
        }else{
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            userDTO.setRole("USER");
            userRepository.save(mapping.convertToUserEntity(userDTO));
            return VarList.Created;
        }
    }
}
