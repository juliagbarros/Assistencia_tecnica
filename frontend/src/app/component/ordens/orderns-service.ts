import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';

export type StatusOrdem =
    | 'Aberta'
    | 'Em atendimento'
    | 'Concluída'
    | 'Entregue';

export interface OrdemServico extends RegistroTabela {
    numero: string;
    cliente: string;
    aparelho: string;
    tecnico: string;
    abertura: string;
    status: StatusOrdem;
}

@Injectable({
    providedIn: 'root'
})
export class OrdemService {

    private readonly ordens = signal<OrdemServico[]>([
        {
            id: 1,
            numero: 'OS-0001',
            cliente: 'João Silva',
            aparelho: 'Notebook Dell',
            tecnico: 'Carlos',
            abertura: '24/10/2026',
            status: 'Aberta'
        },
        {
            id: 2,
            numero: 'OS-0002',
            cliente: 'Júlia Barros',
            aparelho: 'Samsung Galaxy',
            tecnico: 'Marcos',
            abertura: '23/10/2026',
            status: 'Em atendimento'
        },
        {
            id: 3,
            numero: 'OS-0003',
            cliente: 'Pedro Oliveira',
            aparelho: 'Computador Gamer',
            tecnico: 'Carlos',
            abertura: '21/10/2026',
            status: 'Concluída'
        },
        {
            id: 4,
            numero: 'OS-0004',
            cliente: 'Ana Costa',
            aparelho: 'iPhone 13',
            tecnico: 'Marcos',
            abertura: '20/10/2026',
            status: 'Entregue'
        }
    ]);

    listar() {
        return this.ordens.asReadonly();
    }

    remover(id: number): void {
        this.ordens.update(ordens =>
            ordens.filter(ordem => ordem.id !== id)
        );
    }
}