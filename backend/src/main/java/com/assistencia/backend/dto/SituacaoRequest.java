package com.assistencia.backend.dto;

import com.assistencia.backend.model.SituacaoOrdem;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SituacaoRequest {
    @NotNull(message = "Obrigatório informar o status")
    private SituacaoOrdem status;
}
