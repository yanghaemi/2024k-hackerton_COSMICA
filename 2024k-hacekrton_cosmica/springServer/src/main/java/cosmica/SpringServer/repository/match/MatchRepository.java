package cosmica.SpringServer.repository.match;

import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;

import java.sql.Date;
import java.util.List;
import java.util.Map;

//매칭 데이터 입력, 출력
public interface MatchRepository {
    public Appointment findMatchedDateById(int id); //id입력 -> 동행자와 약속 정보 출력
    public Map<Date, Appointment> insertMatchDay(Appointment appointment); //약속 정보 저장
    public List<Map<Date, Appointment>> showMatchedDatesByUser(User user);//자기자신 입력 ->내가 잡았던 약속정보들 출력
    public Appointment deleteMatchedDateById(int id);//id입력 -> 동행자와 약속 정보 취소
}
