import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
    LucideUsersRound,
    LucideSmartphone,
    LucideWrench,
    LucideCircleCheck
} from '@lucide/angular';



import { ColunaTabela, RegistroTabela, Tabela } from '../../shared/tabela/tabela';
import { ClienteService } from './cliente-service';

@Component({
    selector: 'app-clientes',
    imports: [
        RouterLink,
        Tabela,
        LucideUsersRound,
        LucideSmartphone,
        LucideWrench,
        LucideCircleCheck
    ],
    templateUrl: './clientes.html',
    styleUrl: './clientes.scss'
})
export class Clientes {

    private readonly clienteService = inject(ClienteService);

    // Dados recebidos do service
    readonly clientes = this.clienteService.listar();

    // Configuração exclusiva da tabela de clientes
    readonly colunas: ColunaTabela[] = [
        { chave: 'nome', titulo: 'Nome' },
        { chave: 'telefone', titulo: 'Telefone' },
        { chave: 'email', titulo: 'E-mail' },
        { chave: 'status', titulo: 'Status', tipo: 'status' }
    ];

    // Registros enviados ao componente reutilizável
    readonly registros = computed<RegistroTabela[]>(() => {
        return this.clientes();
    });

    readonly totalClientes = computed(() => {
        return this.clientes().length;
    });

    readonly mensagem = signal('');

    adicionarCliente(): void {
        this.mensagem.set(
            'O formulário de cadastro será implementado posteriormente.'
        );
    }

    editarCliente(id: number): void {
        this.mensagem.set(
            `O formulário de edição do cliente ${id} será implementado posteriormente.`
        );
    }

    removerCliente(id: number): void {
        const confirmar = window.confirm(
            'Deseja remover este cliente dos dados de demonstração?'
        );

        if (!confirmar) {
            return;
        }

        this.clienteService.remover(id);
        this.mensagem.set('Cliente removido dos dados de demonstração.');
    }
}