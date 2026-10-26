import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';

export interface Tecnico extends RegistroTabela {
    nome: string;
    telefone: string;
    email: string;
    especialidade: string;
    status: 'Ativo' | 'Inativo';
}

@Injectable({
    providedIn: 'root'
})
export class TecnicoService {

    private readonly tecnicos = signal<Tecnico[]>([
        {
            id: 1,
            nome: 'Carlos Martins',
            telefone: '(81) 99999-1001',
            email: 'carlos@exemplo.com',
            especialidade: 'Hardware',
            status: 'Ativo'
        },
        {
            id: 2,
            nome: 'Ana Souza',
            telefone: '(81) 99999-1002',
            email: 'ana@exemplo.com',
            especialidade: 'Celulares',
            status: 'Ativo'
        },
        {
            id: 3,
            nome: 'Bruno Lima',
            telefone: '(81) 99999-1003',
            email: 'bruno@exemplo.com',
            especialidade: 'Software',
            status: 'Ativo'
        },
        {
            id: 4,
            nome: 'Mariana Costa',
            telefone: '(81) 99999-1004',
            email: 'mariana@exemplo.com',
            especialidade: 'Notebooks',
            status: 'Inativo'
        },
        {
            id: 5,
            nome: 'Pedro Oliveira',
            telefone: '(81) 99999-1005',
            email: 'pedro@exemplo.com',
            especialidade: 'Hardware',
            status: 'Ativo'
        }
    ]);

    listar() {
        return this.tecnicos.asReadonly();
    }

    remover(id: number): void {
        this.tecnicos.update(tecnicos =>
            tecnicos.filter(tecnico => tecnico.id !== id)
        );
    }
}