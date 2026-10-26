package com.assistencia.backend.repository;

import com.assistencia.backend.model.Tecnico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TecnicoRepository extends JpaRepository <Tecnico, Long> {
}
