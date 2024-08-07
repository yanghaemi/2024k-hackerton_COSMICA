package cosmica.SpringServer;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://172.30.128.131")
                .allowedMethods("GET", "POST", "PUT", "DELETE","OPTIONS")
                .allowedHeaders("Content-Type", "Authorization")
                .allowCredentials(true);
    }
}
