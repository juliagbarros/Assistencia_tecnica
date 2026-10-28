
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ColunaTabela, Tabela } from '../../shared/tabela/tabela';

import {
    OrdemServico,
    DadosOrdem,
    OrdemService
} from './orderns-service';

import {
    LucideClipboardList,
    LucideClock3,
    LucideWrench,
    LucideCircleCheck
} from '@lucide/angular';

import { Modal } from '../../shared/modal/modal';

import {
    FormularioOrdem
} from './formulario-ordem/formulario-ordem';

@Component({
    selector: 'app-ordens',
    imports: [
        RouterLink,
        Tabela,
        Modal,
        FormularioOrdem,
        LucideClipboardList,
        LucideClock3,
        LucideWrench,
        LucideCircleCheck
    ],
    templateUrl: './ordens.html',
    styleUrl: './ordens.scss'
})
export class Ordens {

    private readonly ordemService = inject(OrdemService);

    readonly ordens = this.ordemService.listar();

    readonly modalAberto = signal(false);

    readonly ordemSelecionada = signal<OrdemServico | null>(null);

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
        this.ordens().filter(o =>
            o.status === 'Aberta'
        ).length
    );

    readonly ordensEmAtendimento = computed(() =>
        this.ordens().filter(o =>
            o.status === 'Em atendimento'
        ).length
    );

    readonly ordensConcluidas = computed(() =>
        this.ordens().filter(o =>
            o.status === 'Concluída' || o.status === 'Entregue'
        ).length
    );

    readonly mensagem = signal('');

    adicionarOrdem(): void {
        this.ordemSelecionada.set(null);
        this.modalAberto.set(true);
    }

    editarOrdem(id: number): void {
        const ordem = this.ordens().find(
            ordem => ordem.id === id
        );

        if (!ordem) {
            this.mensagem.set('Ordem não encontrada.');
            return;
        }

        this.ordemSelecionada.set(ordem);
        this.modalAberto.set(true);
    }

    salvarOrdem(dados: DadosOrdem): void {
        const ordem = this.ordemSelecionada();

        if (ordem) {
            const atualizado = this.ordemService.atualizar(
                ordem.id,
                dados
            );

            if (!atualizado) {
                this.mensagem.set('Ordem não encontrada.');
                return;
            }

            this.mensagem.set('Ordem atualizada com sucesso.');
        } else {
            this.ordemService.criar(dados);
            this.mensagem.set('Ordem cadastrada com sucesso.');
        }

        this.fecharModal();
    }

    fecharModal(): void {
        this.modalAberto.set(false);
        this.ordemSelecionada.set(null);
    }

    removerOrdem(id: number): void {
        const confirmado = window.confirm(
            'Deseja remover esta ordem dos dados de demonstração?'
        );

        if (!confirmado) {
            return;
        }

        this.ordemService.remover(id);

        this.mensagem.set(
            'Ordem removida dos dados de demonstração.'
        );
    }
}
