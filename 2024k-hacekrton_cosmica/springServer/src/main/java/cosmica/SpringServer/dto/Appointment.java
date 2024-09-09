package cosmica.SpringServer.dto;

import com.sun.jna.platform.win32.Sspi;
import cosmica.SpringServer.enums.UserType;
import lombok.Data;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.sql.Date;
import java.sql.Timestamp;

//신청한 동행 정보
@Data
@ToString
@Slf4j
public class Appointment {
    private Integer id;
    private Integer wheelchairId;
    private Integer companionId;
    private Date appointDate;
    private String location;
    private Integer bill;
    private String review;
    private Double rate;
    private Timestamp start;
    private Timestamp end;
    private Boolean carRequire;
    private String carName;


    public void DefaultSetting(User user){
       switch (user.getUserType()){
           case WHEELCHAIR -> {
               wheelchairId = user.getId();
               companionId = null;
           }
           case COMPANION -> {
               companionId = user.getId();
               wheelchairId = null;
           }
       }
    }
}
