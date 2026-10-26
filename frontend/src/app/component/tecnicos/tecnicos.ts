import { Component, computed, inject, signal } from '@angular/core';

import {
    LucideUsersRound,
    LucideCircleCheck,
    LucideUserRound,
    LucideWrench
} from '@lucide/angular';

import { ColunaTabela, Tabela } from '../../shared/tabela/tabela';
import { TecnicoService } from './tecnico-service';


@Component({
    selector: 'app-tecnicos',
    imports: [
        Tabela,
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
        this.mensagem.set(
            'O cadastro de técnicos ainda será implementado.'
        );
    }

    editarTecnico(id: number): void {
        this.mensagem.set(
            `A edição do técnico ${id} ainda será implementada.`
        );
    }

    removerTecnico(id: number): void {

        const confirmado = window.confirm(
            'Deseja remover este técnico dos dados de demonstração?'
        );

        if (!confirmado) return;

        this.tecnicoService.remover(id);

        this.mensagem.set(
            'Técnico removido dos dados de demonstração.'
        );
    }
}