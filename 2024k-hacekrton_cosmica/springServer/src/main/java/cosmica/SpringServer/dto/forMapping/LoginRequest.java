package cosmica.SpringServer.dto.forMapping;

import lombok.Data;

@Data
public class LoginRequest {
    private String id;
    private String password;
}
