import { Component, computed, inject, signal } from '@angular/core';

import {
    LucideTablet,
    LucideSmartphone,
    LucideLaptop,
    LucideMonitor
} from '@lucide/angular';

import { ColunaTabela, Tabela } from '../../shared/tabela/tabela';
import { AparelhoService } from './aparelhos-service';

@Component({
    selector: 'app-aparelhos',
    imports: [
        Tabela,
        LucideTablet,
        LucideSmartphone,
        LucideLaptop,
        LucideMonitor
    ],
    templateUrl: './aparelhos.html',
    styleUrl: './aparelhos.scss'
})
export class Aparelhos {

    private readonly aparelhoService = inject(AparelhoService);

    readonly aparelhos = this.aparelhoService.listar();

    readonly colunas: ColunaTabela[] = [
        { chave: 'nome', titulo: 'Aparelho' },
        { chave: 'tipo', titulo: 'Tipo' },
        { chave: 'marca', titulo: 'Marca' },
        { chave: 'modelo', titulo: 'Modelo' },
        { chave: 'cliente', titulo: 'Cliente' },
        { chave: 'numeroSerie', titulo: 'Número de série' },
        { chave: 'status', titulo: 'Status', tipo: 'status' }
    ];

    readonly totalAparelhos = computed(() =>
        this.aparelhos().length
    );

    readonly totalCelulares = computed(() =>
        this.aparelhos().filter(aparelho =>
            aparelho.tipo === 'Celular'
        ).length
    );

    readonly totalNotebooks = computed(() =>
        this.aparelhos().filter(aparelho =>
            aparelho.tipo === 'Notebook'
        ).length
    );

    readonly totalComputadores = computed(() =>
        this.aparelhos().filter(aparelho =>
            aparelho.tipo === 'Computador'
        ).length
    );

    readonly mensagem = signal('');

    adicionarAparelho(): void {
        this.mensagem.set(
            'O cadastro de aparelhos ainda será implementado.'
        );
    }

    editarAparelho(id: number): void {
        this.mensagem.set(
            `A edição do aparelho ${id} ainda será implementada.`
        );
    }

    removerAparelho(id: number): void {

        const confirmado = window.confirm(
            'Deseja remover este aparelho dos dados de demonstração?'
        );

        if (!confirmado) return;

        this.aparelhoService.remover(id);

        this.mensagem.set(
            'Aparelho removido dos dados de demonstração.'
        );
    }
}