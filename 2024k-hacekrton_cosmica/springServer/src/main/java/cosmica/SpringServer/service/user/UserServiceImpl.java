package cosmica.SpringServer.service.user;

import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<User> findById(int id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findByPw(int pw) {
        return userRepository.findByPw(pw);
    }

    @Override
    public Optional<User> login(int id, int pw) {
        Optional<User> userById = findById(id);
        Optional<User> userByPw = findByPw(pw);
        if (userById.isPresent() && userByPw.isPresent()) {
            if(userById.get().equals(userByPw.get())) {
                return userById;
            }
        }
        return Optional.empty();
    }

    @Override
    public Optional<User> register(User user) {
        return userRepository.register(user);
    }

    @Override
    public Optional<User> deleteById(int id) {
        return userRepository.deleteById(id);
    }

    @Override
    public Optional<List<User>> findByDate(Date date){
        return userRepository.findByDate(date);
    }
}
