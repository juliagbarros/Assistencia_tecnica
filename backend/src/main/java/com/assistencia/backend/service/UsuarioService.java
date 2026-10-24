package com.assistencia.backend.service;


import com.assistencia.backend.dto.UsuarioRequest;
import com.assistencia.backend.dto.UsuarioResponse;
import com.assistencia.backend.dto.UsuarioUpdateRequest;
import com.assistencia.backend.exception.BusinessException;
import com.assistencia.backend.exception.InvalidCredentialsException;
import com.assistencia.backend.exception.ResourceNotFindException;
import com.assistencia.backend.model.Usuario;
import com.assistencia.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario salvar(UsuarioRequest dados){
        if (usuarioRepository.existsByEmail(dados.getEmail())) {
            throw new BusinessException("E-mail já cadastrado!");
        }
        Usuario usuario = new Usuario();
        usuario.setNome(dados.getNome());
        usuario.setEmail(dados.getEmail());
        usuario.setSenha(passwordEncoder.encode(dados.getSenha()));
        usuario.setPerfil(dados.getPerfil());
        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElseThrow( ()->new ResourceNotFindException("Usuário não encontrado") );
    }

    @Transactional
    public Usuario atualizar(Long id, UsuarioUpdateRequest dados){
        Usuario usuario = buscarPorId(id);
        if (!usuario.getEmail().equals(dados.getEmail())
                && usuarioRepository.existsByEmail(dados.getEmail())) {
            throw new BusinessException("E-mail já cadastrado!");
        }
        usuario.setNome(dados.getNome());
        usuario.setEmail(dados.getEmail());
        usuario.setPerfil(dados.getPerfil());
        if (dados.getSenha() != null && !dados.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dados.getSenha()));
        }
        return usuario;
    }

    @Transactional(readOnly = true)
    public List<Usuario> buscarTodos(){
        return usuarioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Usuario autenticar(String email, String senha){
        Usuario usuario = usuarioRepository.findByEmail(email) .orElseThrow(InvalidCredentialsException::new);
        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new InvalidCredentialsException();
        }
        return usuario;
    }

    @Transactional
    public void excluir(Long id){
        usuarioRepository.delete(buscarPorId(id));
    }


}
