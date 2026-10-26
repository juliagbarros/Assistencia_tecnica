import { Component, computed, inject, signal } from '@angular/core';
import { ColunaTabela, RegistroTabela, Tabela } from '../../shared/tabela/tabela';
import { ServicoService } from './servico-service';

@Component({
  selector: 'app-servico',
  imports: [Tabela],
  templateUrl: './servico.html',
  styleUrl: './servico.scss',
})
export class Servico {

private readonly servicoService = inject(ServicoService);

    readonly servicos = this.servicoService.listar();

    readonly colunas: ColunaTabela[] = [
        { chave: 'nome', titulo: 'Nome' },
        { chave: 'descricao', titulo: 'Descrição' },
        { chave: 'preco', titulo: 'Preço' },
        { chave: 'status', titulo: 'Status', tipo: 'status' }
    ];

    readonly registros = computed<RegistroTabela[]>(() => {
        return this.servicos();
    });

    readonly mensagem = signal('');

    adicionarServico(): void {
        this.mensagem.set('Cadastro de serviços ainda não implementado.');
    }

    editarServico(id: number): void {
        this.mensagem.set(`Editar serviço ${id}.`);
    }

    removerServico(id: number): void {
        this.servicoService.remover(id);
    }

}
