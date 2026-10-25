package com.assistencia.backend.controller;

import com.assistencia.backend.dto.AparelhoRequest;
import com.assistencia.backend.dto.AparelhoResponse;
import com.assistencia.backend.model.Aparelho;
import com.assistencia.backend.service.AparelhoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aparelhos")
@RequiredArgsConstructor
public class AparelhoController {
    private final AparelhoService aparelhoService;

    @PostMapping
    public ResponseEntity<AparelhoResponse> create(@Valid @RequestBody AparelhoRequest dados) {
        Aparelho criado = aparelhoService.salvar(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AparelhoResponse(criado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AparelhoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(new AparelhoResponse(aparelhoService.buscarPorId(id)));
    }

    @GetMapping
    public ResponseEntity<List<AparelhoResponse>> listar(@RequestParam(required = false) String busca, @RequestParam(required = false) Long clienteId) {
        List<AparelhoResponse> lista = aparelhoService.buscar(busca, clienteId).stream().map(AparelhoResponse::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AparelhoResponse> update(@PathVariable Long id, @Valid @RequestBody AparelhoRequest dados) {
        return ResponseEntity.ok(new AparelhoResponse(aparelhoService.atualizar(id, dados)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        aparelhoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
