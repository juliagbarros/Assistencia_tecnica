
import {
    Component,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';

import {
    LucideCalendarDays,
    LucideClock3,
    LucideCircleCheck,
    LucideUserRound
} from '@lucide/angular';

import {
    ColunaTabela,
    RegistroTabela,
    Tabela
} from '../../shared/tabela/tabela';

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
export class Agendamentos implements OnInit {

    private readonly agendamentoService = inject(AgendamentoService);

    readonly agendamentos = this.agendamentoService.listar();

    readonly modalAberto = signal(false);
    readonly agendamentoSelecionado = signal<Agendamento | null>(null);

    readonly colunas: ColunaTabela[] = [
        { chave: 'cliente', titulo: 'Cliente' },
        { chave: 'tecnico', titulo: 'Técnico' },
        { chave: 'inicio', titulo: 'Início' },
        { chave: 'fim', titulo: 'Fim' },
        { chave: 'motivo', titulo: 'Motivo' },
        { chave: 'status', titulo: 'Situação' }
    ];

    readonly registros = computed<RegistroTabela[]>(() =>
        this.agendamentos().map(agendamento => ({
            id: agendamento.id,
            cliente: agendamento.clienteNome ??
                `Cliente #${agendamento.clienteId}`,
            tecnico: agendamento.tecnicoNome ??
                `Técnico #${agendamento.tecnicoId}`,
            inicio: agendamento.inicio?.slice(0, 16).replace('T', ' ') ?? '',
            fim: agendamento.fim?.slice(0, 16).replace('T', ' ') ?? '',
            motivo: agendamento.motivo,
            status: agendamento.status
        }))
    );

    readonly totalAgendamentos = computed(() =>
        this.agendamentos().length
    );

    readonly agendamentosAgendados = computed(() =>
        this.agendamentos().filter(agendamento =>
            agendamento.status === 'AGENDADO'
        ).length
    );

    readonly agendamentosConfirmados = computed(() =>
        this.agendamentos().filter(agendamento =>
            agendamento.status === 'CONFIRMADO'
        ).length
    );

    readonly agendamentosConcluidos = computed(() =>
        this.agendamentos().filter(agendamento =>
            agendamento.status === 'CONCLUIDO'
        ).length
    );

    readonly mensagem = signal('');

    ngOnInit(): void {
        this.agendamentoService.carregar();
    }

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
            this.agendamentoService.atualizar(agendamento.id, dados).subscribe({
                next: () => {
                    this.agendamentoService.carregar();
                    this.mensagem.set('Agendamento atualizado com sucesso.');
                    this.fecharModal();
                },
                error: (erro) => {
                    console.error(erro);
                    this.mensagem.set('Erro ao atualizar agendamento.');
                }
            });

            return;
        }

        this.agendamentoService.criar(dados).subscribe({
            next: () => {
                this.agendamentoService.carregar();
                this.mensagem.set('Agendamento cadastrado com sucesso.');
                this.fecharModal();
            },
            error: (erro) => {
                console.error(erro);
                this.mensagem.set('Erro ao cadastrar agendamento.');
            }
        });
    }

    removerAgendamento(id: number): void {
        if (!window.confirm('Deseja remover este agendamento?')) {
            return;
        }

        this.agendamentoService.remover(id).subscribe({
            next: () => {
                this.agendamentoService.carregar();
                this.mensagem.set('Agendamento removido com sucesso.');
            },
            error: (erro) => {
                console.error(erro);
                this.mensagem.set('Erro ao remover agendamento.');
            }
        });
    }

    fecharModal(): void {
        this.modalAberto.set(false);
        this.agendamentoSelecionado.set(null);
    }
}
