import { Component, inject, output, signal } from '@angular/core';
import { ColunaTabela, Tabela } from '../../shared/tabela/tabela';
import { single } from 'rxjs';
import { UsuarioService } from './usuario-service';

@Component({
  selector: 'app-usuario',
  imports: [Tabela],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss',
})
export class Usuario {

  
  registros = []

  readonly colunas:ColunaTabela[] =[
    {chave:"Nome" ,titulo:"Nome"},
    {chave:"Email",titulo:"Email"},
    {chave:"Perfil",titulo:"Perfil"}

  ]

}
