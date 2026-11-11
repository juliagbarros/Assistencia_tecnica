
import {
    Component,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import {
    LucideClipboardList,
    LucideClock3,
    LucideWrench,
    LucideCircleCheck
} from '@lucide/angular';

import {
    ColunaTabela,
    RegistroTabela,
    Tabela
} from '../../shared/tabela/tabela';

import {
    OrdemServico,
    DadosOrdem,
    OrdemService
} from './orderns-service';

import { Modal } from '../../shared/modal/modal';

import { FormularioOrdem } from './formulario-ordem/formulario-ordem';

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
export class Ordens implements OnInit {

    private readonly ordemService = inject(OrdemService);
    private readonly router = inject(Router);


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

    visualizarOrdem(id: number): void {
    this.router.navigate(['/ordens', id]);
    }

    readonly registros = computed<RegistroTabela[]>(() =>
        this.ordens().map(ordem => ({
            id: ordem.id,
            numero: `OS-${String(ordem.id).padStart(4, '0')}`,
            cliente: ordem.clienteNome ??
                `Cliente #${ordem.clienteId?? '?'}`,
            aparelho: [
                ordem.aparelho
            ].filter(Boolean).join(' ') || `Aparelho #${ordem.aparelhoId}`,
            tecnico: ordem.tecnicoNome ??
                `Técnico #${ordem.tecnicoId}`,
            abertura: ordem.dataAbertura?.slice(0, 16).replace('T', ' ') ?? '',
            status: ordem.status
        }))
    );

    readonly totalOrdens = computed(() =>
        this.ordens().length
    );

    readonly ordensAbertas = computed(() =>
        this.ordens().filter(ordem =>
            ordem.status === 'ABERTA'
        ).length
    );

    

    readonly ordensConcluidas = computed(() =>
        this.ordens().filter(ordem =>
            ordem.status === 'CONCLUIDA' 
        ).length
    );

    readonly mensagem = signal('');

    ngOnInit(): void {
        this.ordemService.carregar();
    }

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
            this.ordemService.atualizar(ordem.id, dados).subscribe({
                next: () => {
                    this.ordemService.carregar();
                    this.mensagem.set('Ordem atualizada com sucesso.');
                    this.fecharModal();
                },
                error: (erro) => {
                    console.error(erro);
                    this.mensagem.set('Erro ao atualizar ordem.');
                }
            });

            return;
        }

        this.ordemService.criar(dados).subscribe({
            next: () => {
                this.ordemService.carregar();
                this.mensagem.set('Ordem cadastrada com sucesso.');
                this.fecharModal();
            },
            error: (erro) => {
                console.error(erro);
                this.mensagem.set('Erro ao cadastrar ordem.');
            }
        });
    }

    removerOrdem(id: number): void {
        if (!window.confirm('Deseja remover esta ordem de serviço?')) {
            return;
        }

        this.ordemService.remover(id).subscribe({
            next: () => {
                this.ordemService.carregar();
                this.mensagem.set('Ordem removida com sucesso.');
            },
            error: (erro) => {
                console.error(erro);
                this.mensagem.set('Erro ao remover ordem.');
            }
        });
    }

    fecharModal(): void {
        this.modalAberto.set(false);
        this.ordemSelecionada.set(null);
    }
}
