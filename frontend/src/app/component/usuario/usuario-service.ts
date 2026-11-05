
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Perfil = 'Admin' | 'Tecnico';

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    perfil: Perfil;
}

export interface DadosUsuario {
    nome: string;
    email: string;
    senha: string;
    perfil: Perfil;
}

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private readonly http = inject(HttpClient);

    private readonly URL = 'http://localhost:8080/api/usuarios';

    private readonly usuarios = signal<Usuario[]>([]);

    listar() {
        return this.usuarios.asReadonly();
    }

    carregar(): void {
        this.http.get<Usuario[]>(this.URL).subscribe({
            next: (dados) => {
                this.usuarios.set(dados);
            },
            error: (erro) => {
                console.error('Erro ao buscar usuários:', erro);
            }
        });
    }

    criar(dados: DadosUsuario) {
        return this.http.post<Usuario>(this.URL, dados);
    }

    atualizar(id: number, dados: DadosUsuario) {
        return this.http.put<Usuario>(
            `${this.URL}/${id}`,
            dados
        );
    }

    remover(id: number) {
        return this.http.delete<void>(
            `${this.URL}/${id}`
        );
    }
}
