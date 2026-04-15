package com.xod.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

@Component
public class BusinessHoursInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (request.getRequestURI().startsWith("/api/auth")) {
            return true;
        }

        String method = request.getMethod();
        if (HttpMethod.GET.matches(method)) {
            return true;
        }

        LocalDateTime now = LocalDateTime.now();
        boolean businessDay = now.getDayOfWeek() != DayOfWeek.SATURDAY && now.getDayOfWeek() != DayOfWeek.SUNDAY;
        boolean businessHour = now.getHour() >= 9 && now.getHour() < 17;

        if (!businessDay || !businessHour) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Write operations allowed only on weekdays from 9:00 to 17:00");
            return false;
        }
        return true;
    }
}
