
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ItemOrdem {
    id: number;
    ordemId: number;
    servicoId: number;
    servicoNome: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export interface DadosItemOrdem {
    ordemId: number;
    servicoId: number;
    quantidade: number;
    precoUnitario: number;
}

@Injectable({
    providedIn: 'root'
})
export class ItemOrdemService {

    private readonly http = inject(HttpClient);

    readonly URL = 'http://localhost:8080/api/ordens';

    private readonly itens = signal<ItemOrdem[]>([]);

    listar() {
        console.log(this.itens())
        return this.itens.asReadonly();
    }

    carregar(ordemId: number): void {
        this.http.get<ItemOrdem[]>(
            `${this.URL}/${ordemId}/itens`
        ).subscribe({
            next: (dados) => {
            console.log('ITENS RECEBIDOS DA API:', dados);
            console.table(dados);
                this.itens.set(dados);
            },
            error: (erro) => {
                console.error('Erro ao buscar itens da OS:', erro);
            }
        });
    }

    criar(dados: DadosItemOrdem) {
        return this.http.post<ItemOrdem>(
            `${this.URL}/${dados.ordemId}/itens`,
            dados
        );
    }

    atualizar(id: number, dados: DadosItemOrdem) {
        return this.http.put<void>(
            `${this.URL}/${dados.ordemId}/itens/${id}`,
            dados
        );
    }

    remover(ordemId: number, id: number) {
        return this.http.delete<void>(
            `${this.URL}/${ordemId}/itens/${id}`
        );
    }
}
