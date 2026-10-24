package com.assistencia.backend.dto;

import com.assistencia.backend.model.Perfil;
import com.assistencia.backend.model.Usuario;
import lombok.Getter;

@Getter
public class UsuarioResponse{
    private final Long id;
    private final String nome;
    private final String email;
    private final Perfil perfil;

    public UsuarioResponse(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.perfil = usuario.getPerfil();
    }
}
