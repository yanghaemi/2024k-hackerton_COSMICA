package cosmica.SpringServer.dto;

import cosmica.SpringServer.enums.UserType;
import lombok.Data;
import lombok.ToString;

import java.sql.Date;

//사용자 정보 객체
@Data
@ToString
public class User {
    private Integer id;
    private Integer password;
    private String name;
    private UserType userType;
    private String location;
    private Double rate;
    private Date possibleDate;
    private Integer times;

}
