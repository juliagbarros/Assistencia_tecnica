import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';
export interface Cliente extends RegistroTabela {
    nome: string;
    telefone: string;
    email: string;
    status: string;
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

    remover(id: number): void {
        this.clientes.update(clientes =>
            clientes.filter(cliente => cliente.id !== id)
        );
    }
}