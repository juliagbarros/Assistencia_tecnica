package com.assistencia.backend.messaging.event;
import com.assistencia.backend.model.SituacaoOrdem;

import java.time.LocalDateTime;

public record OrdemSituacaoAlteradaEvent(Long ordemId, String clienteNome, String clienteEmail, String aparelho, SituacaoOrdem situacaoAnterior, SituacaoOrdem situacaoAtual, LocalDateTime dataAlteracao
) {
}
