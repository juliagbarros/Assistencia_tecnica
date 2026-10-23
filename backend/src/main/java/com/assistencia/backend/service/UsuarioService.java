package com.assistencia.backend.service;


import com.assistencia.backend.exception.ResourceNotFindException;
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
        return usuarioRepository.findById(id).orElseThrow( ()->new ResourceNotFindException("Usuário não encontrado") );
    }

    @Transactional
    public Usuario editarSenha(Long id, String senha){
        Usuario user= buscarPorId(id);
        user.setSenha(senha);
        return user;
    }

    @Transactional
    public Usuario atualizar(Long id, Usuario dados){
        Usuario user=buscarPorId(id);
        user.setNome(dados.getNome());
        user.setEmail(dados.getEmail());
        user.setPerfil(dados.getPerfil());
        return user;
    }

    @Transactional(readOnly = true)
    public List<Usuario> buscarTodos(){
        return usuarioRepository.findAll();
    }


    @Transactional(readOnly = true)
    public Usuario buscarUsuarioEmail(String email){
        return usuarioRepository.findByEmail(email).orElseThrow( () -> new ResourceNotFindException("Email não encontrado") );

    }

    @Transactional
    public void excluir(Long id){
        usuarioRepository.delete(buscarPorId(id));
    }


}
