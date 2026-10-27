package com.assistencia.backend.service;

import com.assistencia.backend.dto.OrdemRequest;
import com.assistencia.backend.dto.OrdemUpdateRequest;
import com.assistencia.backend.exception.BusinessException;
import com.assistencia.backend.exception.ResourceNotFindException;
import com.assistencia.backend.model.Aparelho;
import com.assistencia.backend.model.OrdemServico;
import com.assistencia.backend.model.SituacaoOrdem;
import com.assistencia.backend.model.Tecnico;
import com.assistencia.backend.repository.AparelhoRepository;
import com.assistencia.backend.repository.ItemOrdemRepository;
import com.assistencia.backend.repository.OrdemServicoRepository;
import com.assistencia.backend.repository.TecnicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdemServicoService {
    private final OrdemServicoRepository ordemRepository;
    private final AparelhoRepository aparelhoRepository;
    private final TecnicoRepository tecnicoRepository;
    private final ItemOrdemRepository itemRepository;

    @Transactional
    public OrdemServico abrir(OrdemRequest dados) {
        Aparelho aparelho = aparelhoRepository.findById(dados.getAparelhoId()).orElseThrow(() -> new ResourceNotFindException("Aparelho não encontrado"));
        Tecnico tecnico = buscarTecnicoAtivo(dados.getTecnicoId());
        List<OrdemServico> ordensAparelho = ordemRepository.findByAparelhoId(aparelho.getId());
        for (int i = 0; i < ordensAparelho.size(); i++) {
            OrdemServico existente = ordensAparelho.get(i);
            if (!encerrada(existente.getSituacao())) {
                throw new BusinessException("Este aparelho já possui uma ordem em andamento");
            }
        }

        OrdemServico ordem = new OrdemServico();
        ordem.setAparelho(aparelho);
        ordem.setTecnico(tecnico);
        ordem.setDefeitoRelatado(dados.getDefeitoRelatado());
        ordem.setSituacao(SituacaoOrdem.Aberta);
        ordem.setDataAbertura(LocalDateTime.now());
        return ordemRepository.save(ordem);
    }

    @Transactional(readOnly = true)
    public OrdemServico buscarPorId(Long id) {
        return ordemRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("Ordem de serviço não encontrada"));
    }

    @Transactional(readOnly = true)
    public List<OrdemServico> buscar(SituacaoOrdem situacao, Long tecnicoId, String cliente) {
        return ordemRepository.buscar(situacao, tecnicoId, cliente == null ? "" : cliente.trim());
    }

    @Transactional
    public OrdemServico atualizar(Long id, OrdemUpdateRequest dados) {
        OrdemServico ordem = buscarPorId(id);
        if (encerrada(ordem.getSituacao())) {
            throw new BusinessException("Não é possível editar uma ordem encerrada");
        }
        if (!ordem.getTecnico().getId().equals(dados.getTecnicoId())) {
            ordem.setTecnico(buscarTecnicoAtivo(dados.getTecnicoId()));
        }
        ordem.setDefeitoRelatado(dados.getDefeitoRelatado());
        ordem.setDiagnostico(dados.getDiagnostico());
        return ordem;
    }

    @Transactional
    public OrdemServico alterarSituacao(Long id, SituacaoOrdem destino) {
        OrdemServico ordem = buscarPorId(id);
        SituacaoOrdem atual = ordem.getSituacao();
        if (!irPara(atual,destino)) {
            throw new BusinessException("Transição inválida: de " + atual + " para " + destino);
        }

        if (destino == SituacaoOrdem.Aguardando_aprovacao) {
            if (ordem.getDiagnostico() == null || ordem.getDiagnostico().isBlank()) {
                throw new BusinessException("Coloque o diagnóstico do produto antes");
            }
            if (!itemRepository.existsByOrdemId(ordem.getId())) {
                throw new BusinessException("Adicione pelo menos um item antes de solicitar a aprovação");
            }
        }

        ordem.setSituacao(destino);
        if (destino == SituacaoOrdem.Concluida) {
            ordem.setDataConclusao(LocalDateTime.now());
        }
        if (destino == SituacaoOrdem.Entregue) {
            ordem.setDataEntrega(LocalDateTime.now());
        }
        return ordem;
    }

    @Transactional
    public void excluir(Long id) {
        OrdemServico ordem = buscarPorId(id);
        if (ordem.getSituacao() != SituacaoOrdem.Aberta) {
            throw new BusinessException("Não é possível excluir esta ordem pois o status não está em Aberto");
        }
        if (itemRepository.existsByOrdemId(id)) {
            throw new BusinessException("Não é possível excluir uma ordem que possui itens");
        }
        ordemRepository.delete(ordem);
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularTotal(Long ordemId) {
        BigDecimal total = itemRepository.somarTotal(ordemId);
        return total == null ? BigDecimal.ZERO : total;
    }

    private Tecnico buscarTecnicoAtivo(Long tecnicoId) {
        Tecnico tecnico = tecnicoRepository.findById(tecnicoId).orElseThrow(() -> new ResourceNotFindException("Técnico não encontrado"));
        if (!tecnico.isAtivo()) {
            throw new BusinessException("O técnico está inativo");
        }
        return tecnico;
    }
    private boolean irPara(SituacaoOrdem atual, SituacaoOrdem destino) {
        if (atual == SituacaoOrdem.Aberta) {
            return destino == SituacaoOrdem.Em_analise || destino == SituacaoOrdem.Cancelada;
        } else if (atual == SituacaoOrdem.Em_analise) {
            return destino == SituacaoOrdem.Aguardando_aprovacao || destino == SituacaoOrdem.Cancelada;
        } else if (atual == SituacaoOrdem.Aguardando_aprovacao) {
            return destino == SituacaoOrdem.Em_execucao || destino == SituacaoOrdem.Em_analise || destino == SituacaoOrdem.Cancelada;
        } else if (atual == SituacaoOrdem.Em_execucao) {
            return destino == SituacaoOrdem.Concluida;
        } else if (atual == SituacaoOrdem.Concluida) {
            return destino == SituacaoOrdem.Entregue;
        } else {
            return false;
        }
    }
    private boolean encerrada(SituacaoOrdem situacao) {
        return situacao == SituacaoOrdem.Entregue || situacao == SituacaoOrdem.Cancelada;
    }
}
