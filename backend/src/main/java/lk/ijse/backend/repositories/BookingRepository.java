package lk.ijse.backend.repositories;

import lk.ijse.backend.entities.Booking;
import lk.ijse.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {

    List<Booking> findByUser(User user);
}
