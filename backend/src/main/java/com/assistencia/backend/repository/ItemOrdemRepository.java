package com.assistencia.backend.repository;
import com.assistencia.backend.model.ItemOrdem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ItemOrdemRepository extends JpaRepository<ItemOrdem, Long> {
    List<ItemOrdem> findByOrdemId(Long ordemId);
    boolean existsByOrdemId(Long ordemId);
    boolean existsByServicoId(Long servicoId);
    @Query("SELECT SUM(item.quantidade * item.precoUnitario) FROM ItemOrdem item WHERE item.ordem.id = :ordemId")
    BigDecimal somarTotal(@Param("ordemId") Long ordemId);
}
