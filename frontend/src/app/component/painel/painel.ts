
import { Component, OnInit, computed, inject } from '@angular/core';
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
import { AgendamentoService } from '../agendamentos/agendamento-service';
import { AparelhoService } from '../aparelhos/aparelhos-service';

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
export class Painel implements OnInit {

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
        this.ordens().filter(ordem => {
            const situacao = this.normalizarSituacao(ordem.status);

            return situacao === 'EM_ATENDIMENTO' ||
                   situacao === 'EM_ANDAMENTO';
        }).length
    );

    readonly agendamentosFuturos = computed(() =>
        this.agendamentos()
            .filter(agendamento => {

                const data = agendamento.inicio?.slice(0, 10);

                const situacao = this.normalizarSituacao(
                    agendamento.status
                );

                return data >= this.hojeISO &&
                    (
                        situacao === 'AGENDADO' ||
                        situacao === 'CONFIRMADO'
                    );
            })
            .sort((a, b) =>
                a.inicio.localeCompare(b.inicio)
            )
    );

    readonly proximosAgendamentos = computed(() =>
        this.agendamentosFuturos()
            .slice(0, 5)
            .map(agendamento => ({
                ...agendamento,

                cliente: agendamento.clienteNome ??
                    `Cliente #${agendamento.clienteId}`,

                tecnico: agendamento.tecnicoNome ??
                    `Técnico #${agendamento.tecnicoId}`,

                data: agendamento.inicio.slice(0, 10),

                horario: agendamento.inicio.slice(11, 16),

                status: this.formatarSituacao(
                    agendamento.status
                )
            }))
    );

    readonly totalAgendamentosFuturos = computed(() =>
        this.agendamentosFuturos().length
    );

    readonly ordensRecentes = computed(() =>
        [...this.ordens()]
            .sort((a, b) =>
                b.dataAbertura.localeCompare(a.dataAbertura)
            )
            .slice(0, 5)
            .map(ordem => ({
                ...ordem,

                numero: `OS-${String(ordem.id).padStart(4, '0')}`,

                cliente: ordem.clienteNome ??
                    `Cliente #${ordem.clienteId ?? '?'}`,

                aparelho: [
                    ordem.aparelho
                ].filter(Boolean).join(' ') ||
                    `Aparelho #${ordem.aparelhoId}`,

                tecnico: ordem.tecnicoNome ??
                    `Técnico #${ordem.tecnicoId}`,

                abertura: this.formatarData(ordem.dataAbertura),

                status: this.formatarSituacao(
                    ordem.status
                )
            }))
    );

    readonly distribuicaoOrdens = computed(() => {

        const ordens = this.ordens();
        const total = ordens.length;

        const situacoes = [
            {
                nome: 'Abertas',
                status: 'Aberta',
                classe: 'aberta',
                valores: ['ABERTA']
            },
            {
                nome: 'Em atendimento',
                status: 'Em atendimento',
                classe: 'andamento',
                valores: ['EM_ATENDIMENTO', 'EM_ANDAMENTO']
            },
            {
                nome: 'Concluídas',
                status: 'Concluída',
                classe: 'concluida',
                valores: ['CONCLUIDA']
            },
            {
                nome: 'Entregues',
                status: 'Entregue',
                classe: 'entregue',
                valores: ['ENTREGUE']
            }
        ];

        return situacoes.map(situacao => {

            const quantidade = ordens.filter(ordem =>
                situacao.valores.includes(
                    this.normalizarSituacao(ordem.status)
                )
            ).length;

            return {
                nome: situacao.nome,
                status: situacao.status,
                classe: situacao.classe,
                quantidade,
                percentual: total > 0
                    ? Math.round((quantidade / total) * 100)
                    : 0
            };
        });
    });

    ngOnInit(): void {
        this.ordemService.carregar();
        this.aparelhoService.carregar();
        this.agendamentoService.carregar();
    }

    private normalizarSituacao(situacao: string): string {
        return (situacao ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toUpperCase()
            .replace(/[\s-]+/g, '_');
    }

    private formatarSituacao(situacao: string): string {
        const valor = this.normalizarSituacao(situacao);

        const nomes: Record<string, string> = {
            ABERTA: 'Aberta',
            EM_ATENDIMENTO: 'Em atendimento',
            EM_ANDAMENTO: 'Em andamento',
            CONCLUIDA: 'Concluída',
            ENTREGUE: 'Entregue',
            AGENDADO: 'Agendado',
            CONFIRMADO: 'Confirmado',
            CONCLUIDO: 'Concluído',
            CANCELADO: 'Cancelado'
        };

        return nomes[valor] ?? situacao.replace(/_/g, ' ');
    }

    private obterDataLocalISO(): string {
        const hoje = new Date();

        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');

        return `${ano}-${mes}-${dia}`;
    }

    formatarData(data: string): string {
        if (!data) {
            return '';
        }

        const dataISO = data.slice(0, 10);
        const partes = dataISO.split('-');

        if (partes.length !== 3) {
            return data;
        }

        const [ano, mes, dia] = partes;

        return `${dia}/${mes}/${ano}`;
    }
}
