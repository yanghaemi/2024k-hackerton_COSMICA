package cosmica.SpringServer.service.match;

import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.enums.UserType;
import cosmica.SpringServer.repository.match.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;


    @Override
    public Appointment registerAppointment(User user, Appointment appointment) {
        appointment.DefaultSetting(user);//user가 Companion이면 CompanionId를 자동으로 WheelChair이면 WheelChairId를 자동으로 설정
        return matchRepository.registerAppointment(user, appointment);
    }

    @Override
    public Appointment searchAppointmentById(int id) {
        return matchRepository.searchAppointmentById(id);
    }

    @Override
    public List<Appointment> searchAppointmentByDate(Date date) {
        return matchRepository.searchAppointmentByDate(date);
    }

    @Override
    public List<Appointment> searchAppointmentByUser(User user) {
        return matchRepository.searchAppointmentByUser(user);
    }

    @Override
    public Appointment applyAppointment(Appointment appointment, User I) {
        return matchRepository.applyAppointment(appointment, I);
    }

    @Override
    public Appointment cancelAppointment(int id) {
        return matchRepository.cancelAppointment(id);
    }
}

