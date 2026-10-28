
import { Component, computed, inject, signal } from '@angular/core';

import {
    LucideWrench,
    LucideCircleCheck,
    LucideClock3,
    LucideSmartphone
} from '@lucide/angular';

import { ColunaTabela, Tabela } from '../../shared/tabela/tabela';

import {
    Servico,
    DadosServico,
    ServicoService
} from './servico-service';

import { Modal } from '../../shared/modal/modal';

import {
    FormularioServico
} from './formulario-servico/formulario-servico';

@Component({
    selector: 'app-servicos',
    imports: [
        Tabela,
        Modal,
        FormularioServico,
        LucideWrench,
        LucideCircleCheck,
        LucideClock3,
        LucideSmartphone
    ],
    templateUrl: './servico.html',
    styleUrl: './servico.scss'
})
export class Servicos {

    private readonly servicoService = inject(ServicoService);

    readonly servicos = this.servicoService.listar();

    readonly modalAberto = signal(false);

    readonly servicoSelecionado = signal<Servico | null>(null);

    readonly colunas: ColunaTabela[] = [
        { chave: 'nome', titulo: 'Serviço' },
        { chave: 'categoria', titulo: 'Categoria' },
        { chave: 'descricao', titulo: 'Descrição' },
        { chave: 'valor', titulo: 'Valor (R$)' },
        { chave: 'tempoEstimado', titulo: 'Tempo estimado' },
        { chave: 'status', titulo: 'Status', tipo: 'status' }
    ];

    readonly totalServicos = computed(() =>
        this.servicos().length
    );

    readonly servicosAtivos = computed(() =>
        this.servicos().filter(servico =>
            servico.status === 'Ativo'
        ).length
    );

    readonly servicosInativos = computed(() =>
        this.servicos().filter(servico =>
            servico.status === 'Inativo'
        ).length
    );

    readonly totalCategorias = computed(() => {
        const categorias = this.servicos().map(
            servico => servico.categoria
        );

        return new Set(categorias).size;
    });

    readonly mensagem = signal('');

    adicionarServico(): void {
        this.servicoSelecionado.set(null);
        this.modalAberto.set(true);
    }

    editarServico(id: number): void {
        const servico = this.servicos().find(
            servico => servico.id === id
        );

        if (!servico) {
            this.mensagem.set('Serviço não encontrado.');
            return;
        }

        this.servicoSelecionado.set(servico);
        this.modalAberto.set(true);
    }

    salvarServico(dados: DadosServico): void {
        const servico = this.servicoSelecionado();

        if (servico) {
            const atualizado = this.servicoService.atualizar(
                servico.id,
                dados
            );

            if (!atualizado) {
                this.mensagem.set('Serviço não encontrado.');
                return;
            }

            this.mensagem.set('Serviço atualizado com sucesso.');
        } else {
            this.servicoService.criar(dados);
            this.mensagem.set('Serviço cadastrado com sucesso.');
        }

        this.fecharModal();
    }

    fecharModal(): void {
        this.modalAberto.set(false);
        this.servicoSelecionado.set(null);
    }

    removerServico(id: number): void {
        const confirmado = window.confirm(
            'Deseja remover este serviço dos dados de demonstração?'
        );

        if (!confirmado) {
            return;
        }

        this.servicoService.remover(id);

        this.mensagem.set(
            'Serviço removido dos dados de demonstração.'
        );
    }
}
