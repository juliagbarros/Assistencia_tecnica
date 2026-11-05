package com.assistencia.backend.dto;

import com.assistencia.backend.model.SituacaoOrdem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrdemUpdateRequest {
    @NotNull(message = "Obrigatório informar o técnico")
    private Long tecnicoId;

    @NotBlank(message = "Obrigatório informar o defeito relatado")
    private String defeitoRelatado;

    private String diagnostico;

    @NotNull(message = "Obrigatório informar a situação")
    private SituacaoOrdem situacao;
}
