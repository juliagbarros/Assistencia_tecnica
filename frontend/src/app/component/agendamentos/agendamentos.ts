
import { Component, computed, inject, signal } from '@angular/core';

import {
    LucideCalendarDays,
    LucideClock3,
    LucideCircleCheck,
    LucideUserRound
} from '@lucide/angular';

import { ColunaTabela, Tabela } from '../../shared/tabela/tabela';

import {
    Agendamento,
    DadosAgendamento,
    AgendamentoService
} from './agendamento-service';

import { Modal } from '../../shared/modal/modal';
import { FormularioAgendamento } from './formulario-agendamento/formulario-agendamento';

@Component({
    selector: 'app-agendamentos',
    imports: [
        Tabela,
        Modal,
        FormularioAgendamento,
        LucideCalendarDays,
        LucideClock3,
        LucideCircleCheck,
        LucideUserRound
    ],
    templateUrl: './agendamentos.html',
    styleUrl: './agendamentos.scss'
})
export class Agendamentos {

    private readonly agendamentoService = inject(AgendamentoService);

    readonly agendamentos = this.agendamentoService.listar();

    readonly modalAberto = signal(false);
    readonly agendamentoSelecionado = signal<Agendamento | null>(null);

    readonly colunas: ColunaTabela[] = [
        { chave: 'cliente', titulo: 'Cliente' },
        { chave: 'aparelho', titulo: 'Aparelho' },
        { chave: 'tecnico', titulo: 'Técnico' },
        { chave: 'servico', titulo: 'Serviço' },
        { chave: 'data', titulo: 'Data' },
        { chave: 'horario', titulo: 'Horário' },
        { chave: 'status', titulo: 'Status', tipo: 'status' }
    ];

    readonly totalAgendamentos = computed(() =>
        this.agendamentos().length
    );

    readonly agendamentosAgendados = computed(() =>
        this.agendamentos().filter(agendamento =>
            agendamento.status === 'Agendado'
        ).length
    );

    readonly agendamentosConfirmados = computed(() =>
        this.agendamentos().filter(agendamento =>
            agendamento.status === 'Confirmado'
        ).length
    );

    readonly agendamentosConcluidos = computed(() =>
        this.agendamentos().filter(agendamento =>
            agendamento.status === 'Concluído'
        ).length
    );

    readonly mensagem = signal('');

    adicionarAgendamento(): void {
        this.agendamentoSelecionado.set(null);
        this.modalAberto.set(true);
    }

    editarAgendamento(id: number): void {
        const agendamento = this.agendamentos().find(
            agendamento => agendamento.id === id
        );

        if (!agendamento) {
            this.mensagem.set('Agendamento não encontrado.');
            return;
        }

        this.agendamentoSelecionado.set(agendamento);
        this.modalAberto.set(true);
    }

    salvarAgendamento(dados: DadosAgendamento): void {
        const agendamento = this.agendamentoSelecionado();

        if (agendamento) {
            const atualizado = this.agendamentoService.atualizar(
                agendamento.id,
                dados
            );

            if (!atualizado) {
                this.mensagem.set('Agendamento não encontrado.');
                return;
            }

            this.mensagem.set('Agendamento atualizado com sucesso.');
        } else {
            this.agendamentoService.criar(dados);
            this.mensagem.set('Agendamento cadastrado com sucesso.');
        }

        this.fecharModal();
    }

    fecharModal(): void {
        this.modalAberto.set(false);
        this.agendamentoSelecionado.set(null);
    }

    removerAgendamento(id: number): void {
        const confirmado = window.confirm(
            'Deseja remover este agendamento dos dados de demonstração?'
        );

        if (!confirmado) {
            return;
        }

        this.agendamentoService.remover(id);
        this.mensagem.set('Agendamento removido dos dados de demonstração.');
    }
}
