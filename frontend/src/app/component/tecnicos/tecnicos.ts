
import { Component, computed, inject, signal } from '@angular/core';

import {
    LucideUsersRound,
    LucideCircleCheck,
    LucideUserRound,
    LucideWrench
} from '@lucide/angular';

import { ColunaTabela, Tabela } from '../../shared/tabela/tabela';

import {
    Tecnico,
    DadosTecnico,
    TecnicoService
} from './tecnico-service';

import { Modal } from '../../shared/modal/modal';

import {
    FormularioTecnico
} from './formulario-tecnico/formulario-tecnico';

@Component({
    selector: 'app-tecnicos',
    imports: [
        Tabela,
        Modal,
        FormularioTecnico,
        LucideUsersRound,
        LucideCircleCheck,
        LucideUserRound,
        LucideWrench
    ],
    templateUrl: './tecnicos.html',
    styleUrl: './tecnicos.scss'
})
export class Tecnicos {

    private readonly tecnicoService = inject(TecnicoService);

    readonly tecnicos = this.tecnicoService.listar();

    readonly modalAberto = signal(false);

    readonly tecnicoSelecionado = signal<Tecnico | null>(null);

    readonly colunas: ColunaTabela[] = [
        { chave: 'nome', titulo: 'Nome' },
        { chave: 'telefone', titulo: 'Telefone' },
        { chave: 'email', titulo: 'E-mail' },
        { chave: 'especialidade', titulo: 'Especialidade' },
        { chave: 'status', titulo: 'Status', tipo: 'status' }
    ];

    readonly totalTecnicos = computed(() =>
        this.tecnicos().length
    );

    readonly tecnicosAtivos = computed(() =>
        this.tecnicos().filter(tecnico =>
            tecnico.status === 'Ativo'
        ).length
    );

    readonly tecnicosInativos = computed(() =>
        this.tecnicos().filter(tecnico =>
            tecnico.status === 'Inativo'
        ).length
    );

    readonly totalEspecialidades = computed(() => {
        const especialidades = this.tecnicos().map(
            tecnico => tecnico.especialidade
        );

        return new Set(especialidades).size;
    });

    readonly mensagem = signal('');

    adicionarTecnico(): void {
        this.tecnicoSelecionado.set(null);
        this.modalAberto.set(true);
    }

    editarTecnico(id: number): void {
        const tecnico = this.tecnicos().find(
            tecnico => tecnico.id === id
        );

        if (!tecnico) {
            this.mensagem.set('Técnico não encontrado.');
            return;
        }

        this.tecnicoSelecionado.set(tecnico);
        this.modalAberto.set(true);
    }

    salvarTecnico(dados: DadosTecnico): void {
        const tecnico = this.tecnicoSelecionado();

        if (tecnico) {
            const atualizado = this.tecnicoService.atualizar(
                tecnico.id,
                dados
            );

            if (!atualizado) {
                this.mensagem.set('Técnico não encontrado.');
                return;
            }

            this.mensagem.set('Técnico atualizado com sucesso.');
        } else {
            this.tecnicoService.criar(dados);
            this.mensagem.set('Técnico cadastrado com sucesso.');
        }

        this.fecharModal();
    }

    fecharModal(): void {
        this.modalAberto.set(false);
        this.tecnicoSelecionado.set(null);
    }

    removerTecnico(id: number): void {
        const confirmado = window.confirm(
            'Deseja remover este técnico dos dados de demonstração?'
        );

        if (!confirmado) {
            return;
        }

        this.tecnicoService.remover(id);

        this.mensagem.set(
            'Técnico removido dos dados de demonstração.'
        );
    }
}
