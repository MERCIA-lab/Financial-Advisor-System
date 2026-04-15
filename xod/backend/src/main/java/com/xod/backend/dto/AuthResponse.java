package com.xod.backend.dto;

public record AuthResponse(
        String token,
        Long advisorId,
        String name,
        String email
) {
}
