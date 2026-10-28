
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
    LucideTablet,
    LucideSmartphone,
    LucideLaptop,
    LucideMonitor
} from '@lucide/angular';

import { ColunaTabela, Tabela } from '../../shared/tabela/tabela';
import { Modal } from '../../shared/modal/modal';

import { Aparelho, DadosAparelho, AparelhoService } from './aparelhos-service';

import {
    FormularioAparelho
} from './formulario-aparelho/formulario-aparelho';

@Component({
    selector: 'app-aparelhos',
    imports: [
        RouterLink,
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
export class Aparelhos {

    private readonly aparelhoService = inject(AparelhoService);

    readonly aparelhos = this.aparelhoService.listar();

    readonly modalAberto = signal(false);
    readonly aparelhoSelecionado = signal<Aparelho | null>(null);
    readonly mensagem = signal('');

    readonly colunas: ColunaTabela[] = [
        { chave: 'cliente', titulo: 'Cliente' },
        { chave: 'tipo', titulo: 'Tipo' },
        { chave: 'marca', titulo: 'Marca' },
        { chave: 'modelo', titulo: 'Modelo' },
        { chave: 'numeroSerie', titulo: 'Número de série' },
        { chave: 'status', titulo: 'Status', tipo: 'status' }
    ];

    readonly totalAparelhos = computed(() =>
        this.aparelhos().length
    );

    readonly emManutencao = computed(() =>
        this.aparelhos().filter(
            aparelho => aparelho.status === 'Em manutenção'
        ).length
    );

    readonly aparelhosProntos = computed(() =>
        this.aparelhos().filter(
            aparelho => aparelho.status === 'Pronto'
        ).length
    );

    readonly aparelhosEntregues = computed(() =>
        this.aparelhos().filter(
            aparelho => aparelho.status === 'Entregue'
        ).length
    );

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
            const atualizado = this.aparelhoService.atualizar(
                aparelho.id,
                dados
            );

            if (!atualizado) {
                this.mensagem.set('Aparelho não encontrado.');
                return;
            }

            this.mensagem.set('Aparelho atualizado com sucesso.');
        } else {
            this.aparelhoService.criar(dados);
            this.mensagem.set('Aparelho cadastrado com sucesso.');
        }

        this.fecharModal();
    }

    fecharModal(): void {
        this.modalAberto.set(false);
        this.aparelhoSelecionado.set(null);
    }

    removerAparelho(id: number): void {
        const confirmado = window.confirm(
            'Deseja remover este aparelho dos dados de demonstração?'
        );

        if (!confirmado) return;

        this.aparelhoService.remover(id);
        this.mensagem.set('Aparelho removido com sucesso.');
    }
}
