package lk.ijse.backend.util;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Component;

@Component
public class IdGenerator {
    @PersistenceContext
    private EntityManager entityManager;

    public String generateEventId() {
        // Query to get the highest event ID
        Query query = entityManager.createQuery(
                "SELECT e.eventId FROM Event e WHERE e.eventId LIKE 'E00-%' ORDER BY e.eventId DESC");
        query.setMaxResults(1);

        String lastId;
        try {
            lastId = (String) query.getSingleResult();
        } catch (NoResultException e) {
            // No existing records, start with E00-001
            return "E00-001";
        }

        // Extract the numeric part
        String numericPart = lastId.substring(4); // Skip "E00-"
        int nextNumber = Integer.parseInt(numericPart) + 1;

        // Format with leading zeros based on the number of digits
        if (nextNumber < 10) {
            return String.format("E00-00%d", nextNumber);
        } else if (nextNumber < 100) {
            return String.format("E00-0%d", nextNumber);
        } else {
            return String.format("E00-%d", nextNumber);
        }
    }

    public String generateUserId() {
        // Query to get the highest event ID
        Query query = entityManager.createQuery(
                "SELECT u.userId FROM User u WHERE u.userId LIKE 'U00-%' ORDER BY u.userId DESC");
        query.setMaxResults(1);

        String lastId;
        try {
            lastId = (String) query.getSingleResult();
        } catch (NoResultException e) {
            // No existing records, start with U00-001
            return "U00-001";
        }

        // Extract the numeric part
        String numericPart = lastId.substring(4); // Skip "U00-"
        int nextNumber = Integer.parseInt(numericPart) + 1;

        // Format with leading zeros based on the number of digits
        if (nextNumber < 10) {
            return String.format("U00-00%d", nextNumber);
        } else if (nextNumber < 100) {
            return String.format("U00-0%d", nextNumber);
        } else {
            return String.format("U00-%d", nextNumber);
        }
    }

    public String generateBookingId() {
        // Query to get the highest event ID
        Query query = entityManager.createQuery(
                "SELECT b.bookingId FROM Booking b WHERE b.bookingId LIKE 'B00-%' ORDER BY b.bookingId DESC");
        query.setMaxResults(1);

        String lastId;
        try {
            lastId = (String) query.getSingleResult();
        } catch (NoResultException e) {
            // No existing records, start with B00-001
            return "B00-001";
        }

        // Extract the numeric part
        String numericPart = lastId.substring(4); // Skip "B00-"
        int nextNumber = Integer.parseInt(numericPart) + 1;

        // Format with leading zeros based on the number of digits
        if (nextNumber < 10) {
            return String.format("B00-00%d", nextNumber);
        } else if (nextNumber < 100) {
            return String.format("B00-0%d", nextNumber);
        } else {
            return String.format("B00-%d", nextNumber);
        }
    }
}
