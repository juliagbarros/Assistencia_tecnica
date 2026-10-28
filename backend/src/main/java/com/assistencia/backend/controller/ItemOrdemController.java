package com.assistencia.backend.controller;

import com.assistencia.backend.dto.ItemOrdemRequest;
import com.assistencia.backend.dto.ItemOrdemResponse;
import com.assistencia.backend.model.ItemOrdem;
import com.assistencia.backend.service.ItemOrdemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordens/{ordemId}/itens")
@RequiredArgsConstructor
public class ItemOrdemController {
    private final ItemOrdemService itemService;

    @PostMapping
    public ResponseEntity<ItemOrdemResponse> adicionar(@PathVariable Long ordemId, @Valid @RequestBody ItemOrdemRequest dados) {
        ItemOrdem criado = itemService.adicionar(ordemId, dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ItemOrdemResponse(criado));
    }

    @GetMapping
    public ResponseEntity<List<ItemOrdemResponse>> listar(@PathVariable Long ordemId) {
        List<ItemOrdemResponse> lista = itemService.listar(ordemId).stream().map(ItemOrdemResponse::new).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<ItemOrdemResponse> getById(@PathVariable Long ordemId, @PathVariable Long itemId) {
        return ResponseEntity.ok(new ItemOrdemResponse(itemService.buscar(ordemId, itemId)));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ItemOrdemResponse> atualizar(@PathVariable Long ordemId, @PathVariable Long itemId, @Valid @RequestBody ItemOrdemRequest dados) {
        return ResponseEntity.ok(new ItemOrdemResponse(itemService.atualizar(ordemId, itemId, dados)));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> excluir(@PathVariable Long ordemId, @PathVariable Long itemId) {
        itemService.excluir(ordemId, itemId);
        return ResponseEntity.noContent().build();
    }
}
