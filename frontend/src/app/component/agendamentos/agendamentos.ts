import { Component, computed, inject, signal } from '@angular/core';

import {
    LucideCalendarDays,
    LucideClock3,
    LucideCircleCheck,
    LucideUserRound
} from '@lucide/angular';

import { ColunaTabela, RegistroTabela, Tabela } from '../../shared/tabela/tabela';
import { AgendamentoService } from './agendamento-service';

@Component({
    selector: 'app-agendamentos',
    imports: [
        Tabela,
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

    readonly colunas: ColunaTabela[] = [
        { chave: 'cliente', titulo: 'Cliente' },
        { chave: 'aparelho', titulo: 'Aparelho' },
        { chave: 'tecnico', titulo: 'Técnico' },
        { chave: 'servico', titulo: 'Serviço' },
        { chave: 'dataFormatada', titulo: 'Data' },
        { chave: 'horario', titulo: 'Horário' },
        { chave: 'status', titulo: 'Status', tipo: 'status' }
    ];

    readonly registros = computed<RegistroTabela[]>(() =>
        this.agendamentos().map(agendamento => ({
            ...agendamento,
            dataFormatada: this.formatarData(agendamento.data)
        }))
    );

    readonly totalAgendamentos = computed(() =>
        this.agendamentos().length
    );

    readonly totalAgendados = computed(() =>
        this.agendamentos().filter(a =>
            a.status === 'Agendado'
        ).length
    );

    readonly totalConfirmados = computed(() =>
        this.agendamentos().filter(a =>
            a.status === 'Confirmado'
        ).length
    );

    readonly totalConcluidos = computed(() =>
        this.agendamentos().filter(a =>
            a.status === 'Concluído'
        ).length
    );

    readonly mensagem = signal('');

    private formatarData(data: string): string {
        const [ano, mes, dia] = data.split('-');

        return `${dia}/${mes}/${ano}`;
    }

    adicionarAgendamento(): void {
        this.mensagem.set(
            'O cadastro de agendamentos ainda será implementado.'
        );
    }

    editarAgendamento(id: number): void {
        this.mensagem.set(
            `A edição do agendamento ${id} ainda será implementada.`
        );
    }

    removerAgendamento(id: number): void {

        const confirmado = window.confirm(
            'Deseja remover este agendamento dos dados de demonstração?'
        );

        if (!confirmado) return;

        this.agendamentoService.remover(id);

        this.mensagem.set(
            'Agendamento removido dos dados de demonstração.'
        );
    }
}