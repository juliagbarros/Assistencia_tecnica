package com.assistencia.backend.repository;

import com.assistencia.backend.model.OrdemServico;
import com.assistencia.backend.model.SituacaoOrdem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrdemServicoRepository extends JpaRepository <OrdemServico, Long> {

    boolean existsByAparelhoId(Long aparelhoId);
    boolean existsByTecnicoId(Long tecnicoId);
    List<OrdemServico> findByAparelhoId(Long aparelhoId);

    @Query("""
        SELECT ordem from OrdemServico ordem
        WHERE (:situacao is null or ordem.situacao = :situacao)
                and (:tecnicoId is null or ordem.tecnico.id = :tecnicoId)
                and lower(ordem.aparelho.cliente.nome) like lower(concat('%', :cliente, '%'))
                order by ordem.dataAbertura desc
            """)
    List<OrdemServico> buscar(@Param("situacao") SituacaoOrdem situacao, @Param("tecnicoId") Long tecnicoId, @Param("cliente") String cliente);
}
