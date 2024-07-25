package cosmica.SpringServer.repository;

import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.dto.enums.UserType;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class JdbcUserRepository implements UserRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;


    @Override
    public Optional<User> findById(int id) {
        return Optional.ofNullable(
                jdbcTemplate.queryForObject(
                        "select *from user where id=:id",
                        new MapSqlParameterSource("id", id) ,userRowMapper()));
    }

    @Override
    public Optional<User> register(User user) {
        return null;
    }

    @Override
    public Optional<User> deleteById(int id) {
        return null;
    }

    @Override
    public Optional<User> findByDate(Date date) {
        return null;
    }


    public RowMapper<User> userRowMapper() {
        return ((rs, rowNum) ->{
            User user=new User();
            user.setId(rs.getInt("id"));
            user.setPassword(rs.getInt("password"));
            user.setName(rs.getString("name"));
            user.setUserType(rs.getString("userType").equals("휠체어 이용자")? UserType.WHEELCHAIR:UserType.COMPANION);
            user.setLocation(rs.getString("location"));
            user.setRate(rs.getDouble("rate"));
            user.setPossibleDate(rs.getDate("possibleDate"));
            user.setTimes(rs.getInt("times"));
            return user;
        });
    }

}
