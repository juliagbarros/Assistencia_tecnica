package com.assistencia.backend.dto;
import com.assistencia.backend.model.OrdemServico;
import com.assistencia.backend.model.SituacaoOrdem;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
public class OrdemResponse {
    private final Long id;
    private final Long aparelhoId;
    private final String aparelho;
    private final Long clienteId;
    private final String clienteNome;
    private final Long tecnicoId;
    private final String tecnicoNome;
    private final String defeitoRelatado;
    private final String diagnostico;
    private final SituacaoOrdem status;
    private final LocalDateTime dataAbertura;
    private final LocalDateTime dataConclusao;
    private final LocalDateTime dataEntrega;
    private final BigDecimal total;

    public OrdemResponse (OrdemServico ordem, BigDecimal total){
        this.id = ordem.getId();
        this.aparelhoId = ordem.getAparelho().getId();
        this.aparelho = ordem.getAparelho().getMarca() + " " + ordem.getAparelho().getModelo();
        this.clienteId = ordem.getAparelho().getCliente().getId();
        this.clienteNome = ordem.getAparelho().getCliente().getNome();
        this.tecnicoId = ordem.getTecnico().getId();
        this.tecnicoNome = ordem.getTecnico().getNome();
        this.defeitoRelatado = ordem.getDefeitoRelatado();
        this.diagnostico = ordem.getDiagnostico();
        this.status = ordem.getSituacao();
        this.dataAbertura = ordem.getDataAbertura();
        this.dataConclusao = ordem.getDataConclusao();
        this.dataEntrega = ordem.getDataEntrega();
        this.total = total;
    }
}
