package com.assistencia.backend.service;
import com.assistencia.backend.exception.BusinessException;
import com.assistencia.backend.exception.ResourceNotFindException;
import com.assistencia.backend.model.Tecnico;
import com.assistencia.backend.repository.AgendamentoRepository;
import com.assistencia.backend.repository.OrdemServicoRepository;
import com.assistencia.backend.repository.TecnicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TecnicoService {
    private final TecnicoRepository tecnicoRepository;
    private final OrdemServicoRepository ordemRepository;
    private final AgendamentoRepository agendamentoRepository;

    @Transactional
    public Tecnico salvar(Tecnico tecnico) {
        return tecnicoRepository.save(tecnico);
    }

    @Transactional(readOnly = true)
    public Tecnico buscarPorId(Long id) {
        return tecnicoRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("Tecnico não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Tecnico> buscarTodos() {
        return tecnicoRepository.findAll();
    }

    @Transactional
    public Tecnico atualizar(Long id, Tecnico dados) {
        Tecnico tecnico = buscarPorId(id);
        tecnico.setNome(dados.getNome());
        tecnico.setTelefone(dados.getTelefone());
        tecnico.setEspecialidade(dados.getEspecialidade());
        tecnico.setAtivo(dados.isAtivo());
        return tecnico;
    }

    @Transactional
    public void excluir(Long id) {
        Tecnico tecnico = buscarPorId(id);
        if (ordemRepository.existsByTecnicoId(id)) {
            throw new BusinessException("Não é possível excluir: o técnico possui ordens vinculadas");
        }
        if (agendamentoRepository.existsByTecnicoId(id)) {
            throw new BusinessException("Não é possível excluir: o técnico possui agendamentos vinculados");
        }
        tecnicoRepository.delete(tecnico);
    }
}
