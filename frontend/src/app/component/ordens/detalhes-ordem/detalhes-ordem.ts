
import {
    Component,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import {
    LucideArrowLeft,
    LucideClipboardList,
    LucideClock3,
    LucideWrench,
    LucideCircleCheck,
    LucidePlus,
    LucidePencil,
    LucideTrash2,
    LucideBan,
    LucideArrowRight,
    LucidePackage,
    LucideWallet
} from '@lucide/angular';

import {
    OrdemService,
    SituacaoOrdem
} from '../orderns-service';

import {
    ItemOrdem,
    DadosItemOrdem,
    ItemOrdemService
} from '../item-ordem-service';

import { Modal } from '../../../shared/modal/modal';

import {
    FormularioItemOrdem
} from './formulario-item-ordem/formulario-item-ordem';

@Component({
    selector: 'app-detalhes-ordem',
    imports: [
        RouterLink,
        Modal,
        FormularioItemOrdem,
        LucideArrowLeft,
        LucideClipboardList,
        LucideClock3,
        LucideWrench,
        LucideCircleCheck,
        LucidePlus,
        LucidePencil,
        LucideTrash2,
        LucideBan,
        LucideArrowRight,
        LucidePackage,
        LucideWallet
    ],
    templateUrl: './detalhes-ordem.html',
    styleUrl: './detalhes-ordem.scss'
})
export class DetalhesOrdem implements OnInit {

    private readonly route = inject(ActivatedRoute);
    private readonly ordemService = inject(OrdemService);
    private readonly itemOrdemService = inject(ItemOrdemService);

    readonly ordemId = Number(
        this.route.snapshot.paramMap.get('id')
    );

    private readonly ordens = this.ordemService.listar();
    private readonly todosItens = this.itemOrdemService.listar();
    

    readonly ordem = computed(() =>
        this.ordens().find(
            ordem => ordem.id === this.ordemId
        ) ?? null
    );

    readonly itens = computed(() =>
        this.todosItens().filter(
            item => item.ordemId === this.ordemId
        )
    );

    readonly totalItens = computed(() =>
        this.itens().length
    );

    readonly valorTotal = computed(() =>
        this.itens().reduce(
            (total, item) =>
                total + item.subtotal,
            0
        )
    );

    readonly statusAtual = computed(
        () => this.ordem()?.status as SituacaoOrdem | undefined
    );

    readonly etapas: SituacaoOrdem[] = [
        'Aberta',
        'Em_execucao',
        'Concluida'
    ];

    readonly indiceEtapa = computed(() =>
        this.etapas.indexOf(
            this.statusAtual() as SituacaoOrdem
        )
    );

    readonly podeEditarItens = computed(() =>
        this.statusAtual() === 'Aberta' ||
        this.statusAtual() === 'Em_execucao'
    );

    readonly podeAvancar = computed(() =>
        this.statusAtual() === 'Aberta' ||
        this.statusAtual() === 'Em_execucao'
    );

    readonly podeCancelar = computed(() =>
        this.statusAtual() === 'Aberta' ||
        this.statusAtual() === 'Em_execucao'
    );

    readonly proximoStatus = computed<SituacaoOrdem | null>(() => {
        if (this.statusAtual() === 'Aberta') {
            return 'Em_execucao';
        }

        if (this.statusAtual() === 'Em_execucao') {
            return 'Concluida';
        }

        return null;
    });

    readonly modalItemAberto = signal(false);
    readonly itemSelecionado = signal<ItemOrdem | null>(null);

    readonly processandoItem = signal(false);
    readonly processandoStatus = signal(false);

    readonly mensagem = signal('');
    readonly erro = signal('');

    ngOnInit(): void {
        this.ordemService.carregar();
        this.itemOrdemService.carregar(this.ordemId);
    }

    formatarMoeda(valor: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    formatarData(data: string | null): string {
        if (!data) {
            return 'Não informada';
        }

        const [ano, mes, dia] = data.slice(0, 10).split('-');
        const hora = data.slice(11, 16);

        return hora
            ? `${dia}/${mes}/${ano} às ${hora}`
            : `${dia}/${mes}/${ano}`;
    }

    formatarStatus(status: string | undefined): string {
        const nomes: Record<SituacaoOrdem, string> = {
            Aberta: 'Aberta',
            Em_execucao: 'Em execução',
            Concluida: 'Concluída',
            Cancelada: 'Cancelada'
        };

        if (!status) {
            return 'Não informada';
        }

        return nomes[status as SituacaoOrdem] ?? status;
    }

    abrirCadastroItem(): void {
        if (!this.podeEditarItens()) {
            return;
        }

        this.itemSelecionado.set(null);
        this.modalItemAberto.set(true);
    }

    editarItem(id: number): void {
        if (!this.podeEditarItens()) {
            return;
        }

        const item = this.itens().find(
            item => item.id === id
        );

        if (!item) {
            this.erro.set('Item não encontrado.');
            return;
        }

        this.itemSelecionado.set(item);
        this.modalItemAberto.set(true);
    }

    salvarItem(dados: DadosItemOrdem): void {
        if (!this.podeEditarItens() || this.processandoItem()) {
            return;
        }

        const item = this.itemSelecionado();

        this.processandoItem.set(true);
        this.erro.set('');
        this.mensagem.set('');

        if (item) {
            this.itemOrdemService.atualizar(item.id, dados).subscribe({
                next: () => {
                    this.itemOrdemService.carregar(this.ordemId);
                    this.mensagem.set('Item atualizado com sucesso.');
                    this.processandoItem.set(false);
                    this.fecharModalItem();
                },
                error: (erro) => {
                    console.error(erro);
                    this.erro.set('Erro ao atualizar item.');
                    this.processandoItem.set(false);
                }
            });

            return;
        }

        this.itemOrdemService.criar(dados).subscribe({
            next: () => {
                this.itemOrdemService.carregar(this.ordemId);
                this.mensagem.set('Item adicionado com sucesso.');
                this.processandoItem.set(false);
                this.fecharModalItem();
            },
            error: (erro) => {
                console.error(erro);
                this.erro.set('Erro ao adicionar item.');
                this.processandoItem.set(false);
            }
        });
    }

    removerItem(id: number): void {
        if (!this.podeEditarItens()) {
            return;
        }

        const confirmado = window.confirm(
            'Deseja remover este item da ordem?'
        );

        if (!confirmado) {
            return;
        }

        this.erro.set('');

        this.itemOrdemService.remover(this.ordemId, id).subscribe({
            next: () => {
                this.itemOrdemService.carregar(this.ordemId);
                this.mensagem.set('Item removido com sucesso.');
            },
            error: (erro) => {
                console.error(erro);
                this.erro.set('Erro ao remover item.');
            }
        });
    }

    fecharModalItem(): void {
        if (this.processandoItem()) {
            return;
        }

        this.modalItemAberto.set(false);
        this.itemSelecionado.set(null);
    }

    avancarStatus(): void {
        const proximo = this.proximoStatus();

        if (!proximo) {
            return;
        }

        if (proximo === 'Concluida') {
            const confirmado = window.confirm(
                'Deseja concluir esta ordem de serviço?'
            );

            if (!confirmado) {
                return;
            }
        }

        this.alterarStatus(proximo);
    }

    cancelarOrdem(): void {
        if (!this.podeCancelar()) {
            return;
        }

        const confirmado = window.confirm(
            'Deseja realmente cancelar esta ordem de serviço?'
        );

        if (!confirmado) {
            return;
        }

        this.alterarStatus('Cancelada');
    }

   private alterarStatus(status: SituacaoOrdem): void {
    if (this.processandoStatus()) {
        return;
    }

    this.processandoStatus.set(true);
    this.erro.set('');
    this.mensagem.set('');

    this.ordemService.alterarStatus(this.ordemId, status)
        .subscribe({
            next: () => {
                this.ordemService.carregar();

                this.mensagem.set(
                    `Situação alterada para ${this.formatarStatus(status)}.`
                );

                this.processandoStatus.set(false);
            },
            error: (erro) => {
                console.error(erro);

                this.erro.set(
                    'Erro ao alterar a situação da ordem.'
                );

                this.processandoStatus.set(false);
            }
        });
}
}
