package com.assistencia.backend.service;


import com.assistencia.backend.exception.BusinessException;
import com.assistencia.backend.exception.ResourceNotFindException;
import com.assistencia.backend.model.Cliente;
import com.assistencia.backend.repository.AgendamentoRepository;
import com.assistencia.backend.repository.AparelhoRepository;
import com.assistencia.backend.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final AparelhoRepository aparelhoRepository;
    private final AgendamentoRepository agendamentoRepository;


    @Transactional
    public Cliente salvar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Transactional(readOnly = true)
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("Cliente não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Cliente> buscarTodos() {
        return clienteRepository.findAll();
    }

    @Transactional
    public Cliente atualizar(Long id, Cliente dados) {
        Cliente cliente = buscarPorId(id);
        cliente.setNome(dados.getNome());
        cliente.setTelefone(dados.getTelefone());
        cliente.setEmail(dados.getEmail());
        return cliente;
    }

    @Transactional
    public void excluir(Long id) {
        Cliente cliente = buscarPorId(id);
        if (aparelhoRepository.existsByClienteId(id)) {
            throw new BusinessException("Não é possível excluir agora pois o cliente possui aparelhos vinculados à ele.");
        }
        if (agendamentoRepository.existsByClienteId(id)) {
            throw new BusinessException("Não é possível excluir agora pois o cliente possui agendamentos vinculados");
        }
        clienteRepository.delete(cliente);
    }

}
