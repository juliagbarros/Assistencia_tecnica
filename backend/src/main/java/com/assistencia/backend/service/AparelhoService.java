package com.assistencia.backend.service;

import com.assistencia.backend.dto.AparelhoRequest;
import com.assistencia.backend.exception.BusinessException;
import com.assistencia.backend.exception.ResourceNotFindException;
import com.assistencia.backend.model.Aparelho;
import com.assistencia.backend.model.Cliente;
import com.assistencia.backend.repository.AparelhoRepository;
import com.assistencia.backend.repository.ClienteRepository;
import com.assistencia.backend.repository.OrdemServicoRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AparelhoService {
    private final AparelhoRepository aparelhoRepository;
    private final ClienteRepository clienteRepository;
    private final OrdemServicoRepository ordemRepository;

    @Transactional
    public Aparelho salvar(AparelhoRequest dados) {
        Cliente cliente = clienteRepository.findById(dados.getClienteId())
                .orElseThrow(() -> new ResourceNotFindException("Cliente não encontrado"));

        Aparelho aparelho = new Aparelho();
        aparelho.setCliente(cliente);
        copiar(aparelho, dados);
        return aparelhoRepository.save(aparelho);
    }

    @Transactional(readOnly = true)
    public Aparelho buscarPorId(Long id) {
        return aparelhoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFindException ("Aparelho não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Aparelho> buscar(String busca, Long clienteId) {
        if (clienteId != null) {
            return aparelhoRepository.findByClienteId(clienteId);
        }
        return aparelhoRepository.buscar(busca == null ? "" : busca.trim());
    }

    @Transactional
    public Aparelho atualizar(Long id, AparelhoRequest dados) {
        Aparelho aparelho = buscarPorId(id);
        Cliente cliente = clienteRepository.findById(dados.getClienteId())
                .orElseThrow(() -> new ResourceNotFindException("Cliente não encontrado"));
        aparelho.setCliente(cliente);
        copiar(aparelho, dados);
        return aparelho;
    }

    @Transactional
    public void excluir(Long id) {
        Aparelho aparelho = buscarPorId(id);
        if (ordemRepository.existsByAparelhoId(id)) {
            throw new BusinessException("Não é possível excluir o aparelho porque ele possui ordens de serviço vinculadas a ele");
        }
        aparelhoRepository.delete(aparelho);
    }

    private void copiar(Aparelho aparelho, AparelhoRequest dados) {
        aparelho.setTipo(dados.getTipo());
        aparelho.setMarca(dados.getMarca());
        aparelho.setModelo(dados.getModelo());
        aparelho.setNumeroSerie(dados.getNumeroSerie());
        aparelho.setObservacoes(dados.getObservacoes());
    }
}
