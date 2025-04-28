package lk.ijse.backend.services.impl;

import lk.ijse.backend.dtos.UserDTO;
import lk.ijse.backend.entities.User;
import lk.ijse.backend.repositories.UserRepository;
import lk.ijse.backend.services.EmailService;
import lk.ijse.backend.services.UserService;
import lk.ijse.backend.util.IdGenerator;
import lk.ijse.backend.util.Mapping;
import lk.ijse.backend.util.VarList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class UserServiceIMPL implements UserService, UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IdGenerator idGenerator;

    @Autowired
    private Mapping mapping;

    @Autowired
    private EmailService emailService;

    // Map to store OTP with expiration time
    private Map<String, Map<String, Object>> otpStorage = new HashMap<>();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User userEntity = userRepository.findByEmail(username);
        if (userEntity == null) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }
        return new org.springframework.security.core.userdetails.User(userEntity.getEmail(), userEntity.getPassword(), getAuthority(userEntity));
    }

    private Collection<? extends GrantedAuthority> getAuthority(User userEntity) {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(userEntity.getRole()));
        return authorities;
    }

    @Override
    public int saveUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return VarList.Not_Acceptable;
        }else{
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            userDTO.setRole("USER");
            userDTO.setUserId(idGenerator.generateUserId());
            userRepository.save(mapping.convertToUserEntity(userDTO));
            return VarList.Created;
        }
    }

    @Override
    public UserDTO loadUserDetailsByUsername(String email) {
        User user = userRepository.findByEmail(email);
        return mapping.convertToUserDTO(user);
    }

    @Override
    public String getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return user.getUserId();
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public boolean sendOtpToEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return false;
        }

        // Generate a 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Set OTP expiration time to 5 minutes from now
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);

        // Store OTP with expiration time
        Map<String, Object> otpData = new HashMap<>();
        otpData.put("otp", otp);
        otpData.put("expiration", expirationTime);
        otpStorage.put(email, otpData);

        // Send OTP via email
        String subject = "Password Reset OTP";
        String body = "Your OTP for password reset is: " + otp + "\n\nThis OTP will expire in 5 minutes.";

        return emailService.sendEmail(email, subject, body);
    }

    public boolean verifyOtp(String email, String otp) {
        Map<String, Object> otpData = otpStorage.get(email);
        if (otpData == null) {
            return false;
        }

        String storedOtp = (String) otpData.get("otp");
        LocalDateTime expirationTime = (LocalDateTime) otpData.get("expiration");

        // Check if OTP is valid and not expired
        if (storedOtp != null && storedOtp.equals(otp) && LocalDateTime.now().isBefore(expirationTime)) {
            // OTP is verified but don't remove yet, we'll need it for password reset verification
            return true;
        }

        return false;
    }

    public boolean resetPassword(String email, String otp, String newPassword) {
        // First verify OTP again
        if (!verifyOtp(email, otp)) {
            return false;
        }

        // Find the user
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return false;
        }

        // Encode and update the password
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Remove the OTP now that the password has been reset
        otpStorage.remove(email);

        return true;
    }
}