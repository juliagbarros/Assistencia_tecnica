import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';

export type TipoAparelho =
    | 'Celular'
    | 'Notebook'
    | 'Computador'
    | 'Tablet';

export interface Aparelho extends RegistroTabela {
    nome: string;
    tipo: TipoAparelho;
    marca: string;
    modelo: string;
    cliente: string;
    numeroSerie: string;
    status: 'Ativo' | 'Inativo';
}

@Injectable({
    providedIn: 'root'
})
export class AparelhoService {

    private readonly aparelhos = signal<Aparelho[]>([
        {
            id: 1,
            nome: 'Galaxy A54',
            tipo: 'Celular',
            marca: 'Samsung',
            modelo: 'SM-A546E',
            cliente: 'João Silva',
            numeroSerie: 'SN-0001',
            status: 'Ativo'
        },
        {
            id: 2,
            nome: 'Inspiron 15',
            tipo: 'Notebook',
            marca: 'Dell',
            modelo: 'Inspiron 3520',
            cliente: 'Maria Oliveira',
            numeroSerie: 'SN-0002',
            status: 'Ativo'
        },
        {
            id: 3,
            nome: 'iPhone 13',
            tipo: 'Celular',
            marca: 'Apple',
            modelo: 'A2633',
            cliente: 'Pedro Santos',
            numeroSerie: 'SN-0003',
            status: 'Ativo'
        },
        {
            id: 4,
            nome: 'PC Gamer',
            tipo: 'Computador',
            marca: 'Montado',
            modelo: 'Desktop personalizado',
            cliente: 'Ana Costa',
            numeroSerie: 'SN-0004',
            status: 'Inativo'
        },
        {
            id: 5,
            nome: 'Galaxy Tab S9',
            tipo: 'Tablet',
            marca: 'Samsung',
            modelo: 'SM-X710',
            cliente: 'Carlos Lima',
            numeroSerie: 'SN-0005',
            status: 'Ativo'
        }
    ]);

    listar() {
        return this.aparelhos.asReadonly();
    }

    remover(id: number): void {
        this.aparelhos.update(aparelhos =>
            aparelhos.filter(aparelho => aparelho.id !== id)
        );
    }
}