package cosmica.SpringServer.repository.user;

import cosmica.SpringServer.dto.User;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.*;

//DB에 보내지 않고 메모리 상에서 저장 -> test용
@Repository
@Qualifier("Memory")
public class MemoryUserRepository implements UserRepository {

    Map<Integer, User> users = new HashMap<Integer, User>();

    @Override
    public Optional<User> findById(int id) {
        return Optional.ofNullable(users.get(id));
    }

    @Override
    public Optional<User> register(User user) {
        users.put(user.getId(),user);
        return Optional.of(user);
    }

    @Override
    public Optional<User> deleteById(int id) {

        return Optional.of(users.remove(id));
    }

    @Override
    public Optional<List<User>> findByDate(Date date) {
        List<User> userList = new ArrayList<User>();
         for (Map.Entry<Integer, User> entry: users.entrySet())
         {
             if(entry.getValue().getPossibleDate()==date)
             {
                 userList.add(entry.getValue());
             }
         }
        return Optional.of(userList);
    }
}
