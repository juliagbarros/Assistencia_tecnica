package com.assistencia.backend.controller;

import com.assistencia.backend.dto.OrdemRequest;
import com.assistencia.backend.dto.OrdemResponse;
import com.assistencia.backend.dto.OrdemUpdateRequest;
import com.assistencia.backend.dto.SituacaoRequest;
import com.assistencia.backend.model.OrdemServico;
import com.assistencia.backend.model.SituacaoOrdem;
import com.assistencia.backend.service.OrdemServicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordens")
@RequiredArgsConstructor
public class OrdemServicoController {
    private final OrdemServicoService ordemService;

    @PostMapping
    public ResponseEntity<OrdemResponse> abrir(@Valid @RequestBody OrdemRequest dados) {
        OrdemServico criada = ordemService.abrir(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(montar(criada));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdemResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(montar(ordemService.buscarPorId(id)));
    }

    @GetMapping
    public ResponseEntity<List<OrdemResponse>> listar(@RequestParam(required = false, name = "status") SituacaoOrdem situacao, @RequestParam(required = false) Long tecnicoId, @RequestParam(required = false) String cliente) {
        List<OrdemResponse> lista = ordemService.buscar(situacao, tecnicoId, cliente).stream().map(this::montar).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdemResponse> update(@PathVariable Long id, @Valid @RequestBody OrdemUpdateRequest dados) {
        return ResponseEntity.ok(montar(ordemService.atualizar(id, dados)));
    }

    @PatchMapping("/{id}/situacao")
    public ResponseEntity<OrdemResponse> alterarSituacao(@PathVariable Long id, @Valid @RequestBody SituacaoRequest dados) {
        return ResponseEntity.ok(montar(ordemService.alterarSituacao(id, dados.getStatus())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ordemService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    private OrdemResponse montar(OrdemServico ordem) {
        return new OrdemResponse(ordem, ordemService.calcularTotal(ordem.getId()));
    }
}
