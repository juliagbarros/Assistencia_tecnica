package com.assistencia.backend.service;

import com.assistencia.backend.exception.ResourceNotFindException;
import com.assistencia.backend.model.Servico;
import com.assistencia.backend.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicoService {
    private final ServicoRepository servicoRepository;

    @Transactional
    public Servico salvar(Servico servico) {
        return servicoRepository.save(servico);
    }

    @Transactional(readOnly = true)
    public Servico buscarPorId(Long id) {
        return servicoRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("Servico não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Servico> buscar(String nome){
        if (nome==null || nome.isBlank()){
            return servicoRepository.findAll();
        }
        return servicoRepository.findByNomeContainingIgnoreCase(nome);
    }

    @Transactional
    public Servico atualizar(Long id, Servico dados) {
        Servico servico = buscarPorId(id);
        servico.setNome(dados.getNome());
        servico.setDescricao(dados.getDescricao());
        servico.setPrecoPadrao(dados.getPrecoPadrao());
        servico.setAtivo(dados.isAtivo());
        return servico;
    }

    @Transactional
    public void excluir(Long id) {
        servicoRepository.delete(buscarPorId(id));
    }

}
