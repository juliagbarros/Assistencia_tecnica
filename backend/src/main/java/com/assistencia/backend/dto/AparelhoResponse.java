package com.assistencia.backend.dto;

import com.assistencia.backend.model.Aparelho;
import lombok.Getter;

@Getter
public class AparelhoResponse {
    private final Long id;
    private final Long clienteId;
    private final String clienteNome;
    private final String tipo;
    private final String marca;
    private final String modelo;
    private final String numeroSerie;
    private final String observacoes;

    public AparelhoResponse(Aparelho aparelho) {
        this.id = aparelho.getId();
        this.clienteId = aparelho.getCliente().getId();
        this.clienteNome = aparelho.getCliente().getNome();
        this.tipo = aparelho.getTipo();
        this.marca = aparelho.getMarca();
        this.modelo = aparelho.getModelo();
        this.numeroSerie = aparelho.getNumeroSerie();
        this.observacoes = aparelho.getObservacoes();
    }
}
