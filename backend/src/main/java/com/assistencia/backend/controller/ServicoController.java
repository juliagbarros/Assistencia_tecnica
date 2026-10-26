package com.assistencia.backend.controller;

import com.assistencia.backend.model.Servico;
import com.assistencia.backend.service.ServicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@RequiredArgsConstructor
public class ServicoController {

    private final ServicoService servicoService;

    @PostMapping
    public ResponseEntity<Servico> create(@Valid @RequestBody Servico servico){
        Servico novo= servicoService.salvar(servico);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servico> getById(@PathVariable Long id){
        Servico buscado = servicoService.buscarPorId(id);
        return ResponseEntity.ok(buscado);
    }

    @GetMapping
    public ResponseEntity<List<Servico>> listar(@RequestParam(required = false) String nome) {
        return ResponseEntity.ok(servicoService.buscar(nome));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servico> update(@PathVariable Long id, @Valid @RequestBody Servico servico) {
        Servico atualizado = servicoService.atualizar(id, servico);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        servicoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}
