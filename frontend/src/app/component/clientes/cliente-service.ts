
import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';

export type StatusCliente = 'Ativo' | 'Inativo';

export interface Cliente extends RegistroTabela {
    nome: string;
    telefone: string;
    email: string;
    status: StatusCliente;
}

export interface DadosCliente {
    nome: string;
    telefone: string;
    email: string;
    status: StatusCliente;
}

@Injectable({
    providedIn: 'root'
})
export class ClienteService {

    private readonly clientes = signal<Cliente[]>([
        {
            id: 1,
            nome: 'Heitor Santana',
            telefone: '(81) 91234-5678',
            email: 'heitor@email.com',
            status: 'Ativo'
        },
        {
            id: 2,
            nome: 'Júlia Gabrielle Barros',
            telefone: '(81) 91234-5678',
            email: 'julia@email.com',
            status: 'Ativo'
        },
        {
            id: 3,
            nome: 'João Paulo Menezes',
            telefone: '(81) 91234-5678',
            email: 'joao@email.com',
            status: 'Ativo'
        }
    ]);

    listar() {
        return this.clientes.asReadonly();
    }

    criar(dados: DadosCliente): void {
        const novoId = Math.max(
            0,
            ...this.clientes().map(cliente => cliente.id)
        ) + 1;

        const novoCliente: Cliente = {
            id: novoId,
            ...dados
        };

        this.clientes.update(clientes => [
            ...clientes,
            novoCliente
        ]);
    }

    atualizar(id: number, dados: DadosCliente): boolean {
        const existe = this.clientes().some(
            cliente => cliente.id === id
        );

        if (!existe) {
            return false;
        }

        this.clientes.update(clientes =>
            clientes.map(cliente =>
                cliente.id === id
                    ? { ...cliente, ...dados }
                    : cliente
            )
        );

        return true;
    }

    remover(id: number): void {
        this.clientes.update(clientes =>
            clientes.filter(cliente => cliente.id !== id)
        );
    }
}
