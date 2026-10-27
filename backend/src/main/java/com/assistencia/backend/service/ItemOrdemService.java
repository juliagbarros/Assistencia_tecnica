package com.assistencia.backend.service;
import com.assistencia.backend.dto.ItemOrdemRequest;
import com.assistencia.backend.exception.BusinessException;
import com.assistencia.backend.exception.ResourceNotFindException;
import com.assistencia.backend.model.ItemOrdem;
import com.assistencia.backend.model.OrdemServico;
import com.assistencia.backend.model.Servico;
import com.assistencia.backend.model.SituacaoOrdem;
import com.assistencia.backend.repository.ItemOrdemRepository;
import com.assistencia.backend.repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemOrdemService {
    private final ItemOrdemRepository itemRepository;
    private final ServicoRepository servicoRepository;
    private final OrdemServicoService ordemService;

    @Transactional
    public ItemOrdem adicionar(Long ordemId, ItemOrdemRequest dados) {
        OrdemServico ordem = ordemService.buscarPorId(ordemId);
        validarAlteracao(ordem);
        Servico servico = buscarServicoAtivo(dados.getServicoId());

        ItemOrdem item = new ItemOrdem();
        item.setOrdem(ordem);
        copiar(item, servico, dados);
        return itemRepository.save(item);
    }

    @Transactional(readOnly = true)
    public List<ItemOrdem> listar(Long ordemId) {
        ordemService.buscarPorId(ordemId);
        return itemRepository.findByOrdemId(ordemId);
    }

    @Transactional(readOnly = true)
    public ItemOrdem buscar(Long ordemId, Long itemId) {
        ItemOrdem item = itemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFindException("Item não encontrado"));
        if (!item.getOrdem().getId().equals(ordemId)) {
            throw new ResourceNotFindException("Item não encontrado nesta ordem");
        }
        return item;
    }

    @Transactional
    public ItemOrdem atualizar(Long ordemId, Long itemId, ItemOrdemRequest dados) {
        ItemOrdem item = buscar(ordemId, itemId);
        validarAlteracao(item.getOrdem());
        Servico servico = buscarServicoAtivo(dados.getServicoId());
        copiar(item, servico, dados);
        return item;
    }

    @Transactional
    public void excluir(Long ordemId, Long itemId) {
        ItemOrdem item = buscar(ordemId, itemId);
        validarAlteracao(item.getOrdem());
        itemRepository.delete(item);
    }

    private void validarAlteracao(OrdemServico ordem) {
        SituacaoOrdem status = ordem.getSituacao();
        if (status != SituacaoOrdem.Aberta && status != SituacaoOrdem.Em_analise) {
            throw new BusinessException("Os itens só podem ser alterados com a ordem em Aberta ou Em_analise. " + "Para revisar o orçamento, volte a ordem para Em_analise");
        }
    }

    private Servico buscarServicoAtivo(Long servicoId) {
        Servico servico = servicoRepository.findById(servicoId).orElseThrow(() -> new ResourceNotFindException("Serviço não encontrado"));
        if (!servico.isAtivo()) {
            throw new BusinessException("O serviço está inativo e não pode ser adicionado");
        }
        return servico;
    }

    private void copiar(ItemOrdem item, Servico servico, ItemOrdemRequest dados) {
        item.setServico(servico);
        item.setQuantidade(dados.getQuantidade());
        if (dados.getPrecoUnitario() == null) {
            item.setPrecoUnitario(servico.getPrecoPadrao());
        } else {
            item.setPrecoUnitario(dados.getPrecoUnitario());
        }
    }
}
