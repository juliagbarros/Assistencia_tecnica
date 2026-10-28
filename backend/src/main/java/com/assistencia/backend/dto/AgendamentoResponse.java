package com.assistencia.backend.dto;

import com.assistencia.backend.model.Agendamento;
import com.assistencia.backend.model.SituacaoAgendamento;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AgendamentoResponse {
    private final Long id;
    private final Long clienteId;
    private final String clienteNome;
    private final Long tecnicoId;
    private final String tecnicoNome;
    private final LocalDateTime inicio;
    private final LocalDateTime fim;
    private final String motivo;
    private final SituacaoAgendamento status;

    public AgendamentoResponse(Agendamento agendamento) {
        this.id = agendamento.getId();
        this.clienteId = agendamento.getCliente().getId();
        this.clienteNome = agendamento.getCliente().getNome();
        this.tecnicoId = agendamento.getTecnico().getId();
        this.tecnicoNome = agendamento.getTecnico().getNome();
        this.inicio = agendamento.getInicio();
        this.fim = agendamento.getFim();
        this.motivo = agendamento.getMotivo();
        this.status = agendamento.getSituacao();
    }
}
