package com.assistencia.backend.controller;

import com.assistencia.backend.dto.UsuarioRequest;
import com.assistencia.backend.dto.UsuarioResponse;
import com.assistencia.backend.dto.UsuarioUpdateRequest;
import com.assistencia.backend.model.Usuario;
import com.assistencia.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponse> create (@Valid @RequestBody UsuarioRequest dados) {
        Usuario user = usuarioService.salvar(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UsuarioResponse(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> getById (@PathVariable Long id) {
        return ResponseEntity.ok(new UsuarioResponse(usuarioService.buscarPorId(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> update(@PathVariable Long id, @Valid @RequestBody UsuarioUpdateRequest dados){
        return ResponseEntity.ok(new UsuarioResponse(usuarioService.atualizar(id, dados)));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> getAll () {
        List<UsuarioResponse> users = usuarioService.buscarTodos().stream().map(UsuarioResponse::new).toList();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        usuarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }


}
