package cosmica.SpringServer.dto.forMapping;

import lombok.Data;

@Data
public class DateMapping {
    Integer year;
    Integer month;
    Integer day;
    long timestamp;
    String dateString;
}
