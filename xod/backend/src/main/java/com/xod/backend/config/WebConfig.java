package com.xod.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final BusinessHoursInterceptor businessHoursInterceptor;

    public WebConfig(BusinessHoursInterceptor businessHoursInterceptor) {
        this.businessHoursInterceptor = businessHoursInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(businessHoursInterceptor).addPathPatterns("/api/**");
    }
}
