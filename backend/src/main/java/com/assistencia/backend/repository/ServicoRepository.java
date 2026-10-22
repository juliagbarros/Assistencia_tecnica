package com.assistencia.backend.repository;

import com.assistencia.backend.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicoRepository extends JpaRepository <Servico, Long> {
    List<Servico> findByNomeContainingIgnoreCase(String nome);
}
