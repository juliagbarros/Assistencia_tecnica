package com.assistencia.backend.repository;

import com.assistencia.backend.model.Aparelho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AparelhoRepository extends JpaRepository<Aparelho, Long> {

    boolean existsByClienteId(Long clienteId);
    List<Aparelho> findByClienteId(Long clienteId);

    @Query("""
        SELECT aparelho from Aparelho aparelho
        WHERE lower(aparelho.marca) like lower(concat('%', :busca, '%'))
           or lower(aparelho.modelo) like lower(concat('%', :busca, '%'))
           or lower(aparelho.numeroSerie) like lower(concat('%', :busca, '%'))
           or lower(aparelho.cliente.nome) like lower(concat('%', :busca, '%'))
        """)
    List<Aparelho> buscar(@Param("busca") String busca);
}
