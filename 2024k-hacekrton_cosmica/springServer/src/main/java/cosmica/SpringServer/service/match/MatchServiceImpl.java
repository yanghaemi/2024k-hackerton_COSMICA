package cosmica.SpringServer.service.match;

import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;
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

    //id입력 -> 동행자와 약속 정보 출력
    @Override
    public Appointment findMatchedDateById(int id) {
        return matchRepository.findMatchedDateById(id);
    }

    //약속 정보 저장
    @Override
    public Map<Date, Appointment> insertMatchDay(Appointment appointment) {
        return matchRepository.insertMatchDay(appointment);
    }

    //자기자신 입력 ->내가 잡았던 약속정보들 출력
    @Override
    public List<Map<Date, Appointment>> showMatchedDatesByUser(User user) {
        return matchRepository.showMatchedDatesByUser(user);
    }

    //id입력 -> 동행자와 약속 정보 취소
    @Override
    public Appointment deleteMatchedDateById(int id) {
        return matchRepository.deleteMatchedDateById(id);
    }



}
