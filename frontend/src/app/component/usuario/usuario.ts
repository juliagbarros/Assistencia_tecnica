
import {
    Component,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';



import {
    Usuario,
    DadosUsuario,
    UsuarioService
} from './usuario-service';

import {
    FormularioUsuario
} from './formulario-usuario/formulario-usuario';
import { Modal } from '../../shared/modal/modal';
import { Tabela } from '../../shared/tabela/tabela';

@Component({
    selector: 'app-usuarios',
    imports: [
        Tabela,
        Modal,
        FormularioUsuario
    ],
    templateUrl: './usuario.html',
    styleUrl: './usuario.scss'
})
export class Usuarios implements OnInit {

    private readonly usuarioService = inject(UsuarioService);

    readonly usuarios = this.usuarioService.listar();

    readonly modalAberto = signal(false);
    readonly usuarioSelecionado = signal<Usuario | null>(null);

    readonly processando = signal(false);
    readonly mensagem = signal('');
    readonly erro = signal('');

    readonly colunas = [
        { chave: 'nome', titulo: 'Nome' },
        { chave: 'email', titulo: 'E-mail' },
        { chave: 'perfil', titulo: 'Perfil' }
    ];

    readonly registros = computed(() =>
        this.usuarios().map(usuario => ({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil === 'Admin'
                ? 'Administrador'
                : 'Técnico'
        }))
    );

    ngOnInit(): void {
        this.usuarioService.carregar();
    }

    adicionarUsuario(): void {
        this.usuarioSelecionado.set(null);
        this.erro.set('');
        this.mensagem.set('');
        this.modalAberto.set(true);
    }

    editarUsuario(id: number): void {
        const usuario = this.usuarios().find(
            usuario => usuario.id === id
        );

        if (!usuario) {
            this.erro.set('Usuário não encontrado.');
            return;
        }

        this.usuarioSelecionado.set(usuario);
        this.erro.set('');
        this.mensagem.set('');
        this.modalAberto.set(true);
    }

    salvarUsuario(dados: DadosUsuario): void {
        if (this.processando()) {
            return;
        }

        this.processando.set(true);
        this.erro.set('');
        this.mensagem.set('');

        const usuario = this.usuarioSelecionado();

        if (usuario) {
            this.usuarioService.atualizar(usuario.id, dados)
                .subscribe({
                    next: () => {
                        this.usuarioService.carregar();
                        this.processando.set(false);
                        this.mensagem.set(
                            'Usuário atualizado com sucesso.'
                        );
                        this.fecharModal();
                    },
                    error: (erro) => {
                        console.error(erro);
                        this.processando.set(false);
                        this.erro.set(
                            erro.error?.mensagem ??
                            'Erro ao atualizar usuário.'
                        );
                    }
                });

            return;
        }

        this.usuarioService.criar(dados).subscribe({
            next: () => {
                this.usuarioService.carregar();
                this.processando.set(false);
                this.mensagem.set(
                    'Usuário cadastrado com sucesso.'
                );
                this.fecharModal();
            },
            error: (erro) => {
                console.error(erro);
                this.processando.set(false);
                this.erro.set(
                    erro.error?.mensagem ??
                    'Erro ao cadastrar usuário.'
                );
            }
        });
    }

    removerUsuario(id: number): void {
        if (this.processando()) {
            return;
        }

        const confirmado = window.confirm(
            'Deseja realmente excluir este usuário?'
        );

        if (!confirmado) {
            return;
        }

        this.processando.set(true);
        this.erro.set('');
        this.mensagem.set('');

        this.usuarioService.remover(id).subscribe({
            next: () => {
                this.usuarioService.carregar();
                this.processando.set(false);
                this.mensagem.set(
                    'Usuário removido com sucesso.'
                );
            },
            error: (erro) => {
                console.error(erro);
                this.processando.set(false);
                this.erro.set(
                    erro.error?.mensagem ??
                    'Erro ao remover usuário.'
                );
            }
        });
    }

    fecharModal(): void {
        if (this.processando()) {
            return;
        }

        this.modalAberto.set(false);
        this.usuarioSelecionado.set(null);
    }
}
