package cosmica.SpringServer.repository.match;

import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;
import lombok.RequiredArgsConstructor;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//jdbc이용해서 DB 데이터 입력, 출력
@Repository
public class JdbcMatchRepository implements MatchRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcMatchRepository(BasicDataSource dataSource) {
        this.jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }

    //id입력 -> 동행자와 약속 정보 출력
    @Override
    public Appointment findMatchedDateById(int id) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id", id);
        Appointment appointment = jdbcTemplate.queryForObject("select *from Appointment where id=:id", ms, appointmentRowMapper1());
        return appointment;
    }

    //약속 정보 입력
    @Override
    public Map<Date, Appointment> insertMatchDay(Appointment appointment) {
        Map<Date, Appointment> map = new HashMap<>();
        map.put(appointment.getAppointDate(), appointment);
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id",appointment.getId());
        jdbcTemplate.update("insert into Appointment (id,myId,companionId,dateTime,location,bill)" +
                "values(:id,:myId,:companionId,:dateTime,:location,:bill)",ms);
        return map;
    }

    //자기자신 입력 ->내가 잡았던 약속정보들 출력
    @Override
    public List<Map<Date, Appointment>> showMatchedDatesByUser(User user) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("myId", user.getId());
        List<Map<Date, Appointment>> AppointList = jdbcTemplate.query("select * from Appointment where myId=:myId", ms, appointmentRowMapper());
        return AppointList;
    }

    //id입력 -> 동행자와 약속 정보 취소
    @Override
    public Appointment deleteMatchedDateById(int id) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id", id);
        jdbcTemplate.update("delete from Appointment where id=:id",ms);
        return findMatchedDateById(id);
    }

    private RowMapper<Appointment> appointmentRowMapper1(){
        return((rs,rowNum)->{
            Appointment appointment = new Appointment();
            appointment.setId(rs.getInt("id"));
            appointment.setMyId(rs.getInt("myId"));
            appointment.setCompanionId(rs.getInt("companionId"));
            appointment.setAppointDate(rs.getDate("appointDate"));
            appointment.setLocation(rs.getString("location"));
            appointment.setBill(rs.getInt("bill"));
            return appointment;
        });
    }

    private RowMapper<Map<Date,Appointment>> appointmentRowMapper() {
        return((rs, rowNum) -> {
            Map<Date,Appointment> map = new HashMap<>();
            Appointment appointment = new Appointment();
            appointment.setId(rs.getInt("id"));
            appointment.setMyId(rs.getInt("myId"));
            appointment.setCompanionId(rs.getInt("companionId"));
            appointment.setAppointDate(rs.getDate("appointDate"));
            appointment.setLocation(rs.getString("location"));
            appointment.setBill(rs.getInt("bill"));
            map.put(appointment.getAppointDate(), appointment);
            return map;
        });
    }
}
