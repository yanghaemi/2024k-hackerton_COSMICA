package cosmica.SpringServer.repository.user;

import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.enums.UserType;
import lombok.RequiredArgsConstructor;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

//DB에 데이터 입력, 출력
@Primary
@Repository
public class JdbcUserRepository implements UserRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcUserRepository(BasicDataSource dataSource) {
        this.jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }

    @Override
    public Optional<User> findById(int id) {
        return Optional.ofNullable(
                jdbcTemplate.queryForObject(
                        "select *from user where id=:id",
                        new MapSqlParameterSource("id", id) ,userRowMapper()));
    }

    @Override
    public Optional<User> findByPw(int pw) {
        User pw1 = jdbcTemplate.queryForObject(
                "select *from user where pw=:pw",
                new MapSqlParameterSource("pw", pw), userRowMapper());
        return Optional.ofNullable(pw1);
    }

    @Override
    public Optional<User> register(User user) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id", user.getId());
        ms.addValue("name", user.getUserName());
        ms.addValue("password", user.getPw());
        ms.addValue("type", user.getUserType());
        ms.addValue("location", user.getLocation());
        ms.addValue("rate",user.getRate());
        ms.addValue("possibleDate", user.getPossibleDate());
        ms.addValue("times", user.getTimes());
        jdbcTemplate.update("insert into user (id,password,name,type,location,rate,possibleDate,times)" +
                " values (:id,:password,:name,:type,:location,:rating,:possibleDate,:times)",ms);

        return Optional.of(user);
    }

    @Override
    public Optional<User> deleteById(int id) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id", id);
        jdbcTemplate.update("delete from user where id=:id",ms);
        return findById(id);
    }

    @Override
    public Optional<List<User>> findByDate(Date date) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("date", date);
        List<User> userList = jdbcTemplate.query("select * from user where date=:date", ms, userRowMapper());
        return Optional.of(userList);
    }


    public RowMapper<User> userRowMapper() {
        return ((rs, rowNum) ->{
            User user=new User();
            user.setId(rs.getInt("id"));
            user.setPw(rs.getInt("pw"));
            user.setUserName(rs.getString("userName"));
            user.setUserType(rs.getString("userType").equals("휠체어 이용자")? UserType.WHEELCHAIR:UserType.COMPANION);
            user.setLocation(rs.getString("location"));
            user.setRate(rs.getDouble("rate"));
            user.setPossibleDate(rs.getDate("possibleDate"));
            user.setTimes(rs.getInt("times"));
            return user;
        });
    }

}
