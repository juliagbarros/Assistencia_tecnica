package com.assistencia.backend.dto;
import com.assistencia.backend.model.ItemOrdem;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class ItemOrdemResponse {
    private final Long id;
    private final Long ordemId;
    private final Long servicoId;
    private final String servicoNome;
    private final Integer quantidade;
    private final BigDecimal precoUnitario;
    private final BigDecimal subtotal;

    public ItemOrdemResponse(ItemOrdem item){
        this.id = item.getId();
        this.ordemId = item.getOrdem().getId();
        this.servicoId = item.getServico().getId();
        this.servicoNome = item.getServico().getNome();
        this.quantidade = item.getQuantidade();
        this.precoUnitario = item.getPrecoUnitario();
        this.subtotal = item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade()));
    }
}
