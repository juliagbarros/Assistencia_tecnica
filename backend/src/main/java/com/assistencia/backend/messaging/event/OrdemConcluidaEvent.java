package com.assistencia.backend.messaging.event;
import java.time.LocalDateTime;

public record OrdemConcluidaEvent(Long ordemId, String clienteNome, String clienteEmail, String aparelho, LocalDateTime dataConclusao
) {
}
