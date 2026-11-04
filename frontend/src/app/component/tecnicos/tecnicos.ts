
import {
    Component,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
    LucideUsersRound,
    LucideCircleCheck,
    LucideUserRound,
    LucideWrench
} from '@lucide/angular';

import {
    ColunaTabela,
    RegistroTabela,
    Tabela
} from '../../shared/tabela/tabela';

import {
    Tecnico,
    DadosTecnico,
    TecnicoService
} from './tecnico-service';

import { Modal } from '../../shared/modal/modal';

import { FormularioTecnico } from './formulario-tecnico/formulario-tecnico';

@Component({
    selector: 'app-tecnicos',
    imports: [
        RouterLink,
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
export class Tecnicos implements OnInit {

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

    readonly registros = computed<RegistroTabela[]>(() =>
        this.tecnicos().map(tecnico => ({
            id: tecnico.id,
            nome: tecnico.nome,
            telefone: tecnico.telefone,
            email: tecnico.email,
            especialidade: tecnico.especialidade,
            status: tecnico.ativo ? 'Ativo' : 'Inativo'
        }))
    );

    readonly totalTecnicos = computed(() =>
        this.tecnicos().length
    );

    readonly tecnicosAtivos = computed(() =>
        this.tecnicos().filter(tecnico => tecnico.ativo).length
    );

    readonly tecnicosInativos = computed(() =>
        this.tecnicos().filter(tecnico => !tecnico.ativo).length
    );

    readonly totalEspecialidades = computed(() =>
        new Set(
            this.tecnicos().map(tecnico => tecnico.especialidade)
        ).size
    );

    readonly mensagem = signal('');

    ngOnInit(): void {
        this.tecnicoService.carregar();
    }

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
            this.tecnicoService.atualizar(tecnico.id, dados).subscribe({
                next: () => {
                    this.tecnicoService.carregar();
                    this.mensagem.set('Técnico atualizado com sucesso.');
                    this.fecharModal();
                },
                error: (erro) => {
                    console.error(erro);
                    this.mensagem.set('Erro ao atualizar técnico.');
                }
            });

            return;
        }

        this.tecnicoService.criar(dados).subscribe({
            next: () => {
                this.tecnicoService.carregar();
                this.mensagem.set('Técnico cadastrado com sucesso.');
                this.fecharModal();
            },
            error: (erro) => {
                console.error(erro);
                this.mensagem.set('Erro ao cadastrar técnico.');
            }
        });
    }

    removerTecnico(id: number): void {
        if (!window.confirm('Deseja remover este técnico?')) {
            return;
        }

        this.tecnicoService.remover(id).subscribe({
            next: () => {
                this.tecnicoService.carregar();
                this.mensagem.set('Técnico removido com sucesso.');
            },
            error: (erro) => {
                console.error(erro);
                this.mensagem.set('Erro ao remover técnico.');
            }
        });
    }

    fecharModal(): void {
        this.modalAberto.set(false);
        this.tecnicoSelecionado.set(null);
    }
}
