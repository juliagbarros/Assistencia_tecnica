
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
    LucideUsersRound,
    LucideSmartphone,
    LucideWrench,
    LucideCircleCheck
} from '@lucide/angular';

import { ColunaTabela, RegistroTabela, Tabela } from '../../shared/tabela/tabela';
import { Modal } from '../../shared/modal/modal';
import { FormularioCliente } from './formulario-cliente/formulario-cliente';

import {
    Cliente,
    DadosCliente,
    ClienteService
} from './cliente-service';

@Component({
    selector: 'app-clientes',
    imports: [
        RouterLink,
        Tabela,
        Modal,
        FormularioCliente,
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

    readonly clientes = this.clienteService.listar();

    readonly colunas: ColunaTabela[] = [
        { chave: 'nome', titulo: 'Nome' },
        { chave: 'telefone', titulo: 'Telefone' },
        { chave: 'email', titulo: 'E-mail' },
        { chave: 'status', titulo: 'Status', tipo: 'status' }
    ];

    readonly registros = computed<RegistroTabela[]>(() => {
        return this.clientes();
    });

    readonly totalClientes = computed(() => {
        return this.clientes().length;
    });

    readonly mensagem = signal('');

    readonly modalAberto = signal(false);

    readonly clienteSelecionado = signal<Cliente | null>(null);

    adicionarCliente(): void {
        this.clienteSelecionado.set(null);
        this.modalAberto.set(true);
    }

    editarCliente(id: number): void {
        const cliente = this.clientes().find(
            cliente => cliente.id === id
        );

        if (!cliente) {
            this.mensagem.set('Cliente não encontrado.');
            return;
        }

        this.clienteSelecionado.set(cliente);
        this.modalAberto.set(true);
    }

    fecharModal(): void {
        this.modalAberto.set(false);
        this.clienteSelecionado.set(null);
    }

    salvarCliente(dados: DadosCliente): void {
        const cliente = this.clienteSelecionado();

        if (cliente) {
            const atualizado = this.clienteService.atualizar(
                cliente.id,
                dados
            );

            if (!atualizado) {
                this.mensagem.set('Cliente não encontrado.');
                return;
            }

            this.mensagem.set('Cliente atualizado com sucesso.');
        } else {
            this.clienteService.criar(dados);

            this.mensagem.set('Cliente cadastrado com sucesso.');
        }

        this.fecharModal();
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
