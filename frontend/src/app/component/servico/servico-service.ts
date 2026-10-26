import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';

export interface Servico extends RegistroTabela {
    nome: string;
    descricao: string;
    preco: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class ServicoService {

    private readonly servicos = signal<Servico[]>([
        {
            id: 1,
            nome: 'Limpeza interna',
            descricao: 'Limpeza dos componentes internos',
            preco: 'R$ 100,00',
            status: 'Disponível'
        },
        {
            id: 2,
            nome: 'Diagnóstico de defeitos',
            descricao: 'Análise de hardware e software',
            preco: 'R$ 60,00',
            status: 'Disponível'
        },
        {
            id: 3,
            nome: 'Troca de tela',
            descricao: 'Substituição de tela danificada',
            preco: 'R$ 150,00',
            status: 'Indisponível'
        }
    ]);

    listar() {
        return this.servicos.asReadonly();
    }

    remover(id: number): void {
        this.servicos.update(servicos =>
            servicos.filter(servico => servico.id !== id)
        );
    }
}