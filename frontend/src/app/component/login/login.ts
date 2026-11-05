import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  email = '';
  senha = '';

  mensagem = signal('');
  carregando = signal(false);

  entrar(form: NgForm): void {
    if (this.carregando()) {
      return;
    }

    this.mensagem.set('');

    if (form.invalid || !this.email.trim() || !this.senha.trim()) {
      this.mensagem.set('Preencha um e-mail válido e a senha.');
      return;
    }

    this.carregando.set(true);

    this.http
      .post<unknown>('http://localhost:8080/api/auth/login', {
        email: this.email.trim(),
        senha: this.senha,
      })
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: () => {
          this.senha = '';
          void this.router.navigate(['/clientes']);
        },
        error: (erro: HttpErrorResponse) => {
          if (erro.status === 0) {
            this.mensagem.set(
              'Não foi possível acessar o servidor. Verifique o backend e a configuração de CORS.'
            );
          } else if (erro.status === 401 || erro.status === 403) {
            this.mensagem.set('Login recusado. Verifique suas credenciais.');
          } else if (erro.status === 400) {
            this.mensagem.set('Verifique o e-mail e a senha informados.');
          } else {
            this.mensagem.set('Não foi possível fazer login. Tente novamente.');
          }
        },
      });
  }
}