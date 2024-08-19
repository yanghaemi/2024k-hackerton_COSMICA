package cosmica.SpringServer;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DBConnectConfig {

    @Bean
    public DataSource dataSource() {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setUrl("jdbc:mariadb://localhost:3307/cosmica");
        dataSource.setUsername("root");
        dataSource.setPassword("0000");
        dataSource.setDriverClassName("org.mariadb.jdbc.Driver");
        return dataSource;
    }
}
