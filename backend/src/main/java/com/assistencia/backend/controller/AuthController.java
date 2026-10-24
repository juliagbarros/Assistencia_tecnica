package com.assistencia.backend.controller;

import com.assistencia.backend.dto.LoginRequest;
import com.assistencia.backend.dto.UsuarioResponse;
import com.assistencia.backend.model.Usuario;
import com.assistencia.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@Valid @RequestBody LoginRequest dados) {
        Usuario usuario = usuarioService.autenticar(dados.getEmail(), dados.getSenha());
        return ResponseEntity.ok(new UsuarioResponse(usuario));
    }
}
