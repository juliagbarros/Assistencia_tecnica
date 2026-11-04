import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";

export enum perfil{
    Admin = 'Admin', 
    Tecnico = 'Tecnico'
}

export interface usuario{
    id:number,
    nome:string,
    email:string,
    perfil:string
}


export interface dadosUsuario{
    nome:string,
    senha:string,
    email:string,
    perfil:string
}


export class UsuarioService{

    private readonly http = inject(HttpClient);

    readonly URL = 'http://localhost:8080/api/usuarios';


    carregar(){
      return  this.http.get<usuario[]>(this.URL);
    }

    criar(dados:dadosUsuario){
       return this.http.post<usuario>(this.URL,dados);
    }

    atualizar(id:number,dados:dadosUsuario){
        return this.http.put<void>(this.URL+'/'+id,dados)
    }

    deletar(id:number){
        return this.http.delete<void>(this.URL+'/'+id)
    }

}