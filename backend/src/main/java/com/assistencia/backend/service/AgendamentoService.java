package com.assistencia.backend.service;

import com.assistencia.backend.dto.AgendamentoRequest;
import com.assistencia.backend.exception.BusinessException;
import com.assistencia.backend.exception.ResourceNotFindException;
import com.assistencia.backend.model.Agendamento;
import com.assistencia.backend.model.Cliente;
import com.assistencia.backend.model.SituacaoAgendamento;
import com.assistencia.backend.model.Tecnico;
import com.assistencia.backend.repository.AgendamentoRepository;
import com.assistencia.backend.repository.ClienteRepository;
import com.assistencia.backend.repository.TecnicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgendamentoService {
    private final AgendamentoRepository agendamentoRepository;
    private final ClienteRepository clienteRepository;
    private final TecnicoRepository tecnicoRepository;

    @Transactional
    public Agendamento criar(AgendamentoRequest dados) {
        Cliente cliente = clienteRepository.findById(dados.getClienteId()).orElseThrow(() -> new ResourceNotFindException("Cliente não encontrado"));
        Tecnico tecnico = buscarTecnicoAtivo(dados.getTecnicoId());
        validarHorario(dados, null);
        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setTecnico(tecnico);
        agendamento.setSituacao(SituacaoAgendamento.Agendado);
        copiar(agendamento, dados);
        return agendamentoRepository.save(agendamento);
    }

    @Transactional(readOnly = true)
    public Agendamento buscarPorId(Long id) {
        return agendamentoRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("Agendamento não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Agendamento> buscar(SituacaoAgendamento situacao, Long tecnicoId, Long clienteId, LocalDate data) {
        List<Agendamento> todos = agendamentoRepository.findAll(Sort.by("inicio"));
        List<Agendamento> resultado = new ArrayList<>();
        for (int i = 0; i < todos.size(); i++) {
            Agendamento agendamento = todos.get(i);
            if (situacao != null && agendamento.getSituacao() != situacao) {
                continue; }
            if (tecnicoId != null && !agendamento.getTecnico().getId().equals(tecnicoId)) {
                continue;}
            if (clienteId != null && !agendamento.getCliente().getId().equals(clienteId)) {
                continue;}
            if (data != null && !agendamento.getInicio().toLocalDate().equals(data)) {
                continue;}
            resultado.add(agendamento);
        }
        return resultado;
    }

    @Transactional
    public Agendamento atualizar(Long id, AgendamentoRequest dados) {
        Agendamento agendamento = buscarPorId(id);
        if (agendamento.getSituacao() != SituacaoAgendamento.Agendado) {
            throw new BusinessException("Só é possível editar um agendamento na situação AGENDADO");
        }
        Cliente cliente = clienteRepository.findById(dados.getClienteId()).orElseThrow(() -> new ResourceNotFindException("Cliente não encontrado"));
        if (!agendamento.getTecnico().getId().equals(dados.getTecnicoId())) {
            agendamento.setTecnico(buscarTecnicoAtivo(dados.getTecnicoId()));
        }
        validarHorario(dados, id);
        agendamento.setCliente(cliente);
        copiar(agendamento, dados);
        return agendamento;
    }

    @Transactional
    public Agendamento alterarSituacao(Long id, SituacaoAgendamento destino) {
        Agendamento agendamento = buscarPorId(id);
        if (agendamento.getSituacao() != SituacaoAgendamento.Agendado) {
            throw new BusinessException("Este agendamento já foi finalizado e não pode mudar de situação");
        }
        if (destino != SituacaoAgendamento.Realizado && destino != SituacaoAgendamento.Cancelado) {
            throw new BusinessException("Só é possível marcar como REALIZADO ou CANCELADO");
        }
        agendamento.setSituacao(destino);
        return agendamento;
    }

    @Transactional
    public void excluir(Long id) {
        Agendamento agendamento = buscarPorId(id);
        if (agendamento.getSituacao() != SituacaoAgendamento.Agendado) {
            throw new BusinessException("Só é possível excluir um agendamento na situação AGENDADO");
        }
        agendamentoRepository.delete(agendamento);
    }

    private Tecnico buscarTecnicoAtivo(Long tecnicoId) {
        Tecnico tecnico = tecnicoRepository.findById(tecnicoId).orElseThrow(() -> new ResourceNotFindException("Técnico não encontrado"));
        if (!tecnico.isAtivo()) {
            throw new BusinessException("O técnico está inativo");
        }
        return tecnico;
    }

    private void validarHorario(AgendamentoRequest dados, Long ignorarId) {
        if (!dados.getFim().isAfter(dados.getInicio())) {
            throw new BusinessException("O horário final deve ser posterior ao inicial");
        }
        List<Agendamento> doTecnico = agendamentoRepository.findByTecnicoIdAndSituacao(dados.getTecnicoId(), SituacaoAgendamento.Agendado);
        for (Agendamento existente : doTecnico) {
            if (ignorarId != null && existente.getId().equals(ignorarId)) {
                continue;
            }
            boolean seCruzam = existente.getInicio().isBefore(dados.getFim())
                    && existente.getFim().isAfter(dados.getInicio());
            if (seCruzam) {
                throw new BusinessException("O técnico já possui um agendamento neste horário");
            }
        }
    }

    private void copiar(Agendamento agendamento, AgendamentoRequest dados) {
        agendamento.setInicio(dados.getInicio());
        agendamento.setFim(dados.getFim());
        agendamento.setMotivo(dados.getMotivo());
    }
}

