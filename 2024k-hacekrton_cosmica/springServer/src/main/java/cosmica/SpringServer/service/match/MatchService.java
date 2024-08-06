package cosmica.SpringServer.service.match;

import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;

import java.sql.Date;
import java.util.List;
import java.util.Map;

//매칭 기능
public interface MatchService {
    public Appointment registerAppointment(User user,Appointment appointment);
    public Appointment searchAppointmentById(int id);
    public List<Appointment> searchAppointmentByDate(Date date);
    public List<Appointment> searchAppointmentByUser(User user);
    public Appointment applyAppointment(Appointment appointment,User I);
    public Appointment cancelAppointment(int id);
}
