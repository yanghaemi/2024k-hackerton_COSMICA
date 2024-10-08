package cosmica.SpringServer.repository.match;

import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.enums.UserType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Date;
import java.util.*;

//jdbc이용해서 DB 데이터 입력, 출력
@Repository
@RequiredArgsConstructor
@Slf4j
public class JdbcMatchRepository implements MatchRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    @Override
    public Appointment registerAppointment(User user, Appointment appointment) {
        appointment.setId((int) (Math.random() * Integer.MAX_VALUE));
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id",appointment.getId());
        ms.addValue("wheelchairId",appointment.getWheelchairId());
        ms.addValue("companionId",appointment.getCompanionId());
        ms.addValue("appointDate",appointment.getAppointDate());
        ms.addValue("location",appointment.getLocation());
        ms.addValue("bill",appointment.getBill());
        ms.addValue("start",appointment.getStart());
        ms.addValue("end",appointment.getEnd());
        ms.addValue("carRequire",appointment.getCarRequire());
        ms.addValue("carName",appointment.getCarName());

        jdbcTemplate.update("insert into APPOINTMENT (id, wheelchairId,companionId,appointDate,location,bill,start,end,carRequire,carName)" +
                "values(:id,:wheelchairId,:companionId,:appointDate,:location,:bill,:start,:end,:carRequire,:carName)", ms);

        MapSqlParameterSource ms2 = new MapSqlParameterSource();
        ms2.addValue("userId",user.getId());
        ms2.addValue("appointmentId",appointment.getId());
        jdbcTemplate.update("insert into USERAPPOINTMENT (userId,appointmentId) values(:userId,:appointmentId)",ms2);
        return appointment;
    }

    @Override
    public Appointment searchAppointmentById(int id){
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id",id);
        Appointment appointmentList = jdbcTemplate.queryForObject("select *from APPOINTMENT where id=:id", ms, appointmentRowMapper1());
        return appointmentList;
    }

    @Override
    public List<Appointment> searchAppointmentByDate(Date date) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("appointDate",date);
        List<Appointment> appointmentList = jdbcTemplate.query("select * from APPOINTMENT where appointDate=:appointDate", ms, appointmentRowMapper1());
        return appointmentList;
    }

    @Override
    public List<Appointment> searchAppointmentByUser(User user) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        List<Appointment> appointmentList;
        if(user.getUserType()==UserType.WHEELCHAIR) {
            ms.addValue("wheelchairId",user.getId());
             appointmentList= jdbcTemplate.query("select * from APPOINTMENT where wheelchairId=:wheelchairId", ms, appointmentRowMapper1());
        }
        else{
            ms.addValue("companionId",user.getId());
            appointmentList = jdbcTemplate.query("select * from APPOINTMENT where companionId=:companionId", ms, appointmentRowMapper1());
        }
        return appointmentList;
    }

    @Override
    public Appointment applyAppointment(Appointment appointment,User I) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        log.info(appointment.toString());
        ms.addValue("id",appointment.getId());
        ms.addValue("wheelchairId",appointment.getWheelchairId());
        ms.addValue("companionId",appointment.getCompanionId());
        jdbcTemplate.update("update APPOINTMENT set wheelchairId=:wheelchairId,companionId=:companionId  where id=:id", ms);
        MapSqlParameterSource ms2 = new MapSqlParameterSource();
        ms2.addValue("id",appointment.getCompanionId());
        jdbcTemplate.update("update USER set times=times+1 where id=:id", ms2);
        MapSqlParameterSource ms3 = new MapSqlParameterSource();
        ms3.addValue("id",appointment.getWheelchairId());
        jdbcTemplate.update("update USER set times=times+1 where id=:id", ms3);
        return searchAppointmentById(appointment.getId());
    }

    @Override
    public Appointment cancelAppointment(int id) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id",id);
        Appointment appointment = searchAppointmentById(id);
        jdbcTemplate.update("delete from APPOINTMENT where id=:id",ms);
        return appointment;
    }

    @Override
    public Appointment updateAppointment(Appointment appointment) {
        MapSqlParameterSource ms = new MapSqlParameterSource();
        ms.addValue("id",appointment.getId());
        ms.addValue("review",appointment.getReview());
        ms.addValue("rate",appointment.getRate());
        jdbcTemplate.update("update APPOINTMENT set review =:review, rate =:rate where id=:id", ms);
        return searchAppointmentById(appointment.getId());
    }


    private RowMapper<Appointment> appointmentRowMapper1(){
        return((rs,rowNum)->{
            Appointment appointment = new Appointment();
            appointment.setId(rs.getInt("id"));
            appointment.setWheelchairId(rs.getInt("wheelchairId"));
            appointment.setCompanionId(rs.getInt("companionId"));
            appointment.setAppointDate(rs.getDate("appointDate"));
            appointment.setLocation(rs.getString("location"));
            appointment.setBill(rs.getInt("bill"));
            appointment.setReview(rs.getString("review"));
            appointment.setRate(rs.getDouble("rate"));
            appointment.setStart(rs.getTimestamp("start"));
            appointment.setEnd(rs.getTimestamp("end"));
            appointment.setCarRequire(rs.getBoolean("carRequire"));
            appointment.setCarName(rs.getString("carName"));
            return appointment;
        });
    }

}
