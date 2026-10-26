import { Component, computed, inject, signal } from '@angular/core';
import { ColunaTabela, Tabela } from '../../shared/tabela/tabela';
import { OrdemService } from './orderns-service';
import { RouterLink } from '@angular/router';
import {
    LucideClipboardList,
    LucideClock3,
    LucideWrench,
    LucideCircleCheck
} from '@lucide/angular';

@Component({
  selector: 'app-ordens',
  imports: [Tabela,      RouterLink,
        Tabela,
        LucideClipboardList,
        LucideClock3,
        LucideWrench,
        LucideCircleCheck],
  templateUrl: './ordens.html',
  styleUrl: './ordens.scss',
})
export class Ordens {

  private readonly ordemService = inject(OrdemService);

    readonly ordens = this.ordemService.listar();

    readonly colunas: ColunaTabela[] = [
        { chave: 'numero', titulo: 'Número da OS' },
        { chave: 'cliente', titulo: 'Cliente' },
        { chave: 'aparelho', titulo: 'Aparelho' },
        { chave: 'tecnico', titulo: 'Técnico' },
        { chave: 'abertura', titulo: 'Abertura' },
        { chave: 'status', titulo: 'Status', tipo: 'status' }
    ];

    readonly totalOrdens = computed(() =>
        this.ordens().length
    );

    readonly ordensAbertas = computed(() =>
        this.ordens().filter(o => o.status === 'Aberta').length
    );

    readonly ordensEmAtendimento = computed(() =>
        this.ordens().filter(o => o.status === 'Em atendimento').length
    );

    readonly ordensConcluidas = computed(() =>
        this.ordens().filter(o =>
            o.status === 'Concluída' || o.status === 'Entregue'
        ).length
    );

    readonly mensagem = signal('');

    adicionarOrdem(): void {
        this.mensagem.set(
            'O cadastro de ordens será implementado na próxima etapa.'
        );
    }

    editarOrdem(id: number): void {
        this.mensagem.set(
            `A edição da ordem ${id} será implementada posteriormente.`
        );
    }

    removerOrdem(id: number): void {
        const confirmado = window.confirm(
            'Deseja remover esta ordem dos dados de demonstração?'
        );

        if (!confirmado) return;

        this.ordemService.remover(id);
        this.mensagem.set('Ordem removida dos dados de demonstração.');
    }
}
