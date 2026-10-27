package com.assistencia.backend.repository;

import com.assistencia.backend.model.Agendamento;
import com.assistencia.backend.model.SituacaoAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    boolean existsByClienteId(Long clienteId);
    boolean existsByTecnicoId(Long tecnicoId);
    List<Agendamento> findByTecnicoIdAndSituacao(Long tecnicoId, SituacaoAgendamento situacao);
}
