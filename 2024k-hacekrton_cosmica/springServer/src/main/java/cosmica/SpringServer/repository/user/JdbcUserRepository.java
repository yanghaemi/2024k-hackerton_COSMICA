package cosmica.SpringServer.repository.user;

import cosmica.SpringServer.dto.Appointment;
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
                        "select * from USER where id=:id",
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
        ms.addValue("phoneNum",user.getPhoneNum());
        ms.addValue("userType", user.getUserType().toString());
        ms.addValue("location", user.getLocation());
        ms.addValue("rate",0.0);
        ms.addValue("times", 0);
        ms.addValue("car",user.getCar());
        ms.addValue("verify",user.getVerify());
        jdbcTemplate.update("insert into USER (id,pw,userName,phoneNum,userType,location,rate,times,car,verify)" +
                " values (:id,:pw,:userName,:phoneNum,:userType,:location,:rate,:times,:car,:verify)",ms);
        return Optional.of(user);
    }

    @Override
    public Optional<User> deleteById(int id) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id", id);
        jdbcTemplate.update("delete from USER where id=:id",ms);
        return findById(id);
    }

    public void updateRate(Appointment appointment) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("companionId", appointment.getCompanionId());

        List<Long> longList = jdbcTemplate.query("select rate from APPOINTMENT where companionId=:companionId and rate!=0", ms, userRateRowMapper());
        for (Long l : longList) {
            log.info("long={}", l);
        }
        log.info("longList.size()={}", longList.size());
        Double sum = 0.0;
        for (Long l : longList) sum += l;
        log.info("sum={}", sum);
        Double rate = sum / (longList.size());
        log.info("rate={}", rate);
        ms.addValue("rate", rate);
        jdbcTemplate.update("update USER set rate = :rate where id=:companionId", ms);
    }

    @Override
    public Optional<User> updateUser(User user) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id", user.getId());
        ms.addValue("pw", user.getPw());
        ms.addValue("userName", user.getUserName());
        ms.addValue("phoneNum", user.getPhoneNum());
        ms.addValue("userType", user.getUserType().toString());
        ms.addValue("location", user.getLocation());
        ms.addValue("rate", user.getRate());
        ms.addValue("times", user.getTimes());
        ms.addValue("car", user.getCar());
        ms.addValue("verify", user.getVerify());
        ms.addValue("verifyFilePath", user.getVerifyFilePath());
        jdbcTemplate.update("update USER set id=:id, pw=:pw, userName=:userName, phoneNum=:phoneNum, userType=:userType, location=:location, rate=:rate, times=:times, car=:car, verify=:verify, verifyFilePath=:verifyFilePath where id=:id",ms);
        return findById(user.getId());
    }

    @Override
    public List<User> findAll() {
        return jdbcTemplate.query("select * from USER",userRowMapper());
    }

    public RowMapper<Long> userRateRowMapper() {
        return (rs, rowNum) -> rs.getLong("rate");
    }


        public RowMapper<User> userRowMapper() {
        return ((rs, rowNum) ->{
            User user=new User();
            user.setId(rs.getInt("id"));
            user.setPw(rs.getString("pw"));
            user.setUserName(rs.getString("userName"));
            user.setPhoneNum(rs.getString("phoneNum"));
            user.setUserType(rs.getString("userType").equals("WHEELCHAIR")? UserType.WHEELCHAIR:UserType.COMPANION);
            user.setLocation(rs.getString("location"));
            user.setRate(rs.getDouble("rate"));
            user.setTimes(rs.getInt("times"));
            user.setCar(rs.getString("car"));
            user.setVerify(rs.getBoolean("verify"));
            user.setVerifyFilePath(rs.getString("verifyFilePath"));
            return user;
        });
    }

}
