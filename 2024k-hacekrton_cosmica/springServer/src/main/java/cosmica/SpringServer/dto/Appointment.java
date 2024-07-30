package cosmica.SpringServer.dto;

import lombok.Data;
import lombok.ToString;

import java.sql.Date;

//신청한 동행 정보
@Data
@ToString

public class Appointment {
    private Integer id;
    private Integer myId;
    private Integer companionId;
    private Date appointDate;
    private String location;
    private int bill;
}
