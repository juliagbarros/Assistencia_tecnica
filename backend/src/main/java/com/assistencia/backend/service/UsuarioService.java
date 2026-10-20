package com.assistencia.backend.service;


import com.assistencia.backend.model.Usuario;
import com.assistencia.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Usuario salvar(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElseThrow( ()->new RuntimeException("Usuário não encontrado") );
    }

    @Transactional
    public Usuario editarSenha(Long id, String senha){
        Usuario user= buscarPorId(id);
        user.setSenha(senha);
        return user;
    }

    @Transactional(readOnly = true)
    public List<Usuario> buscarTodos(){
        return usuarioRepository.findAll();
    }


}
