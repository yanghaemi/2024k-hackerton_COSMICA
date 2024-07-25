import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class AppConfig {

    @Bean
    public DataSource dataSource() {
        BasicDataSource dataSource = new BasicDataSource();
//        dataSource.setUrl("jdbc:mariadb://localhost:0000/tablename);
//        dataSource.setUsername("root");
//        dataSource.setPassword("0000");
        return dataSource;
    }

}
