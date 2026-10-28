
import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';

export type StatusServico = 'Ativo' | 'Inativo';

export interface Servico extends RegistroTabela {
    nome: string;
    categoria: string;
    descricao: string;
    valor: number;
    tempoEstimado: string;
    status: StatusServico;
}

export interface DadosServico {
    nome: string;
    categoria: string;
    descricao: string;
    valor: number;
    tempoEstimado: string;
    status: StatusServico;
}

@Injectable({
    providedIn: 'root'
})
export class ServicoService {

    private readonly servicos = signal<Servico[]>([
        {
            id: 1,
            nome: 'Troca de tela',
            categoria: 'Celular',
            descricao: 'Substituição da tela do aparelho',
            valor: 250,
            tempoEstimado: '2 horas',
            status: 'Ativo'
        },
        {
            id: 2,
            nome: 'Limpeza interna',
            categoria: 'Computador',
            descricao: 'Limpeza e manutenção preventiva',
            valor: 100,
            tempoEstimado: '1 hora',
            status: 'Ativo'
        },
        {
            id: 3,
            nome: 'Formatação',
            categoria: 'Notebook',
            descricao: 'Reinstalação do sistema operacional',
            valor: 150,
            tempoEstimado: '3 horas',
            status: 'Ativo'
        },
        {
            id: 4,
            nome: 'Troca de bateria',
            categoria: 'Celular',
            descricao: 'Substituição da bateria',
            valor: 180,
            tempoEstimado: '1 hora',
            status: 'Inativo'
        }
    ]);

    listar() {
        return this.servicos.asReadonly();
    }

    criar(dados: DadosServico): void {
        const novoId = Math.max(
            0,
            ...this.servicos().map(servico => servico.id)
        ) + 1;

        const novoServico: Servico = {
            id: novoId,
            ...dados
        };

        this.servicos.update(servicos => [
            ...servicos,
            novoServico
        ]);
    }

    atualizar(id: number, dados: DadosServico): boolean {
        const existe = this.servicos().some(
            servico => servico.id === id
        );

        if (!existe) {
            return false;
        }

        this.servicos.update(servicos =>
            servicos.map(servico =>
                servico.id === id
                    ? { ...servico, ...dados }
                    : servico
            )
        );

        return true;
    }

    remover(id: number): void {
        this.servicos.update(servicos =>
            servicos.filter(servico => servico.id !== id)
        );
    }
}
