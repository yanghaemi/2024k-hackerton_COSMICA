package cosmica.SpringServer.repository.user;

import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.enums.UserType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.SessionAttribute;

import javax.sql.DataSource;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

//DB에 데이터 입력, 출력
@Primary
@Repository
@RequiredArgsConstructor
@Slf4j
public class JdbcUserRepository implements UserRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;


    @Override
    public Optional<User> findById(int id) {
        return Optional.ofNullable(
                jdbcTemplate.queryForObject(
                        "select * from user where id=:id",
                        new MapSqlParameterSource("id", id) ,userRowMapper()));
    }



    @Override
    public Optional<User> login(int id, String pw) {
        Optional<User> userOptional = findById(id);
        System.out.println(userOptional.get());
        if(userOptional.isPresent()){
            User user = userOptional.get();
            if(user.getPw().equals(pw))
            {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    @Override
    public Optional<User> register(User user) {
        log.info("Registered User={}",user);
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id", user.getId());
        ms.addValue("pw", user.getPw());
        ms.addValue("userName", user.getUserName());
        ms.addValue("userType", user.getUserType().toString());
        ms.addValue("location", user.getLocation());
        ms.addValue("rate",user.getRate());
        ms.addValue("times", user.getTimes());
        jdbcTemplate.update("insert into user (id,pw,userName,userType,location,rate,times)" +
                " values (:id,:pw,:userName,:userType,:location,:rate,:times)",ms);
        return Optional.of(user);
    }

    @Override
    public Optional<User> deleteById(int id) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id", id);
        jdbcTemplate.update("delete from user where id=:id",ms);
        return findById(id);
    }

    public RowMapper<User> userRowMapper() {
        return ((rs, rowNum) ->{
            User user=new User();
            user.setId(rs.getInt("id"));
            user.setPw(rs.getString("pw"));
            user.setUserName(rs.getString("userName"));
            user.setUserType(rs.getString("userType").equals("WHEELCHAIR")? UserType.WHEELCHAIR:UserType.COMPANION);
            user.setLocation(rs.getString("location"));
            user.setRate(rs.getDouble("rate"));
            user.setTimes(rs.getInt("times"));
            return user;
        });
    }

}
