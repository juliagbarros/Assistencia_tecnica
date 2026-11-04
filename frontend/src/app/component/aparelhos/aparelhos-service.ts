
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ClienteReferencia {
    id: number;
    nome?: string;
}

export interface Aparelho {
    id: number
    clienteId: number;
    clienteNome: string;
    tipo: string;
    marca: string;
    modelo: string;
    numeroSerie: string | null;
    observacoes: string | null;
}

export interface DadosAparelho {
    clienteId: number;
    tipo: string;
    marca: string;
    modelo: string;
    numeroSerie: string | null;
    observacoes: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class AparelhoService {

    private readonly http = inject(HttpClient);

    readonly URL = 'http://localhost:8080/api/aparelhos';

    private readonly aparelhos = signal<Aparelho[]>([]);

    listar() {
        return this.aparelhos.asReadonly();
    }

    carregar(): void {
        this.http.get<Aparelho[]>(this.URL).subscribe({
            next: (dados) => {
                this.aparelhos.set(dados);
                console.log(dados)
            },
            error: (erro) => {
                console.error('Erro ao buscar aparelhos:', erro);
            }
        });
    }

    criar(dados: DadosAparelho) {
        return this.http.post<Aparelho>(this.URL, dados);
    }

    atualizar(id: number, dados: DadosAparelho) {
        return this.http.put<void>(`${this.URL}/${id}`, dados);
    }

    remover(id: number) {
        return this.http.delete<void>(`${this.URL}/${id}`);
    }
}
