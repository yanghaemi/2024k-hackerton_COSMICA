package cosmica.SpringServer.repository;

import cosmica.SpringServer.dto.User;

import java.sql.Date;
import java.util.Optional;

public interface UserRepository {
    public Optional<User> findById(int id);
    public Optional<User> register(User user);
    public Optional<User> deleteById(int id);
    public Optional<User> findByDate(Date date);
}
