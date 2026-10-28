
import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';

export type StatusAparelho =
    'Recebido' | 'Em manutenção' | 'Pronto' | 'Entregue';

export interface Aparelho extends RegistroTabela {
    cliente: string;
    tipo: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    status: StatusAparelho;
}

export interface DadosAparelho {
    cliente: string;
    tipo: string;
    marca: string;
    modelo: string;
    numeroSerie: string;
    status: StatusAparelho;
}

@Injectable({
    providedIn: 'root'
})
export class AparelhoService {

    private readonly aparelhos = signal<Aparelho[]>([
        {
            id: 1,
            cliente: 'Heitor Santana',
            tipo: 'Celular',
            marca: 'Samsung',
            modelo: 'Galaxy S24',
            numeroSerie: 'ABC123',
            status: 'Recebido'
        },
        {
            id: 2,
            cliente: 'João Paulo Menezes',
            tipo: 'Notebook',
            marca: 'Dell',
            modelo: 'Inspiron 15',
            numeroSerie: 'XYZ456',
            status: 'Em manutenção'
        }
    ]);

    listar() {
        return this.aparelhos.asReadonly();
    }

    criar(dados: DadosAparelho): void {
        const novoId = Math.max(
            0,
            ...this.aparelhos().map(aparelho => aparelho.id)
        ) + 1;

        const novoAparelho: Aparelho = {
            id: novoId,
            ...dados
        };

        this.aparelhos.update(aparelhos => [
            ...aparelhos,
            novoAparelho
        ]);
    }

    atualizar(id: number, dados: DadosAparelho): boolean {
        const existe = this.aparelhos().some(
            aparelho => aparelho.id === id
        );

        if (!existe) {
            return false;
        }

        this.aparelhos.update(aparelhos =>
            aparelhos.map(aparelho =>
                aparelho.id === id
                    ? { ...aparelho, ...dados }
                    : aparelho
            )
        );

        return true;
    }

    remover(id: number): void {
        this.aparelhos.update(aparelhos =>
            aparelhos.filter(aparelho => aparelho.id !== id)
        );
    }
}
