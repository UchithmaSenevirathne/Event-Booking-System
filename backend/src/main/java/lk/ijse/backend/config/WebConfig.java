package lk.ijse.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000/") // Frontend origin
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT")
                .allowedHeaders("Authorization", "Content-Type") // Allow Authorization header
                .exposedHeaders("Authorization") // Expose headers if needed
                .allowCredentials(true);
    }
}
