package com.assistencia.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AgendamentoRequest {
    @NotNull(message = "Obrigatório informar o cliente")
    private Long clienteId;

    @NotNull(message = "Obrigatório informar o técnico")
    private Long tecnicoId;

    @NotNull(message = "Obrigatório informar o início")
    private LocalDateTime inicio;

    @NotNull(message = "Obrigatório informar o fim")
    private LocalDateTime fim;

    @NotBlank(message = "Obrigatório informar o motivo")
    private String motivo;
}
