package com.assistencia.backend.controller;

import com.assistencia.backend.model.Tecnico;
import com.assistencia.backend.service.TecnicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tecnicos")
@RequiredArgsConstructor
public class TecnicoController {

    private final TecnicoService tecnicoService;

    @PostMapping
    public ResponseEntity<Tecnico> create (@Valid @RequestBody Tecnico tecnico){
    Tecnico novo= tecnicoService.salvar(tecnico);
    return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @GetMapping
    public ResponseEntity<List<Tecnico>> getAll(){
        List<Tecnico> tecnicos = tecnicoService.buscarTodos();
        return ResponseEntity.ok(tecnicos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tecnico> getById(@PathVariable Long id){
        Tecnico buscado= tecnicoService.buscarPorId(id);
        return ResponseEntity.ok(buscado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tecnico> update(@PathVariable Long id, @Valid @RequestBody Tecnico tecnico){
        Tecnico atualizado= tecnicoService.atualizar(id, tecnico);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Tecnico> delete(@PathVariable Long id){
        tecnicoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}
