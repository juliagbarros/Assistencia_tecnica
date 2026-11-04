
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Tecnico {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    especialidade: string;
    ativo: boolean;
}

export interface DadosTecnico {
    nome: string;
    telefone: string;
    email: string;
    especialidade: string;
    ativo: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class TecnicoService {

    private readonly http = inject(HttpClient);

    readonly URL = 'http://localhost:8080/api/tecnicos';

    private readonly tecnicos = signal<Tecnico[]>([]);

    listar() {
        return this.tecnicos.asReadonly();
    }

    carregar(): void {
        this.http.get<Tecnico[]>(this.URL).subscribe({
            next: (dados) => {
                this.tecnicos.set(dados);
            },
            error: (erro) => {
                console.error('Erro ao buscar técnicos:', erro);
            }
        });
    }

    criar(dados: DadosTecnico) {
        return this.http.post<Tecnico>(this.URL, dados);
    }

    atualizar(id: number, dados: DadosTecnico) {
        return this.http.put<void>(`${this.URL}/${id}`, dados);
    }

    remover(id: number) {
        return this.http.delete<void>(`${this.URL}/${id}`);
    }
}
