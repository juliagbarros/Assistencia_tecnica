package com.assistencia.backend.repository;

import com.assistencia.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository <Usuario,Long> {
}
