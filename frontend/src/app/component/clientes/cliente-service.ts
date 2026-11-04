
import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';
import { resetConsumerBeforeComputation } from '@angular/core/primitives/signals';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type StatusCliente = 'Ativo' | 'Inativo';

export interface Cliente extends RegistroTabela {
    nome: string;
    telefone: string;
    email: string;
    status: StatusCliente;
}

export interface DadosCliente {
    nome: string;
    telefone: string;
    email: string;
    status: StatusCliente;
}

@Injectable({
    providedIn: 'root'
})
export class ClienteService {

    constructor(private http : HttpClient){}

    readonly URL='http://localhost:8080/api/clientes'

    private readonly clientes = signal<Cliente[]>([
        
    ]);

    listar() {
        this.http.get<Cliente[]>(this.URL).subscribe({
            next:(res)=>
            {
                this.clientes.set(res)
                console.log(res)
                console.log(this.clientes())
            },
            error:(erro)=>{
                console.log(erro)
            }
        });
        return this.clientes.asReadonly()
    }

    criar(dados: DadosCliente): void {
        this.http.post<Cliente>(this.URL,dados).subscribe({
            next:(res)=>{
                this.clientes.update(clientes => [
                    ...clientes,res
                ])
                console.log(res)
                console.log(this.clientes)
            },
        })
       
    }

   atualizar(id: number, dados: DadosCliente): void {
    this.http.put<void>(`${this.URL}/${id}`, dados).subscribe({
        next: () => {
            this.clientes.update(clientes =>
                clientes.map(cliente =>
                    cliente.id === id
                        ? { ...cliente, ...dados }
                        : cliente
                )
            );
        },
        error: (erro) => {
            console.error('Erro ao atualizar cliente:', erro);
        }
    });
}

    remover(id: number): void {
       this.http.delete(this.URL+'/'+id).subscribe({
        next:()=> {
            this.clientes.update(clientes => clientes.filter(cliente => cliente.id !==id  ))
        }
       })
    }
}
