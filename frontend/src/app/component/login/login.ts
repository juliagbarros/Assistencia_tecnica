import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
   mensagem: string = '';

  entrar(event: Event): void {
    event.preventDefault();

    this.mensagem = 'A autenticação será implementada posteriormente.';
  }

}
