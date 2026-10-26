import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
    LucideUsersRound,
    LucideClipboardList,
    LucideMonitor,
    LucideCalendarDays,
    LucideArrowRight
} from '@lucide/angular';
import { ClienteService } from '../clientes/cliente-service';
import { OrdemService } from '../ordens/orderns-service';
import { AparelhoService } from '../aparelhos/aparelhos-service';
import { AgendamentoService } from '../agendamentos/agendamento-service';


@Component({
    selector: 'app-painel',
    imports: [
        RouterLink,
        LucideUsersRound,
        LucideClipboardList,
        LucideMonitor,
        LucideCalendarDays,
        LucideArrowRight
    ],
    templateUrl: './painel.html',
    styleUrl: './painel.scss'
})
export class Painel {

    private readonly clienteService = inject(ClienteService);
    private readonly ordemService = inject(OrdemService);
    private readonly aparelhoService = inject(AparelhoService);
    private readonly agendamentoService = inject(AgendamentoService);

    readonly clientes = this.clienteService.listar();
    readonly ordens = this.ordemService.listar();
    readonly aparelhos = this.aparelhoService.listar();
    readonly agendamentos = this.agendamentoService.listar();

    readonly dataAtual = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'full'
    }).format(new Date());

    private readonly hojeISO = this.obterDataLocalISO();

    readonly totalClientes = computed(() =>
        this.clientes().length
    );

    readonly totalAparelhos = computed(() =>
        this.aparelhos().length
    );

    readonly totalOrdens = computed(() =>
        this.ordens().length
    );

    readonly ordensEmAtendimento = computed(() =>
        this.ordens().filter(
            ordem => ordem.status === 'Em atendimento'
        ).length
    );

    readonly proximosAgendamentos = computed(() =>
        this.agendamentos()
            .filter(agendamento =>
                agendamento.data >= this.hojeISO &&
                (
                    agendamento.status === 'Agendado' ||
                    agendamento.status === 'Confirmado'
                )
            )
            .sort((a, b) =>
                `${a.data}T${a.horario}`.localeCompare(
                    `${b.data}T${b.horario}`
                )
            )
            .slice(0, 5)
    );

    readonly totalAgendamentosFuturos = computed(() =>
        this.proximosAgendamentos().length
    );

    readonly ordensRecentes = computed(() =>
        [...this.ordens()]
            .sort((a, b) =>
                this.chaveDataBR(b.abertura).localeCompare(
                    this.chaveDataBR(a.abertura)
                )
            )
            .slice(0, 5)
    );

    readonly distribuicaoOrdens = computed(() => {

        const ordens = this.ordens();
        const total = ordens.length;

        const situacoes = [
            { nome: 'Abertas', status: 'Aberta', classe: 'aberta' },
            { nome: 'Em atendimento', status: 'Em atendimento', classe: 'andamento' },
            { nome: 'Concluídas', status: 'Concluída', classe: 'concluida' },
            { nome: 'Entregues', status: 'Entregue', classe: 'entregue' }
        ];

        return situacoes.map(situacao => {

            const quantidade = ordens.filter(
                ordem => ordem.status === situacao.status
            ).length;

            return {
                ...situacao,
                quantidade,
                percentual: total > 0
                    ? Math.round((quantidade / total) * 100)
                    : 0
            };
        });
    });

    private chaveDataBR(data: string): string {
        return data.split('/').reverse().join('-');
    }

    private obterDataLocalISO(): string {
        const hoje = new Date();

        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');

        return `${ano}-${mes}-${dia}`;
    }

    formatarData(data: string): string {
        const [ano, mes, dia] = data.split('-');

        return `${dia}/${mes}/${ano}`;
    }
}