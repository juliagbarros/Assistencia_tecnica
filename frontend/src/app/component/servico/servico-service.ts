import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroTabela } from '../../shared/tabela/tabela';

export type StatusServico = 'Ativo' | 'Inativo';

interface ServicoApi {
  id: number;
  nome: string;
  descricao: string | null;
  precoPadrao: number;
  ativo: boolean;
}

interface DadosServicoApi {
  nome: string;
  descricao: string;
  precoPadrao: number;
  ativo: boolean;
}

export interface Servico extends RegistroTabela {
  nome: string;
  descricao: string;
  precoPadrao: number;
  status: StatusServico;
}

export interface DadosServico {
  nome: string;
  descricao: string;
  precoPadrao: number;
  status: StatusServico;
}

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private readonly http = inject(HttpClient);

  private readonly URL = 'http://localhost:8080/api/servicos';

  private readonly servicos = signal<Servico[]>([]);

  listar() {
    this.http.get<ServicoApi[]>(this.URL).subscribe(res => {
      this.servicos.set(
        res.map(servico => this.converterParaTela(servico))
      );
    });

    return this.servicos.asReadonly();
  }

  criar(dados: DadosServico): void {
    this.http
      .post<ServicoApi>(this.URL, this.converterParaApi(dados))
      .subscribe(res => {
        const servico = this.converterParaTela(res);

        this.servicos.update(lista => [...lista, servico]);
      });
  }

  atualizar(id: number, dados: DadosServico): void {
    this.http
      .put<ServicoApi>(
        `${this.URL}/${id}`,
        this.converterParaApi(dados)
      )
      .subscribe(res => {
        const atualizado = this.converterParaTela(res);

        this.servicos.update(lista =>
          lista.map(servico =>
            servico.id === id ? atualizado : servico
          )
        );
      });
  }

  remover(id: number): void {
    this.http.delete<void>(`${this.URL}/${id}`).subscribe(() => {
      this.servicos.update(lista =>
        lista.filter(servico => servico.id !== id)
      );
    });
  }

  private converterParaTela(servico: ServicoApi): Servico {
    return {
      id: servico.id,
      nome: servico.nome,
      descricao: servico.descricao ?? '',
      precoPadrao: servico.precoPadrao,
      status: servico.ativo ? 'Ativo' : 'Inativo'
    };
  }

  private converterParaApi(dados: DadosServico): DadosServicoApi {
    return {
      nome: dados.nome,
      descricao: dados.descricao,
      precoPadrao: dados.precoPadrao,
      ativo: dados.status === 'Ativo'
    };
  }
}