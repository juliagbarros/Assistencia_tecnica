
import {
    Component,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';

import {
    LucideTablet,
    LucideSmartphone,
    LucideLaptop,
    LucideMonitor
} from '@lucide/angular';

import {
    ColunaTabela,
    RegistroTabela,
    Tabela
} from '../../shared/tabela/tabela';


import { Modal } from '../../shared/modal/modal';

import { FormularioAparelho } from './formulario-aparelho/formulario-aparelho';
import { AparelhoService, Aparelho, DadosAparelho } from './aparelhos-service';

@Component({
    selector: 'app-aparelhos',
    imports: [
        Tabela,
        Modal,
        FormularioAparelho,
        LucideTablet,
        LucideSmartphone,
        LucideLaptop,
        LucideMonitor
    ],
    templateUrl: './aparelhos.html',
    styleUrl: './aparelhos.scss'
})
export class Aparelhos implements OnInit {

    private readonly aparelhoService = inject(AparelhoService);

    readonly aparelhos = this.aparelhoService.listar();

    readonly modalAberto = signal(false);
    readonly aparelhoSelecionado = signal<Aparelho | null>(null);

    readonly colunas: ColunaTabela[] = [
        { chave: 'cliente', titulo: 'Cliente' },
        { chave: 'tipo', titulo: 'Tipo' },
        { chave: 'marca', titulo: 'Marca' },
        { chave: 'modelo', titulo: 'Modelo' },
        { chave: 'numeroSerie', titulo: 'Número de série' },
        { chave: 'observacoes', titulo: 'Observações' }
    ];

    readonly registros = computed<RegistroTabela[]>(() =>
        this.aparelhos().map(aparelho => ({
            id: aparelho.id,
            cliente: aparelho.cliente?.nome ?? `Cliente #${aparelho.cliente?.id}`,
            tipo: aparelho.tipo,
            marca: aparelho.marca,
            modelo: aparelho.modelo,
            numeroSerie: aparelho.numeroSerie ?? '',
            observacoes: aparelho.observacoes ?? ''
        }))
    );

    readonly totalAparelhos = computed(() =>
        this.aparelhos().length
    );

    readonly totalTipos = computed(() =>
        new Set(
            this.aparelhos().map(aparelho => aparelho.tipo)
        ).size
    );

    readonly totalMarcas = computed(() =>
        new Set(
            this.aparelhos().map(aparelho => aparelho.marca)
        ).size
    );

    readonly aparelhosComObservacoes = computed(() =>
        this.aparelhos().filter(aparelho =>
            !!aparelho.observacoes?.trim()
        ).length
    );

    readonly mensagem = signal('');

    ngOnInit(): void {
        this.aparelhoService.carregar();
    }

    adicionarAparelho(): void {
        this.aparelhoSelecionado.set(null);
        this.modalAberto.set(true);
    }

    editarAparelho(id: number): void {
        const aparelho = this.aparelhos().find(
            aparelho => aparelho.id === id
        );

        if (!aparelho) {
            this.mensagem.set('Aparelho não encontrado.');
            return;
        }

        this.aparelhoSelecionado.set(aparelho);
        this.modalAberto.set(true);
    }

    salvarAparelho(dados: DadosAparelho): void {
        const aparelho = this.aparelhoSelecionado();

        if (aparelho) {
            this.aparelhoService.atualizar(aparelho.id, dados).subscribe({
                next: () => {
                    this.aparelhoService.carregar();
                    this.mensagem.set('Aparelho atualizado com sucesso.');
                    this.fecharModal();
                },
                error: (erro) => {
                    console.error(erro);
                    this.mensagem.set('Erro ao atualizar aparelho.');
                }
            });

            return;
        }

        this.aparelhoService.criar(dados).subscribe({
            next: () => {
                this.aparelhoService.carregar();
                this.mensagem.set('Aparelho cadastrado com sucesso.');
                this.fecharModal();
            },
            error: (erro) => {
                console.error(erro);
                this.mensagem.set('Erro ao cadastrar aparelho.');
            }
        });
    }

    removerAparelho(id: number): void {
        if (!window.confirm('Deseja remover este aparelho?')) {
            return;
        }

        this.aparelhoService.remover(id).subscribe({
            next: () => {
                this.aparelhoService.carregar();
                this.mensagem.set('Aparelho removido com sucesso.');
            },
            error: (erro) => {
                console.error(erro);
                this.mensagem.set('Erro ao remover aparelho.');
            }
        });
    }

    fecharModal(): void {
        this.modalAberto.set(false);
        this.aparelhoSelecionado.set(null);
    }
}
