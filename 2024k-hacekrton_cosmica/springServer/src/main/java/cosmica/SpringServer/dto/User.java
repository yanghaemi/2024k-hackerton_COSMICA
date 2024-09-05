package cosmica.SpringServer.dto;

import cosmica.SpringServer.enums.UserType;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;

//사용자 정보 객체
@Getter
@Setter
@ToString
public class User {
    private Integer id;
    private String pw;
    private String userName;
    private String phoneNum;
    private UserType userType;
    private String location;
    private Double rate;
    private Integer times;
    private String car;
    private Boolean verify;
    private String verifyFilePath;
}
