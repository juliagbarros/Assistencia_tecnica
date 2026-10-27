package com.assistencia.backend.controller;

import com.assistencia.backend.dto.AgendamentoRequest;
import com.assistencia.backend.dto.AgendamentoResponse;
import com.assistencia.backend.dto.AgendamentoStatusRequest;
import com.assistencia.backend.model.Agendamento;
import com.assistencia.backend.model.SituacaoAgendamento;
import com.assistencia.backend.service.AgendamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {
    private final AgendamentoService agendamentoService;

    @PostMapping
    public ResponseEntity<AgendamentoResponse> create(@Valid @RequestBody AgendamentoRequest dados) {
        Agendamento criado = agendamentoService.criar(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AgendamentoResponse(criado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(new AgendamentoResponse(agendamentoService.buscarPorId(id)));
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponse>> listar(
            @RequestParam(required = false, name = "status") SituacaoAgendamento situacao,
            @RequestParam(required = false) Long tecnicoId,
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        List<AgendamentoResponse> lista = agendamentoService.buscar(situacao, tecnicoId, clienteId, data).stream().map(AgendamentoResponse::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoResponse> update(@PathVariable Long id, @Valid @RequestBody AgendamentoRequest dados) {
        return ResponseEntity.ok(new AgendamentoResponse(agendamentoService.atualizar(id, dados)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AgendamentoResponse> alterarStatus(@PathVariable Long id, @Valid @RequestBody AgendamentoStatusRequest dados) {
        return ResponseEntity.ok(new AgendamentoResponse(agendamentoService.alterarSituacao(id, dados.getStatus())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        agendamentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
