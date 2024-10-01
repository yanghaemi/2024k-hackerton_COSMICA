package cosmica.SpringServer.repository.match;

import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;

import java.sql.Date;
import java.util.List;

//매칭 데이터 입력, 출력
public interface MatchRepository {
    public Appointment registerAppointment(User user,Appointment appointment);
    public Appointment searchAppointmentById(int id);
    public List<Appointment> searchAppointmentByDate(Date date);
    public List<Appointment> searchAppointmentByUser(User user);
    public Appointment applyAppointment(Appointment appointment,User I);
    public Appointment cancelAppointment(int id);
    public Appointment updateAppointment(Appointment appointment);
}
