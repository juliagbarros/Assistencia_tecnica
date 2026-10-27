package com.assistencia.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class ItemOrdemRequest {
    @NotNull(message = "Obrigatório informar o serviço")
    private Long servicoId;

    @NotNull(message = "Obrigatório informar a quantidade")
    @Positive(message = "A quantidade deve ser maior que zero")
    private Integer quantidade;

    @PositiveOrZero(message = "O preço não pode ser negativo")
    private BigDecimal precoUnitario;
}
