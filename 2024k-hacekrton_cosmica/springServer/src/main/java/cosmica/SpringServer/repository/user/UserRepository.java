package cosmica.SpringServer.repository.user;

import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

//User 입력, 출력
public interface UserRepository {
    public Optional<User> findById(int id); //id 입력 -> 해당 User 출력
    public Optional<User> login(int id, String pw);
    public Optional<User> register(User user);//User 등록
    public Optional<User> deleteById(int id);//id 입력 -> 해당 User 삭제
    public void updateRate(Appointment appointment);
    public Optional<User> updateUser(User user);
    public List<User> findAll();
//    public Optional<List<User>> findByDate(Date date);// date 입력 -> 해당 date에 가능한 User List 출력
}
