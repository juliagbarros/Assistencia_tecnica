package com.assistencia.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AparelhoRequest {
    @NotNull(message = "Obrigatório informar o cliente")
    private Long clienteId;

    @NotBlank(message = "Obrigatório informar o tipo do aparelho")
    @Size(max = 50, message = "O tipo deve ter no máximo 50 caracteres")
    private String tipo;

    @NotBlank(message = "Obrigatório informar a marca")
    @Size(max = 100, message = "A marca deve ter no máximo 100 caracteres")
    private String marca;

    @NotBlank(message = "Obrigatório informar o modelo")
    @Size(max = 100, message = "O modelo deve ter no máximo 100 caracteres")
    private String modelo;

    @Size(max = 100, message = "O número de série deve ter no máximo 100 caracteres")
    private String numeroSerie;

    private String observacoes;
}
