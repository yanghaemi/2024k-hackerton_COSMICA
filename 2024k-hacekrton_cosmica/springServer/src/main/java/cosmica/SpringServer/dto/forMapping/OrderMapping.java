package cosmica.SpringServer.dto.forMapping;

import lombok.Data;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;
@Data
@ToString
public class OrderMapping {
    Map<String,String> additionalParameters;
    Integer amount;
    String orderId;
    String paymentKey;
    String paymentType;
}
