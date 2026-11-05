
import {
    Component,
    effect,
    input,
    output,
    signal
} from '@angular/core';

import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    Usuario,
    DadosUsuario,
    Perfil
} from '../usuario-service';

@Component({
    selector: 'app-formulario-usuario',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-usuario.html',
    styleUrl: './formulario-usuario.scss'
})
export class FormularioUsuario {

    readonly usuario = input<Usuario | null>(null);

    readonly salvar = output<DadosUsuario>();
    readonly cancelar = output<void>();

    readonly mostrarSenha = signal(false);
    readonly senhasDiferentes = signal(false);

    readonly formulario = new FormGroup({
        nome: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        email: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.email
            ]
        }),

        perfil: new FormControl<Perfil | null>(null, {
            validators: [Validators.required]
        }),

        senha: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(8)
            ]
        }),

        confirmarSenha: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        })
    });

    constructor() {
        effect(() => {
            const usuario = this.usuario();

            this.formulario.reset({
                nome: usuario?.nome ?? '',
                email: usuario?.email ?? '',
                perfil: usuario?.perfil ?? null,
                senha: '',
                confirmarSenha: ''
            });

            this.senhasDiferentes.set(false);
            this.mostrarSenha.set(false);
        });
    }

    enviar(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        const dados = this.formulario.getRawValue();

        if (!dados.perfil) {
            return;
        }

        if (dados.senha !== dados.confirmarSenha) {
            this.senhasDiferentes.set(true);
            return;
        }

        this.senhasDiferentes.set(false);

        this.salvar.emit({
            nome: dados.nome.trim(),
            email: dados.email.trim(),
            senha: dados.senha,
            perfil: dados.perfil
        });
    }
}
