package cosmica.SpringServer.dto;

import cosmica.SpringServer.enums.UserType;
import lombok.Data;
import lombok.ToString;

import java.sql.Date;

//신청한 동행 정보
@Data
@ToString

public class Appointment {
    private Integer id;
    private Integer wheelchairId;
    private Integer companionId;
    private Date appointDate;
    private String location;
    private int bill;
    private String review;
    private Double rate;

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
