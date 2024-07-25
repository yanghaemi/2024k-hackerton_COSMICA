package cosmica.SpringServer.dto;

import cosmica.SpringServer.dto.enums.Rate;
import cosmica.SpringServer.dto.enums.UserType;
import lombok.Data;
import lombok.ToString;

import java.sql.Date;
import java.util.Optional;

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
