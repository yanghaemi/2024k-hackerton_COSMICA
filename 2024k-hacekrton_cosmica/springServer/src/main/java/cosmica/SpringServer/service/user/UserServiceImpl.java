package cosmica.SpringServer.service.user;

import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public Optional<User> findById(int id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> login(int id, String pw) {
       return userRepository.login(id,pw);
    }

    @Override
    public Optional<User> register(User user) {
        return userRepository.register(user);
    }

    @Override
    public Optional<User> deleteById(int id) {
        return userRepository.deleteById(id);
    }

//    @Override
//    public Optional<List<User>> findByDate(Date date){
//        return userRepository.findByDate(date);
//    }
}
