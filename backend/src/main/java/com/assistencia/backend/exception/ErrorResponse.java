package com.assistencia.backend.exception;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(int status, String mensagem, List<String> detalhes, LocalDateTime timestamp) {

    public static ErrorResponse criar(int status, String mensagem) {
        return new ErrorResponse(status, mensagem, List.of(), LocalDateTime.now());
    }

    public static ErrorResponse criar(int status, String mensagem, List<String> detalhes) {
        return new ErrorResponse(status, mensagem, detalhes, LocalDateTime.now());
    }
}
