package lk.ijse.backend.services;

public interface EmailService {
    boolean sendEmail(String to, String subject, String body);
}