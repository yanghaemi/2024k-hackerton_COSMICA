package cosmica.SpringServer.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private Integer id;
    private String pw;
}
